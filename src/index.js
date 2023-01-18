// ==UserScript==
// @name         copy-helper
// @namespace    https://greasyfork.org/zh-CN/users/869004
// @homepage    https://greasyfork.org/zh-CN/scripts/439663
// @sourcecode    https://github.com/maqi1520/tampermonkey-copy-helper
// @version      0.9.2
// @description  文章拷贝助手，掘金、简书、微信文章、知乎专栏、思否、CSDN、新华网、人民网、 文章一键拷贝 markdown，欢迎关注 前端公众号：JS酷
// @author       #前端公众号：JS酷
// @match        https://juejin.cn/post/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.jianshu.com/p/*
// @match        https://segmentfault.com/a/*
// @match        https://mp.weixin.qq.com/s*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        *://www.news.cn/*/**/*.htm*
// @match        *://*.people.com.cn/*/**/*.htm*
// @icon         https://res.wx.qq.com/a/fed_upload/9300e7ac-cec5-4454-b75c-f92260dd5b47/logo-mp.ico
// @grant        none
// @license MIT
// ==/UserScript==

import get from "lodash.get";
import { themes } from "./themes";
import { turndown } from "./turndown";
import { processDocument } from "./playform";
import {
  solveWeChatMath,
  solveHtml,
  solveZhihuMath,
  downLoad,
  copySafari,
} from "./utils";
__webpack_nonce__ = "index";
import "./styles/index.css";
__webpack_nonce__ = "base";
import "./styles/mdnice/base.css";
__webpack_nonce__ = "hljs";
import "./styles/mdnice/hljs.css";

const selector = {
  "jianshu.com": "._2rhmJa",
  "www.jianshu.com": "._2rhmJa",
  "juejin.cn": ".markdown-body",
  "blog.csdn.net": "#content_views",
  "segmentfault.com": ".article.fmt.article-content",
  "mp.weixin.qq.com": "#js_content",
  "zhuanlan.zhihu.com": ".Post-RichText",
  "www.news.cn": "#detail",
  "people.com.cn": ".rm_txt_con",
};

let themeId = localStorage.getItem("copy_tool_themeId") || "1";

const hostname = window.location.hostname;

let hostkey = "";
for (const key in processDocument) {
  if (hostname.includes(key)) {
    hostkey = key;
    break;
  }
}

function appendThemeStyle(id) {
  Array.from(document.querySelectorAll(".toolbox-option")).forEach((node) => {
    node.className = "toolbox-option";
    if (node.dataset.id === themeId) {
      node.className = "toolbox-option active";
    }
  });
  const currentTheme = themes.find((item) => item.themeId === id);
  let themeStyle = document.querySelector("#theme-style");
  if (!themeStyle) {
    themeStyle = document.createElement("style");
    themeStyle.id = "theme-style";
    themeStyle.innerHTML = currentTheme.css;
    document.head.appendChild(themeStyle);
  } else {
    themeStyle.innerHTML = currentTheme.css;
  }
}

