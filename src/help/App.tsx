import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from "react";
import { HiOutlineViewfinderCircle, HiOutlineBackspace } from "react-icons/hi2";
import { Marked } from "../src";
import { appWindow } from "@tauri-apps/api/window";

function App() {
  const setting_str =
    "##### Markdown \n" +
    "\n" +
    "| Element | Markdown Syntax |\n" +
    "|:--|:--|\n" +
    "|**Heading**|<span>`# H1`</span> <span>`## H2`</span><br><span>`### H3`</span> <span>`#### H4`</span><br> <span>`##### H5`</span> <span>`###### H6`</span>|\n" +
    "|**Bold**|`**bold text**`|\n" +
    "|**Italic**|`*italic text*`|\n" +
    "|**Blockquote**|`> blockquote`|\n" +
    "|**Ordered List**|<code>1. First item</code><br><code>2. Second item</code><br><code>3. Third item</code>|\n" +
    "|**Unordered List**|<code>- First item</code><br><code>- Second item</code><br><code>- Third item</code>|\n" +
    "|**Code**|``` `code` ```|\n" +
    "|**Horizontal Rule**|`---`|\n" +
    "|**Link**| `[title](https://www.example.com)`|\n" +
    "|**Image**| `![alt text](image.jpg)`|\n" +
    "|**Table**| &#124; Syntax &#124; Desciption &#124;<br> &#124; ---------- &#124; ---------------- &#124;<br> &#124; Text here &#124; Anther text &#124; |\n" +
    "|**Fenced Code Block**|&#96;&#96;&#96;<br> const a = 'String here';<br>&#96;&#96;&#96;|\n" +
    "";

  const short_cut =
    "##### Shortcut\n" +
    "---\n" +
    "- `Double click` or `Ctrl+LeftClick` to <u>**DELETE ITEM**</u>\n" +
    "- `Ctrl+Z` to <u>**UNDO DELETE ITEM**</u>\n" +
    "- `F1` for <u>**HELP**</u> and `Esc` to close help.\n" +
    "- `Ctrl+L` to clear Kan storage. <u>**Note:**</u> deleted items cleared.\n" +
    "- `Ctrl+Shift+L` to clear Kan storage and lists.\n" +
    "";

  const handleCancel = async () => {
    await appWindow.close();
  };

  useEffect(() => {
    const handleKeyDown = async (ev: any) => {
      const event: KeyboardEvent = ev as KeyboardEvent;
      if (event.code === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        await handleCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div
      className="flex flex-col w-full h-full text-white border  border-slate-700 bg-[#262d2e]"
      data-tauri-drag-region
    >
      <div
        className="text-center text-xs relative text-slate-400 font-bold p-1 bg-gray-700/20"
        data-tauri-drag-region
      >
        <span
          className="absolute left-1 top-[1px] bg-gray-900 px-2 py-[1px] border border-slate-700 rounded font-mono "
          data-tauri-drag-region
        >
          [Esc]
        </span>
        Help
      </div>
      <div className="grow overflow-y-auto overflow-x-hidden h-full text-xs flex flex-col gap-2 p-1">
        <Marked>{short_cut}</Marked>
        <Marked>{setting_str}</Marked>
      </div>
      <div className="flex items-center justify-center py-3">
        <button
          className="bg-lime-800 py-1 px-5 rounded text-sm"
          onClick={handleCancel}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default App;
