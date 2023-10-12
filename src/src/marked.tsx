import { FC, MouseEvent, useEffect, useMemo } from "react";
// import { marked, Renderer } from "marked";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js";
import { customInputPlugin, setButtonListeners } from "./plugins";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

interface Props {
  children?: string;
  onClick?: (_event?: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: () => void;
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return "";
  },
}).use(customInputPlugin, {});

export const Marked: FC<Props> = ({
  children = "",
  onClick,
  onDoubleClick,
}) => {
  useEffect(() => {
    // Event listener for the input button clipboard
    setButtonListeners();
    hljs.highlightAll();
  }, []);
  return (
    <div
      onDoubleClick={onDoubleClick}
      onClick={onClick}
      draggable
      className="md text-slate-300 bg-[#333a45] transition-all duration-200 rounded-md p-3 border border-slate-800 shadow shadow-[#242b31] select-text"
      dangerouslySetInnerHTML={{
        __html: md.render(children),
      }}
    />
  );
};
