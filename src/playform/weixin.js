export const processDocument = (dom) => {
  //代码块无法分析出什么语言
  document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((dom) => {
    dom.innerHTML = dom.innerText;
  });
  dom.querySelectorAll("pre > code").forEach((code) => {
    code.parentNode.classList.add("language-auto");
    code.previousSibling && code.previousSibling.remove();
    code.nextSibling && code.nextSibling.remove();

    code.innerHTML = code.innerHTML.replace(/<br>/g, "\n");
  });
  for (const img of Array.from(dom.querySelectorAll("img"))) {
    if (
      !img.getAttribute("src") ||
      img.getAttribute("class").includes("img_loading")
    ) {
      img.removeAttribute("class");
      img.setAttribute("src", img.dataset?.src || "");
    }
  }
};
