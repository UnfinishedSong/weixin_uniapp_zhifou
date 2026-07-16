"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_order = require("../../stores/order.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "coupon",
  setup(__props) {
    const orderStore = stores_order.useOrderStore();
    const activeTab = common_vendor.ref("unused");
    const unusedCoupons = common_vendor.computed(() => orderStore.coupons.filter((c) => !c.used));
    const usedCoupons = common_vendor.computed(() => orderStore.coupons.filter((c) => c.used));
    const filteredCoupons = common_vendor.computed(() => {
      return activeTab.value === "unused" ? unusedCoupons.value : usedCoupons.value;
    });
    const selectCoupon = (coupon) => {
      if (activeTab.value === "unused") {
        common_vendor.index.navigateBack();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(unusedCoupons.value.length),
        b: activeTab.value === "unused" ? 1 : "",
        c: common_vendor.o(($event) => activeTab.value = "unused"),
        d: common_vendor.t(usedCoupons.value.length),
        e: activeTab.value === "used" ? 1 : "",
        f: common_vendor.o(($event) => activeTab.value = "used"),
        g: filteredCoupons.value.length > 0
      }, filteredCoupons.value.length > 0 ? {
        h: common_vendor.f(filteredCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(coupon.value),
            b: coupon.minAmount > 0
          }, coupon.minAmount > 0 ? {
            c: common_vendor.t(coupon.minAmount)
          } : {}, {
            d: common_vendor.t(coupon.name),
            e: common_vendor.t(coupon.startDate),
            f: common_vendor.t(coupon.endDate)
          }, activeTab.value === "unused" ? {} : {}, {
            g: coupon.id,
            h: common_vendor.o(($event) => selectCoupon(), coupon.id)
          });
        }),
        i: activeTab.value === "unused",
        j: activeTab.value === "used" ? 1 : ""
      } : {
        k: common_vendor.t(activeTab.value === "unused" ? "暂无可用优惠券" : "暂无已使用优惠券")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e481f7b1"]]);
wx.createPage(MiniProgramPage);
