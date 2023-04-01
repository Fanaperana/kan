import { FC, useEffect, useMemo } from "react";
// import { marked, Renderer } from "marked";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js";

interface Props {
  children?: string;
  onClick?: () => void;
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
});

export const Marked: FC<Props> = ({ children = "", onClick }) => {
  useEffect(() => {
    hljs.highlightAll();
  });
  return (
    <div
      onDoubleClick={onClick}
      className="md text-slate-300 bg-[#202b2ebe] transition-all duration-200 rounded-md p-3 border border-slate-800 shadow-xl shadow-[#0b0a0a5c]"
      dangerouslySetInnerHTML={{
        __html: md.render(children),
      }}
    />
  );
};
