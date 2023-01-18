export const processDocument = (dom) => {
  dom
    .querySelectorAll(".section-common-share-wrap,#DH-PLAYERID0,.tiyi1")
    .forEach((el) => el.remove());

  dom.querySelectorAll("img").forEach((el) => {
    el.setAttribute("src", el.src);
  });
};
