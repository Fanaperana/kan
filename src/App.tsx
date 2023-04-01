import { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import { HiOutlineViewfinderCircle, HiOutlineBackspace } from "react-icons/hi2";
import {
  register,
  unregister,
  unregisterAll,
} from "@tauri-apps/api/globalShortcut";
import { Marked } from "./src";
import { appWindow } from "@tauri-apps/api/window";

function App() {
  const [mdList, setMdList] = useState<string[]>(() => {
    const storedValue = localStorage.getItem("mdList");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  const [deletedItems, setDeletedItems] = useState<
    { index: number; value: string }[]
  >([]);

  const [mdInput, setMdInput] = useState("");

  useEffect(() => {
    // store mdList value to localStorage whenever it changes
    localStorage.setItem("mdList", JSON.stringify(mdList));
    const init = async () => {
      await unregisterAll();
      await handleKeyBoardEvent();
    };
    init();
  }, [mdList]);

  const handleKeyBoardEvent = async () => {
    await unregister("Ctrl+u");
    await register("Ctrl+u", () => {
      console.log("Shortcut triggered");
      if (deletedItems.length > 0) {
        const { index, value } = deletedItems[deletedItems.length - 1];
        setMdList((oldValue) => [
          ...oldValue.slice(0, index),
          value,
          ...oldValue.slice(index),
        ]);
        setDeletedItems((oldValue) => oldValue.slice(0, -1));
      }
    });
  };

  const handleTextArea = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // await handleKeyBoardEvent();
    if (event.key === "Tab") {
      event.preventDefault();
      setMdInput(mdInput + "  ");
    } else if (event.key === "h" && event.ctrlKey) {
      event.preventDefault();
      setMdInput(mdInput + "## ");
    } else if (event.key === "i" && event.ctrlKey) {
      event.preventDefault();
      const start = event.currentTarget.selectionStart || 0;
      const end = event.currentTarget.selectionEnd || 0;
      const selectText = mdInput.slice(start, end);
      const newValue =
        mdInput.slice(0, start) + `*${selectText}*` + mdInput.slice(end);
      setMdInput(newValue);
      event.currentTarget.setSelectionRange(start + 1, end + 1);
    } else if (event.key === "b" && !event.shiftKey) {
      event.preventDefault();
      const start = event.currentTarget.selectionStart || 0;
      const end = event.currentTarget.selectionEnd || 0;
      const selectText = mdInput.slice(start, end);
      const newValue =
        mdInput.slice(0, start) + `**${selectText}**` + mdInput.slice(end);
      setMdInput(newValue);
      event.currentTarget.setSelectionRange(start + 2, end + 2);
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (value) {
        setMdList((oldValue) => [...oldValue, value]);
        event.currentTarget.value = "";
        setMdInput("");
      }
    }
  };

  const setTextAreaValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMdInput(event.currentTarget.value);
  };

  const handleDelete = (index: number) => {
    setMdList((oldValue) => oldValue.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col w-full h-full p-1" data-tauri-drag-region>
      <span
        data-tauri-drag-region
        className="flex justify-between items-center p-1 pb-2"
      >
        <HiOutlineViewfinderCircle
          title="Drag"
          size={25}
          className="text-slate-400 cursor-move"
          data-tauri-drag-region
        />
        <HiOutlineBackspace
          title="Reduce"
          size={25}
          className="text-slate-400 active:text-slate-400 cursor-pointer hover:text-slate-500"
          onClick={() => appWindow.hide()}
        />
      </span>
      <div className="grow rounded-lg font-mono text-[11px] overflow-y-auto overflow-x-hidden p-1">
        <div className="w-full flex flex-col">
          <div className="flex flex-col py-1 gap-2 h-full">
            {mdList.map((m, i) => (
              <Marked key={i} onClick={() => handleDelete(i)}>
                {m}
              </Marked>
            ))}
          </div>
        </div>
      </div>
      <div className="px-1">
        <textarea
          className="form-textarea bg-slate-800/50 border border-slate-700 focus:ring-0 focus:border-slate-700 p-1 py-[5px] resize-none text-[11px] leading-3 text-white w-full min-h-[50px] max-h-[70px] h-[50px] rounded mt-2 placeholder:text-slate-600"
          placeholder="Type here..."
          spellCheck={false}
          onKeyDown={handleTextArea}
          value={mdInput}
          onChange={setTextAreaValue}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
