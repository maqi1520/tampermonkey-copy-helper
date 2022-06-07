export const processDocument = (dom) => {
  dom.querySelectorAll("style").forEach((btn) => btn.remove());
  dom.querySelectorAll(".copy-code-btn").forEach((btn) => btn.remove());
  dom.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href?.startsWith("https://link.juejin")) {
      const url = new URL(href);
      const target = url.searchParams.get("target") || "";
      a.setAttribute("href", target);
    }
  });
};
