import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from "react";
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
  const areaInput = useRef<HTMLTextAreaElement>(null);
  const [deletedItems, setDeletedItems] = useState<
    { index: number; value: string }[]
  >([]);

  useEffect(() => {
    // store mdList value to localStorage whenever it changes
    localStorage.setItem("mdList", JSON.stringify(mdList));
  }, [mdList]);

  const handleTextArea = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const input = areaInput.current;
    if (input) {
      /**
       *
       * @param t : target
       * @param d : delimiter
       * @returns [new_value, start, end, delimiter_length]
       */
      const setSurround = (
        t: KeyboardEvent<HTMLTextAreaElement>,
        d: string
      ): [string, number, number, number] => {
        const data = input.value;
        const s = input.selectionStart || 0;
        const e = input.selectionEnd || 0;

        const sText = data.slice(s, e);
        const newVal = data.slice(0, s) + `${d}${sText}${d}` + data.slice(e);
        return [newVal, s, e, d.length];
      };

      if (event.key === "Tab") {
        event.preventDefault();
        input.value += "  ";
      } else if (event.key === "h" && event.ctrlKey) {
        event.preventDefault();
        input.value += "## ";
      } else if (event.key === "i" && event.ctrlKey) {
        event.preventDefault();
        const [s, start, end, len] = setSurround(event, "*");

        const input = areaInput.current;
        if (input) {
          input.value = s;
          input.setSelectionRange(start + len, end + len);
        }
      } else if (event.key === "b" && !event.shiftKey) {
        event.preventDefault();
        const [s, start, end, len] = setSurround(event, "**");
        const input = areaInput.current;
        if (input) {
          input.value = s;
          input.setSelectionRange(start + len, end + len);
        }
      } else if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const value = input.value.trim();
        if (value) {
          setMdList((oldValue) => [...oldValue, value]);
          input.value = "";
        }
      } else if (event.key === "`" && event.ctrlKey) {
        event.preventDefault();
        const [s, start, end, len] = setSurround(event, "`");

        const input = areaInput.current;
        if (input) {
          input.value = s;
          input.setSelectionRange(start + len, end + len);
        }
      }
    }
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
              <Marked
                key={i}
                onClick={(_event) => {
                  if (_event?.ctrlKey) {
                    handleDelete(i);
                  }
                }}
                onDoubleClick={() => handleDelete(i)}
              >
                {m}
              </Marked>
            ))}
          </div>
        </div>
      </div>
      <div className="px-1">
        <textarea
          ref={areaInput}
          className="form-textarea bg-slate-800/50 border border-slate-700 focus:ring-0 focus:border-slate-700 p-1 py-[5px] resize-none text-[11px] leading-3 text-white w-full min-h-[50px] max-h-[70px] h-[50px] rounded mt-2 placeholder:text-slate-600"
          placeholder="Type here..."
          spellCheck={false}
          onKeyDown={handleTextArea}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
