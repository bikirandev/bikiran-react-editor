import { useRef, useEffect, useState } from "react";
import styles from "./Editor.module.css";
import AxiosAuth from "./AxiosAPI";
import ToolbarComp from "./ToolbarComp";

type TProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  imageUploadUrl: string;
  refreshToken: string;
  userUid: string;
};

export default function BikEditor({
  content = "",
  setContent,
  imageUploadUrl,
  refreshToken = "",
  userUid = "",
}: TProps) {
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    unorderedList: false,
    orderedList: false,
  });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  const auth = {
    currentUser: { refreshToken: refreshToken || "", userUid: userUid || "" },
  };

  const updateActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setActiveFormats({
        bold: false,
        italic: false,
        unorderedList: false,
        orderedList: false,
      });
      return;
    }

    const range = selection.getRangeAt(0);
    const parentElement =
      range.commonAncestorContainer.nodeType === 1
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentNode;

    const isBold =
      parentElement &&
      window.getComputedStyle(parentElement as Element).fontWeight === "bold";
    const isItalic =
      parentElement &&
      window.getComputedStyle(parentElement as Element).fontStyle === "italic";
    const isUnorderedList =
      parentElement && (parentElement as HTMLElement).closest("ul") !== null;
    const isOrderedList =
      parentElement && (parentElement as HTMLElement).closest("ol") !== null;

    setActiveFormats({
      bold: !!isBold,
      italic: !!isItalic,
      unorderedList: !!isUnorderedList,
      orderedList: !!isOrderedList,
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move the cursor to the end of the inserted text
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update your content state
    setContent(editorRef.current?.innerHTML || "");
  };

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value ?? undefined);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
    updateActiveFormats(); // <-- add this
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);

    return () => {
      document.removeEventListener("selectionchange", updateActiveFormats);
    };
  }, []);

  const handleUndo = () => {
    document.execCommand("undo", false);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleRedo = () => {
    document.execCommand("redo", false);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const uploadFile = async (file: FormData) => {
    try {
      const { data } = await AxiosAuth.currentUserAuth(auth)
        .setUrl(imageUploadUrl)
        .put(file);

      if (data?.error) {
        throw new Error(data?.message || "Upload failed");
      }

      return {
        error: false,
        data: data?.data?.publicUrl,
      };
    } catch (e: any) {
      return {
        error: true,
        data: null,
        message: e?.toString() || "Upload failed",
      };
    }
  };

  const handleImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
      const div = document.createElement("div");
      div.id = "uploading";
      div.innerText = "<Uploading>...";
      if (editorRef.current) {
        editorRef.current.appendChild(div);
      }

      try {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];
        const formData = new FormData();
        if (file) {
          setErrorMsg("");
          const blob = new Blob([file], { type: file.type });
          formData.append("file", blob, file.name);

          const { error, data, message } = await uploadFile(formData);
          if (error) {
            throw new Error(message);
          }

          const img = document.createElement("img");
          img.src = data;
          img.style.maxWidth = "100%";

          if (editorRef.current) {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
              editorRef.current.appendChild(img);
            } else {
              const range = selection.getRangeAt(0);
              range.insertNode(img);
            }
            setContent(editorRef.current.innerHTML);
          }
        }
      } catch (e: any) {
        setErrorMsg(e?.message);
        console.log(e, "Error----");
      } finally {
        const uploading = document.getElementById("uploading");
        if (uploading) {
          uploading.remove();
        }
      }
    };

    input.click();
  };

  useEffect(() => {
    // Set a consistent block separator to avoid unexpected formatting inheritance
    document.execCommand("defaultParagraphSeparator", false, "div");

    if (editorRef.current) {
      editorRef.current.innerHTML = content || "";
    }
  }, []);

  return (
    <div>
      <div className={styles.editorContainer}>
        <ToolbarComp
          execCommand={execCommand}
          handleImage={handleImage}
          activeFormats={activeFormats}
          undo={handleUndo}
          redo={handleRedo}
        />

        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable
          suppressContentEditableWarning={true}
          onPaste={handlePaste} // <-- ADD THIS LINE
          onInput={() => {
            setContent(editorRef.current?.innerHTML || "");
          }}
        ></div>
      </div>
      {errorMsg?.length ? (
        <div className="text-red-400">
          <span className="font-medium">Upload Error:</span> {errorMsg}
        </div>
      ) : null}
    </div>
  );
}
