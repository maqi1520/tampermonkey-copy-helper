export const processDocument = (dom) => {
  dom
    .querySelectorAll(".RichText-LinkCardContainer,noscript")
    .forEach((el) => el.remove());

  for (const img of Array.from(dom.querySelectorAll("img"))) {
    if (
      !img.getAttribute("src") ||
      img.getAttribute("class").includes("lazy")
    ) {
      img.removeAttribute("class");
      img.setAttribute("src", img.dataset?.original || "");
    }
  }
  dom.querySelectorAll(".RichText a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href?.startsWith("https://link.zhihu")) {
      const url = new URL(href);
      const target = url.searchParams.get("target") || "";
      a.setAttribute("href", target);
    }
  });
};