function init() {
  const tpl = `
  <button class='side-btn cp-btn' type="button">拷贝助手</button>
      <div class="preview-article-wrap cp-modal-wrapper" style="height: 100vh;display:none">
    <div class="preview-article-mask mark"></div>
    <div class="preview-phone-wrapper">
      <div class="preview-phone-model preview-phone-model_5_8">
        <div class="preview-article-wrapper preview-article-wrapper_5_8">
          <div class="preview-article-title">
            <div class="preview-article-title-left">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAECSURBVHgB1dftDcIgEAZgCgvQDUg3cAPdwA0cwRF0JScwbtIN6ATFI9GEVkrv649vQoC79Om/5mrMP2UYhqvRDqA3WKkziskobPd8VoNLVA1eo5BRDNfQeZ5PIngLHSFsuIXmCwveQ1kwBiXDWJQEU1A0TEVRMAfdhbloE5agm7AUrcIa6A+shS7gEIK31saiNwF64KA59nuA56eU0lj08osuhhlXXrz3D9jOXdf5T+nY972JMb4MMQt4gmjhbl3Qwl2tqIG7rYYUd62mBG/CEnwX5uIomIOjYSpOgik4GcbiLBiDi4dC+NwGgJ+wQlG+q4yxNVxt8F7jqr8KJa4Kl/gbYsMMt+9Rs3AAAAAASUVORK5CYII="
                style="width: 7px"
              />
            </div>
            <div class="preview-article-title-center"></div>
            <div class="preview-article-title-right">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA2CAYAAABnctHeAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFqSURBVHgB7dTNTcMwGAbgL0nvSTZwW+WeI8cyAWICcuXIBIgRmICwAUzQbNBcUZSfDfCRQ374PhQkROPWacWJ95GqNI792o7tEAEAAAAAAAAAAPxrzrEKURTFwzAEbdvmTdNoOoFSKlgsFjFnNIJO8J3hOI4uiiI/VNc9FLJer7dd1+36vt+6rrvj+xuaabVa3XPb9zGjlnuaSfqVtpIh4+GMmsenTPWNK7VcLlN+K3uT4ODQdsW434QH87TXqeMkZVk+W2YomdDvct49WV3Xl1NtjCvFHV9NNnDdhCyZMvjFXJMlz/NiQ/bG1MY4qT/m21bk7RbQTMZJ8fK+TpXzW34hS6YMXu2U7El/U9s9NTXwTA+CIMj4csHLrMYizf9veR9nZElrnYdhKOd286P4oaqqxxkZH77vv41j+Vo1OU/8u+Nnk2f76Cedz6nsaQk755Ou5HJmhoxBxqI5IycAAAAAAAAAAAAw+QTAyYysfLNd8gAAAABJRU5ErkJggg=="
                style="width: 17px"
              />
            </div>
          </div>
          <div class="preview-article-article preview-article-article_5_8">
          <div class="preview-article-article-header">
          <div class="rich_media_title" id="js-title"></div>
                  <div id="meta_content" class="rich_media_meta_list">
                  <span id="js-author" class="rich_media_meta rich_media_meta_text"></span>               
                  <span class="rich_media_meta rich_media_meta_nickname" id="profileBt" wah-hotarea="click">
                        <a href="javascript:void(0);" class="wx_tap_link js_wx_tap_highlight weui-wa-hotarea" id="js_name">JS酷</a>
                      </span>
                      <em id="publish_time" class="rich_media_meta rich_media_meta_text">2022-01-26 19:02</em>
                  </div>
          </div>
          <div id="nice"></div>
          </div>
        </div>
      </div>
      <div class="preview-toolbox">
      <div class="copy-btn tool-item">
      <div class="cp-btn js-copy-wechat">复制到微信</div>
      <div class="cp-btn js-copy-md">复制 markdown</div>
      
  </div>
          
          <div class="tool-item"><div class="tool-item-label">下载</div><div>
          <div class="cp-btn js-download-md">下载 markdown</div>
          </div></div>
          <div class="tool-item"><div class="tool-item-label">排版工具</div><div>
          <a target="_black" href="https://editor.mdnice.com/" class="cp-btn-default">mdnice</a>
          <a target="_black" href="https://editor.runjs.cool/" class="cp-btn">mdx-editor</a>
          </div></div>
          <div class="tool-item"><div class="tool-item-label">主题</div><div class="toolbox-select">
  
  ${themes
    .map(
      (theme) =>
        `<div class="toolbox-option " data-id=${theme.themeId}>${theme.name}</div>`
    )
    .join("")}
          
          </div>
          </div>
        <div class="tool-item">
          <div class="tool-item-label">问题反馈</div>
          <div>
            <div class="toolbox-hint">
              关注微信公众号 <span class="toolbox-hint-highlight">JS酷</span
              > 留言反馈
            </div>
            <div>加我微信好友反馈，备注来源</div>
          </div>
        </div>
      </div>
    </div>
    <div style="position: absolute; top: 44px; right: 44px">
      <img
        class="close-btn"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAACiCAYAAADC8hYbAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAoqADAAQAAAABAAAAogAAAAAJENouAAAFNUlEQVR4Ae3cSVIjOxQFUP6f1IwdMGbLLOQ322BFRUmEFTYG28pe0jsZkZFu0pLeebfSBir89GQjQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg0L/Ax8fHS9qf+69knwqyVTbbZ7YAsyTM17S/pz1vv9P+lvZfAUqfVWK2ORllq7xlu9dZg3nRWeAEmUEvt//SHWE8M33eyiZpzzbX2/vVqe5OEUia+e341iaMF5gJ6VYIi5+36QuvSTeTYP6cU95iCujlURiTaAJ5FMJs6PP1pPRdnZwA82fCe1voMCaYRyHMdm9XrO5OFaiEDhlGNlPTtPB84N8BmXw32eUR8GdmFmeLQ25pQNUPJonp81c4fr21ZUojhzFy7VtmavbYERsSsebZAdnzhZEaE6nWPTO02lwRGhShxtUCceRAIzdq5NqOzMxmc4/YsBFr2iwALQ08UuNGqqWljOy2lhEaOEINuzW85Yl6bmTPa285E4etrceG9rjmwxrc08Q9NbantfaUgWbW2kODe1hjMw3teSEtN7rltfXc82bX3mLDW1xTsw0caWEtNb6ltYzU425qaSEALayhm4aNvNAjg3Dk3CP3tNvajgjEEXN226BIC98zGHvOFamHw9S6R0D2mGOYhkQuZMugbDl25J4NW/sWgdlizGEboLCzwJrBWXOs8wrdCiOwRoDWGCMMuEJvCywJ0pLX3l6RZ8IKzAnUnNeEBVZ4vcCUYE05t34FziRwEpgQsPy1ePe2kF+bJ0grCqR01XwRphCuaG6oGwILwuhKeMPUwzMFZoRRCGdae9kDgQlhFMIHltdP/339gPsPBf56eIYTCGwlcLoa/p+OtZur4lbNiDpuSl7+yXlKCEtYhTFqaNaue0EIhXHtZkQdrzKE/6Tz8pXv3ubKGDVES+tOqap5O/73dF7NL72FcWlTor1+SgiLzek1rowFxHGZwJwQlhmFsUg4LhJYEsIysTAWCcdZAmuEsEwsjEXCcZLAmiEsEwtjkXCsEtgihGViYSwSjncFtgxhmVgYi4TjjwJ7hLBMLIxFwvGLwJ4hLBMLY5Fw/BQ4IoSFXhiLRPBjZQg3/VOcMAphzd+ONw1haYEwFolgxxauhNfkwngtMvj9FkNYyIWxSAx+7KHRPaxx8JhsW15PDe5prdt2bbDRe2xsj2seLDbrltNzQ3te+7pd7Hy0ERo5Qg2dx2jZ8kdq4Ei1LOtqZ68esXEj1tRZrKYtd+SGjVzbtC43fnaERkWosfGY3V9epAZFqvV+1xt7NmJjItbcWOy+LidyQyLX/jUFB9/TiKcnBkJ4sMB5emE8W+x6C/x3bibfTTZ9BPhtXja3bVZ/JmG/pf3etst/71+9sJUGTDA1X4n3ttJ0MYdJyM9p/30nhaFDWFJREcZs+FzOd5wokPBehLAOrSKML3UjOetHgQT8/kMYXQl/0LoTxvcfTvfQFIGE+3oRxvwWkz8z/poyRqRzs83JqHykyf+QXyMZbFprwsxv0z7nVCpnq2xWebrTCBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECLQs8AdTUMnERHdP1gAAAABJRU5ErkJggg=="
        width="38"
        height="38"
      />
    </div>
  </div>
  `;
  // __NUXT__.state.view.column.entry.article_info.mark_content

  const div = document.createElement("div");
  div.innerHTML = tpl;
  div.className = "cp-tool";
  document.body.appendChild(div);
}

