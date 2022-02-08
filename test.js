// ==UserScript==
// @name         copy-helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  文章拷贝助手,掘金文章一键拷贝到微信公众平台、知乎 下载 markdown，欢迎关注 前端公众号：JS酷
// @author       #前端公众号：JS酷
// @match        https://juejin.cn/post/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.jianshu.com/p/*
// @match        https://segmentfault.com/a/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://unpkg.com/turndown/dist/turndown.js
// @license MIT
// ==/UserScript==

// http://img.maqib.cn/index.js

if (window.location.host == "mp.weixin.qq.com") {
  $(function () {
    setTimeout(() => {
      const style = document.createElement("style");
      const heads = document.querySelector("head");
      style.setAttribute("type", "text/css");
      style.innerHTML = `.buy-vip-dialog-v3{display:none !important;}.mpa-dialog-parent-no-scroll {
      overflow: auto !important;
    }`;
      heads.append(style);
    }, 0);
  });

  $(document)
    .off("click", ".material-item .cover")
    .on("click", ".material-item .cover", (e) => {
      e.stopPropagation();
      const html = $(e.target).parent().find(".html-container").html();
      window.UE.getEditor("js_editor").execCommand("insertHTML", html);
    });
}

if (window.location.host == "yiban.io") {
  $(document)
    .off("click", ".copy")
    .on("click", ".copy", function (e) {
      e.stopImmediatePropagation();
      const text = $(this)
        .parents(".style-waterfall-inner")
        .find(".detail")
        .html();

      console.log(text);
      // 复制触发
      if (text) {
        alert("复制成功");
        document.addEventListener("copy", function copyCall(e) {
          e.preventDefault();
          e.clipboardData.setData("text/html", text);
          e.clipboardData.setData("text/plain", text);
          document.removeEventListener("copy", copyCall);
        });
        document.execCommand("copy");
      } else {
        alert("复制失败");
      }
      $(".pay-tips-dialog").hide();
    });
}
