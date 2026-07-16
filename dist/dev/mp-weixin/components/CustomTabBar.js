"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CustomTabBar",
  setup(__props) {
    const tabList = [
      { pagePath: "/pages/index/index", text: "首页" },
      { pagePath: "/pages/mine/mine", text: "我的" }
    ];
    const currentIndex = common_vendor.ref(0);
    const updateCurrentIndex = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = "/" + currentPage.route;
      const index = tabList.findIndex((item) => item.pagePath === route);
      if (index >= 0 && index !== currentIndex.value) {
        currentIndex.value = index;
      }
    };
    const handleClick = (index) => {
      if (currentIndex.value === index)
        return;
      currentIndex.value = index;
      common_vendor.index.switchTab({
        url: tabList[index].pagePath,
        success: () => {
          updateCurrentIndex();
        }
      });
    };
    common_vendor.onMounted(() => {
      updateCurrentIndex();
    });
    common_vendor.onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabList, (item, index, i0) => {
          return common_vendor.e({
            a: index === 0
          }, index === 0 ? {
            b: common_vendor.t(currentIndex.value === 0 ? "🏠" : "🏠")
          } : {
            c: common_vendor.t(currentIndex.value === 1 ? "👤" : "👤")
          }, {
            d: common_vendor.t(item.text),
            e: index,
            f: currentIndex.value === index ? 1 : "",
            g: common_vendor.o(($event) => handleClick(index), index)
          });
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-55a48eff"]]);
wx.createComponent(Component);
