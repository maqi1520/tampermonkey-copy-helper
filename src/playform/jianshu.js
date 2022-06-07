export const processDocument = (dom) => {
  dom.querySelectorAll("noscript,.image-caption").forEach((el) => el.remove());
  for (const img of Array.from(dom.querySelectorAll("img"))) {
    if (
      !img.getAttribute("src") ||
      img.getAttribute("class").includes("image-loading")
    ) {
      img.removeAttribute("class");
      img.setAttribute("src", img.dataset?.originalSrc || "");
    }
  }
  dom.querySelectorAll("._2rhmJa a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href?.startsWith("https://link.jianshu")) {
      const url = new URL(href);
      const target = url.searchParams.get("t") || "";
      a.setAttribute("href", target);
    }
  });
};
