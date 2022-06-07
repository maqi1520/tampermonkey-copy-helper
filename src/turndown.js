import TurndownService from "turndown";
import { LANGUAGES } from "./language";

const { gfm } = require("turndown-plugin-gfm");

function detectLanguage(className) {
  for (const lang of LANGUAGES) {
    if (new RegExp(`\\b${lang}\\b`).test(className)) {
      return lang;
    }
  }
  return "auto";
}

const turndownService = new TurndownService({
  emDelimiter: "_",
  codeBlockStyle: "fenced",
  fence: "```",
  headingStyle: "atx",
  bulletListMarker: "-",
});

turndownService.use(gfm);

turndownService.addRule("autoLanguage", {
  filter(node, options) {
    return Boolean(
      options.codeBlockStyle === "fenced" &&
        node.nodeName === "PRE" &&
        node.firstChild &&
        node.firstChild.nodeName === "CODE"
    );
  },

  replacement(content, node, options) {
    const className = [node.className, node.firstElementChild?.className].join(
      " "
    );
    const language = (className.match(/language-(\S+)/) || [
      null,
      detectLanguage(className),
    ])[1];
    const code = node.textContent || "";
    const fence = options.fence;

    return (
      "\n\n" +
      fence +
      language +
      "\n" +
      code.replace(/\n$/, "") +
      "\n" +
      fence +
      "\n\n"
    );
  },
});

function turndown(text) {
  return turndownService.turndown(text);
}

export { turndown };
