import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from "react";
import {
  HiOutlineViewfinderCircle,
  HiOutlineBackspace,
  HiOutlineInformationCircle,
  HiArrowDownTray,
} from "react-icons/hi2";
import { Marked } from "./src";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import { uuid } from "./lib";
import { invoke } from "@tauri-apps/api/tauri";
import { sendNotification } from "@tauri-apps/api/notification";

interface ListType {
  index: string;
  value: string;
}

function App() {
  const [mdList, setMdList] = useState<ListType[]>(() => {
    const storedValue = localStorage.getItem("mdList");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  const [deletedItems, setDeletedItems] = useState<ListType[]>(() => {
    const storedValue = localStorage.getItem("deletedItems");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  const areaInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // store mdList value to localStorage whenever it changes
    localStorage.setItem("mdList", JSON.stringify(mdList));
  }, [mdList]);
  useEffect(() => {
    // store mdList value to localStorage whenever it changes
    localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
  }, [deletedItems]);

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
      } else if (event.code === "KeyH" && event.ctrlKey) {
        event.preventDefault();
        input.value += "## ";
      } else if (event.code === "KeyI" && event.ctrlKey) {
        event.preventDefault();
        const [s, start, end, len] = setSurround(event, "*");

        const input = areaInput.current;
        if (input) {
          input.value = s;
          input.setSelectionRange(start + len, end + len);
        }
      } else if (event.code === "KeyB" && event.ctrlKey) {
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
          setMdList((oldValue) => [
            ...oldValue,
            { index: uuid(), value: value },
          ]);
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

  const handleDelete = (index: string) => {
    const deletedItem = mdList.find((item) => item.index === index);
    if (deletedItem) {
      setDeletedItems((ov) => {
        const exists = ov.find((item) => item.value === deletedItem.value);
        return exists ? ov : [...ov, deletedItem];
      });

      setMdList((oldValue) => oldValue.filter((d) => d.index !== index));
    }
  };

  const handleUndo = () => {
    // check if there's a deleted item to restore
    if (deletedItems.length > 0) {
      const lastDeleted = deletedItems[deletedItems.length - 1];
      setDeletedItems((oldValue) => oldValue.slice(0, -1));
      // restore the last deleted item to the mdList array
      setMdList((oldValue) => [...oldValue, lastDeleted]);
    }
  };

  useEffect(() => {
    const handleKeyDown = async (ev: any) => {
      const event: KeyboardEvent = ev as KeyboardEvent;
      if (event.ctrlKey && event.code === "KeyZ") {
        event.preventDefault();
        event.stopPropagation();
        handleUndo();
      } else if (event.code === "F1") {
        await invoke("plugin:win|create_help_win");
      } else if (event.ctrlKey && event.code === "KeyL" && !event.shiftKey) {
        event.preventDefault();
        localStorage.removeItem("deletedItems");
        setDeletedItems([]);
        sendNotification({
          title: "Kan",
          body: "Kan Storage has been cleared and you can not undo deleted items.",
        });
      } else if (event.ctrlKey && event.shiftKey && event.code === "KeyL") {
        event.preventDefault();
        setDeletedItems([]);
        setMdList([]);
        localStorage.clear();
        sendNotification({
          title: "Kan",
          body: "All Kan Storage has been cleared",
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deletedItems]);

  const download = () => {
    console.log(mdList);
  };

  return (
    <div className="flex flex-col w-full h-full p-1 bg-[#22272e] border border-slate-600/70 rounded-md">
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
        <span className="flex gap-2 justify-center items-center bg-[#2d333b] py-2 px-3 rounded-md border border-slate-700">
          <HiArrowDownTray
            title="Export"
            size={20}
            className="text-slate-600 active:text-slate-400 cursor-pointer hover:text-slate-500"
            // onClick={}
          />
          <HiOutlineInformationCircle
            title="Help"
            size={20}
            className="text-slate-600 active:text-slate-400 cursor-pointer hover:text-slate-500"
            onClick={async () => {
              await invoke("plugin:win|create_help_win");
            }}
          />
          <HiOutlineBackspace
            title="Reduce"
            size={20}
            className="text-slate-400 active:text-slate-400 cursor-pointer hover:text-red-600"
            onClick={async () => await appWindow.hide()}
          />
        </span>
      </span>
      <div className="grow rounded-lg font-mono text-[11px] overflow-y-auto overflow-x-hidden p-1">
        <div className="w-full flex flex-col">
          <div className="flex flex-col py-1 gap-2 h-full">
            {mdList.map((m, i) => (
              <Marked
                key={m.index + `${i}`}
                onClick={(_event) => {
                  if (_event?.ctrlKey) {
                    handleDelete(m.index);
                  }
                }}
                onDoubleClick={() => handleDelete(m.index)}
              >
                {m.value}
              </Marked>
            ))}
          </div>
        </div>
      </div>
      <div className="px-1">
        <textarea
          ref={areaInput}
          className="form-textarea bg-slate-800/50 border border-slate-700 focus:ring-0 focus:border-slate-700 px-2 py-[5px] resize-none text-[11px] leading-3 text-white w-full min-h-[50px] max-h-[70px] h-[50px] rounded mt-2 placeholder:text-slate-600"
          placeholder="Type here..."
          spellCheck={false}
          onKeyDown={handleTextArea}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
