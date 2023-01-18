import * as juejin from "./juejin";
import * as sf from "./sf";
import * as zhihu from "./zhihu";
import * as weixin from "./weixin";
import * as csdn from "./csdn";
import * as jianshu from "./jianshu";
import * as news from "./news";

export const processDocument = {
  "mp.weixin.qq.com": weixin.processDocument,
  "zhuanlan.zhihu.com": zhihu.processDocument,
  "jianshu.com": jianshu.processDocument,
  "juejin.cn": juejin.processDocument,
  "blog.csdn.net": csdn.processDocument,
  "segmentfault.com": sf.processDocument,
  "www.news.cn": news.processDocument,
  "people.com.cn": news.processDocument,
};
