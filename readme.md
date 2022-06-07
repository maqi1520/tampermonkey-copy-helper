> 文章拷贝助手,掘金文章一键拷贝到微信公众平台、知乎 下载 markdown

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f1e838aaab74cb6b7225da6fe0f2e27~tplv-k3u1fbpfcp-watermark.image?)

## 为什么要写这个脚本

最近开了个前端公众号，需要推送一些优质的文章，但由于时间的关系，原创内容太少，常规的做法是转载一些优秀的文章到自己的公众号。

### 流程

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfe441fddf414f5a879df3ad41855ecd~tplv-k3u1fbpfcp-watermark.image?)

### 使用脚本流程

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/834b742b0a814286b040942f2548d011~tplv-k3u1fbpfcp-watermark.image?)

### HTML 转 markdown

https://www.bejson.com/convert/html2markdown/

https://devtool.tech/html-md

https://github.com/mixmark-io/turndown

## 使用

- 第一步： [安装 chrome 油猴扩展](https://chrome.pictureknow.com/extension?id=4d999497b75d4eb6acf4d0db3053f1af)
- 第二步： [安装文章拷贝助手](https://greasyfork.org/zh-CN/scripts/439663-copy-helper)

## 实现代码

大部分代码来自 [markdown-nice](https://github.com/mdnice/markdown-nice)

javascript 实现下载 markdown 文件， 掘金是使用 NUXT.js 来实现的 ssr， 所以 会将全部的数据保存在全局对象中 **NUXT**，

`__NUXT__.state.view.column.entry.article_info.mark_content` 这样就可以直接取到 markdown 文件内容了，

但是有用户写文章的时候不是用 markdown 写的， 是用富文本编辑器来写的，这个时候就没有 mark_content 数据了，这个时候就要涉及到 HTML 转 markdown

我们可以使用 turndown 这个库来实现。

下载文件 js

```js
export const downLoad = (filename, code) => {
  // 下载的文件名
  var file = new File([code], filename, {
    type: "text/markdown",
  });
  // 创建隐藏的可下载链接
  var eleLink = document.createElement("a");
  eleLink.download = filename;
  eleLink.style.display = "none";
  // 下载内容转变成blob地址
  eleLink.href = URL.createObjectURL(file);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};
```

## 兼容平台

-[ ] 掘金

-[ ] 知乎专栏

-[ ] 微信公众号

-[ ] 思否

-[ ] 简书

-[ ] CSDN

---

## Github

[tampermonkey-copy-helper](https://github.com/maqi1520/tampermonkey-copy-helper)
