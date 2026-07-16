"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const bgImages = common_vendor.ref([
      { image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20pink%20rose%20floral%20arrangement%20soft%20light%20romantic%20background&image_size=landscape_16_9" },
      { image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20white%20lily%20flowers%20fresh%20garden%20morning%20light%20dreamy&image_size=landscape_16_9" },
      { image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20sunflower%20field%20warm%20sunset%20golden%20hour%20cheerful&image_size=landscape_16_9" }
    ]);
    const currentBgIndex = common_vendor.ref(0);
    let bgTimer = null;
    const startBgTimer = () => {
      bgTimer = setInterval(() => {
        currentBgIndex.value = (currentBgIndex.value + 1) % bgImages.value.length;
      }, 5e3);
    };
    const goPickup = () => {
      common_vendor.index.navigateTo({ url: "/pages/order/order?deliveryType=pickup" });
    };
    const goDelivery = () => {
      common_vendor.index.navigateTo({ url: "/pages/order/order?deliveryType=delivery" });
    };
    const goCustom = () => {
      common_vendor.index.showModal({
        title: "🌸 私人定制服务",
        content: "想要独一无二的花束吗？\n花艺师小姐姐随时在线哦~ \n\n📞 定制热线：138-8888-8888\n💬 微信同号，欢迎骚扰~",
        showCancel: false,
        confirmText: "记下啦",
        confirmColor: "#FF6B9D",
        success: () => {
          common_vendor.index.setClipboardData({
            data: "13888888888",
            success: () => {
              common_vendor.index.showToast({ title: "号码已复制", icon: "success" });
            }
          });
        }
      });
    };
    const goOrders = () => {
      common_vendor.index.navigateTo({ url: "/pages/orders/list" });
    };
    const goCoupon = () => {
      common_vendor.index.navigateTo({ url: "/pages/coupon/coupon" });
    };
    const goPromo = () => {
      common_vendor.index.navigateTo({ url: "/pages/order/order" });
    };
    common_vendor.onMounted(() => {
      startBgTimer();
    });
    common_vendor.onUnmounted(() => {
      if (bgTimer) {
        clearInterval(bgTimer);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(bgImages.value, (bg, index, i0) => {
          return {
            a: bg.image,
            b: index,
            c: currentBgIndex.value === index ? 1 : ""
          };
        }),
        b: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname),
        c: common_vendor.t(common_vendor.unref(userStore).memberInfo.levelName),
        d: common_vendor.t(common_vendor.unref(userStore).userInfo.id),
        e: common_vendor.o(goPickup),
        f: common_vendor.o(goDelivery),
        g: common_vendor.o(goCustom),
        h: common_vendor.o(goOrders),
        i: common_vendor.o(goCoupon),
        j: common_vendor.o(goPromo),
        k: common_vendor.f(bgImages.value, (_, index, i0) => {
          return {
            a: index,
            b: currentBgIndex.value === index ? 1 : ""
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