function getMd() {
  let md = get(
    window,
    "__NUXT__.state.view.column.entry.article_info.mark_content"
  );
  const selectorStr = selector[hostkey] || ".markdown-body";

  const nodeConetnt = document.querySelector(selectorStr).cloneNode(true);

  processDocument[hostkey] && processDocument[hostkey](nodeConetnt);

  md = turndown(nodeConetnt.innerHTML);
  return md;
}

function handleClick(e) {
  const target = e.target;
  if (target.className.includes("side-btn")) {
    document.querySelector(".cp-modal-wrapper").style.display = "block";
    const selectorStr = selector[hostkey] || ".markdown-body";
    console.log(selectorStr);
    const nodes = document.querySelector(selectorStr).cloneNode(true).children;

    document.querySelector("#nice").innerHTML = "";
    const markdownBody = document.createElement("div");
    Array.from(nodes).forEach((node) => {
      if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName)) {
        node.innerHTML = `<span class="prefix"></span><span class="content">${node.textContent}</span><span class="suffix"></span>`;
      }
      if (["BLOCKQUOTE"].includes(node.tagName)) {
        node.className = "multiquote-1";
      }

      if (node.tagName == "PRE") {
        node.className = "custom";

        if (node.children && node.children[0]) {
          if (node.children[0].tagName !== "CODE") {
            const code = document.createElement("code");
            code.append(...node.children);
            node.appendChild(code);
          } else {
            // 掘金去除复制按钮
            [...node.children[0].children].forEach((l) => {
              if (l.innerHTML == "复制代码") {
                l.innerHTML = "";
              }
            });
          }
        }
      }
      if (node.tagName !== "STYLE") {
        markdownBody.appendChild(node);
      }
    });
    const h1 =
      document.querySelectorAll("h1")[
        document.querySelectorAll("h1")?.length - 1
      ];

    const author = document.querySelector(".name");
    console.log(author);

    document.querySelector("#js-title").innerHTML = h1
      ? h1.innerText
      : "H1 获取标题失败";
    document.querySelector("#js-author").innerHTML = author
      ? author.innerText
      : "作者";
    document.querySelector("#nice").appendChild(markdownBody);
    document.body.style.overflow = "hidden";
  }
  if (
    target.className.includes("preview-article-mask") ||
    target.className.includes("close-btn")
  ) {
    document.querySelector(".cp-modal-wrapper").style.display = "none";
    document.body.style.overflow = "";
  }
  if (target.className === "toolbox-option") {
    themeId = target.dataset.id;
    localStorage.setItem("copy_tool_themeId", themeId);
    appendThemeStyle(themeId);
  }
  if (target.className.includes("js-copy-wechat")) {
    const currentTheme = themes.find((item) => item.themeId === themeId);
    const mdcss = currentTheme.css;

    const element = document.querySelector("#nice");
    const el = element.cloneNode(true);
    solveWeChatMath(el);
    const html = solveHtml(el, mdcss);
    copySafari(html);
    alert("复制成功，请到微信公众平台粘贴");
  }
  if (target.className.includes("js-copy-md")) {
    let md = getMd();
    copySafari(md);
    alert("复制 markdown 成功");
  }
  if (target.className.includes("js-download-md")) {
    const md = getMd();
    const h1 = document.querySelector("h1");
    const title = h1 ? h1.innerText + ".md" : "H1 is null.md";
    downLoad(title, md);
  }
}

init();
appendThemeStyle(themeId);
document.addEventListener("click", handleClick);

console.log(123);
