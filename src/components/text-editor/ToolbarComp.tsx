import { FC } from "react";
import styles from "./Editor.module.css";

type TProps = {
  execCommand: (command: string, value: string | null) => void;
  undo: () => void;
  redo: () => void;
  activeFormats: {
    bold: boolean;
    italic: boolean;
    unorderedList: boolean;
    orderedList: boolean;
  };
  handleImage: () => void;
};

const SelectField: FC<{ execCommand: TProps["execCommand"] }> = ({
  execCommand,
}) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <select
        className={styles.select}
        onChange={(ev) => execCommand("fontSize", ev.target.value)}
        defaultValue=""
        title="Font Size"
      >
        <option value="">Font Size</option>
        <option value="1">10px</option>
        <option value="2">13px</option>
        <option value="3">16px</option>
        <option value="4">18px</option>
        <option value="5">24px</option>
        <option value="6">32px</option>
        <option value="7">48px</option>
      </select>

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "2px",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          outline: "none",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="12" fill="white" />
          <path
            opacity="0.9"
            d="M13.0552 5.28358C13.1036 5.22866 13.1278 5.20124 13.1478 5.17629C13.5222 4.70707 13.5222 4.04124 13.1477 3.57204C13.1278 3.54709 13.1036 3.51965 13.0551 3.46475C13.0293 3.43551 13.0164 3.42088 13.0036 3.40722C12.7694 3.15692 12.4448 3.01052 12.1022 3.00055C12.0835 3 12.0639 3 12.0249 3H5.40364C5.36462 3 5.34512 3 5.32642 3.00055C4.98373 3.01052 4.65921 3.15692 4.42495 3.40722C4.41217 3.42088 4.39926 3.43551 4.37344 3.46475C4.32498 3.51965 4.30076 3.54709 4.28084 3.57204C3.90639 4.04123 3.90639 4.70707 4.28083 5.17629C4.30074 5.20124 4.32497 5.22866 4.37343 5.28358L6.78621 8.01689C7.68484 9.0349 8.13415 9.54388 8.71429 9.54388C9.29442 9.54388 9.74373 9.0349 10.6424 8.01689L13.0552 5.28358Z"
            fill="#130F40"
          />
        </svg>
      </div>
    </div>
  );
};

const ToolbarComp: FC<TProps> = ({
  execCommand,
  undo,
  redo,
  handleImage,
  activeFormats,
}) => {
  return (
    <div className={styles.toolbar}>
      <button className={styles.toolButton} onClick={undo} title="Undo">
        Undo
      </button>

      <button className={styles.toolButton} onClick={redo} title="Redo">
        Redo
      </button>
      <button
        className={`${styles.toolButton} ${activeFormats.bold ? styles.active : ""}`}
        onClick={() => execCommand("bold", null)}
        title="Bold"
      >
        <b>B</b>
      </button>

      <button
        className={`${styles.toolButton} ${activeFormats.italic ? styles.active : ""}`}
        onClick={() => execCommand("italic", null)}
        title="Italic"
      >
        <i>I</i>
      </button>

      <SelectField execCommand={execCommand} />

      <button
        className={`${styles.toolButton} ${activeFormats.unorderedList ? styles.active : ""}`}
        onClick={() => execCommand("insertUnorderedList", null)}
        title="Unordered List"
      >
        • List
      </button>

      <button
        className={`${styles.toolButton} ${activeFormats.orderedList ? styles.active : ""}`}
        onClick={() => execCommand("insertOrderedList", null)}
        title="Ordered List"
      >
        1. List
      </button>

      <button
        className={styles.toolButton}
        onClick={handleImage}
        title="Insert Image"
      >
        🖼️ Image
      </button>
    </div>
  );
};

export default ToolbarComp;
