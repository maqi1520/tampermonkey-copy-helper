export const processDocument = (dom) => {
  dom.querySelectorAll(".widget-codetool").forEach((btn) => btn.remove());
  dom.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href?.startsWith("https://link.segmentfault")) {
      const url = new URL(href);
      const target = url.searchParams.get("target") || "";
      a.setAttribute("href", target);
    }
  });
  //缺少code标签
  dom.querySelectorAll("pre.hljs").forEach((pre) => {
    pre.innerHTML = "<code>" + pre.innerHTML + "</code>";
  });
  for (const img of Array.from(dom.querySelectorAll("img"))) {
    if (
      !img.getAttribute("src") ||
      (img.getAttribute("class") && img.getAttribute("class").includes("lazy"))
    ) {
      img.removeAttribute("class");
      img.setAttribute("src", img.dataset?.src || "");
    }
    if (img.getAttribute("src").startsWith("/")) {
      img.setAttribute(
        "src",
        "https://segmentfault.com" + img.getAttribute("src")
      );
    }
  }
};
