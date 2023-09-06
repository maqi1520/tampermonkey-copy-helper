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
        node.childNodes &&
        Array.from(node.childNodes).some(node => node.nodeName === "CODE")
    );
  },

  replacement(content, node, options) {
    const beforeNodes = []
    let codeEle = null
    node.childNodes.forEach(child => {
      if (codeEle) return
      if (child.nodeName === "CODE") {
        codeEle = child
      } else {
        beforeNodes.push(child)
      }
    })
    // 删除code元素之前的节点
    beforeNodes.forEach(node => node.remove?.())

    if (!codeEle) {
      codeEle = node.firstElementChild
    }

    const className = [node.className, codeEle.className].join(
      " "
    );
    const language = 
      codeEle.getAttribute('lang') ||
      (className.match(/language-(\S+)/) || [
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
