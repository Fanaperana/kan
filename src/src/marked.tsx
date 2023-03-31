import { FC, useEffect, useMemo } from "react";
// import { marked, Renderer } from "marked";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js";
import StateBlock from "markdown-it/lib/rules_block/state_block";

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
      className="md text-slate-300 bg-[#293035] transition-all duration-200 rounded-sm p-3 border border-slate-800"
      dangerouslySetInnerHTML={{
        __html: md.render(children),
      }}
    />
  );
};
