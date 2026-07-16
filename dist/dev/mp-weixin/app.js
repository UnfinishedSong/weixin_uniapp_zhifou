"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/order/order.js";
  "./pages/cart/cart.js";
  "./pages/member/member.js";
  "./pages/mine/mine.js";
  "./pages/product/detail.js";
  "./pages/checkout/checkout.js";
  "./pages/orders/list.js";
  "./pages/address/list.js";
  "./pages/coupon/coupon.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      console.log("知否花店小程序启动");
    });
    common_vendor.onShow(() => {
      console.log("小程序显示");
    });
    common_vendor.onHide(() => {
      console.log("小程序隐藏");
    });
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
