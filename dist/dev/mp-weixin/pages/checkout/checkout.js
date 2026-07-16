"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_cart = require("../../stores/cart.js");
const stores_order = require("../../stores/order.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "checkout",
  setup(__props) {
    const cartStore = stores_cart.useCartStore();
    const orderStore = stores_order.useOrderStore();
    const userStore = stores_user.useUserStore();
    const selectedAddress = common_vendor.ref(orderStore.getDefaultAddress() || null);
    const selectedCoupon = common_vendor.ref(orderStore.coupons.find((c) => !c.used && cartStore.totalPrice >= c.minAmount) || null);
    const remark = common_vendor.ref("");
    const deliveryType = common_vendor.ref("delivery");
    const availableCoupons = common_vendor.computed(() => {
      return orderStore.coupons.filter((c) => !c.used && cartStore.totalPrice >= c.minAmount);
    });
    const discountText = common_vendor.computed(() => {
      const discount = userStore.discount;
      if (discount === 1)
        return "无折扣";
      return `-${((1 - discount) * 100).toFixed(0)}%`;
    });
    const finalPrice = common_vendor.computed(() => {
      let price = cartStore.totalPrice * userStore.discount;
      if (selectedCoupon.value) {
        price -= selectedCoupon.value.value;
      }
      return Math.max(0, price);
    });
    const goAddress = () => {
      common_vendor.index.navigateTo({ url: "/pages/address/list" });
    };
    const goCoupon = () => {
      common_vendor.index.navigateTo({ url: "/pages/coupon/coupon" });
    };
    common_vendor.onMounted(() => {
      var _a;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const dt = (_a = currentPage.options) == null ? void 0 : _a.deliveryType;
      if (dt === "pickup") {
        deliveryType.value = "pickup";
      } else if (dt === "delivery") {
        deliveryType.value = "delivery";
      }
    });
    const submitOrder = () => {
      var _a;
      if (!selectedAddress.value) {
        common_vendor.index.showToast({ title: "请选择收货地址", icon: "none" });
        return;
      }
      if (cartStore.isEmpty) {
        common_vendor.index.showToast({ title: "购物车为空", icon: "none" });
        return;
      }
      const order = orderStore.createOrder(
        cartStore.items,
        selectedAddress.value.id,
        deliveryType.value,
        remark.value,
        (_a = selectedCoupon.value) == null ? void 0 : _a.id
      );
      if (order) {
        common_vendor.index.showModal({
          title: "订单提交成功",
          content: `订单号: ${order.orderNo}
实付金额: ¥${order.payAmount}`,
          showCancel: false,
          success: () => {
            cartStore.clearCart();
            common_vendor.index.redirectTo({ url: "/pages/orders/list" });
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: selectedAddress.value
      }, selectedAddress.value ? {
        b: common_vendor.t(selectedAddress.value.name),
        c: common_vendor.t(selectedAddress.value.phone),
        d: common_vendor.t(selectedAddress.value.province),
        e: common_vendor.t(selectedAddress.value.city),
        f: common_vendor.t(selectedAddress.value.district),
        g: common_vendor.t(selectedAddress.value.detail)
      } : {}, {
        h: common_vendor.o(goAddress),
        i: selectedCoupon.value
      }, selectedCoupon.value ? {
        j: common_vendor.t(selectedCoupon.value.value)
      } : availableCoupons.value.length > 0 ? {
        l: common_vendor.t(availableCoupons.value.length)
      } : {}, {
        k: availableCoupons.value.length > 0,
        m: common_vendor.o(goCoupon),
        n: remark.value,
        o: common_vendor.o(($event) => remark.value = $event.detail.value),
        p: common_vendor.t(common_vendor.unref(cartStore).totalPrice),
        q: selectedCoupon.value
      }, selectedCoupon.value ? {
        r: common_vendor.t(selectedCoupon.value.value)
      } : {}, {
        s: common_vendor.t(discountText.value),
        t: common_vendor.t(finalPrice.value),
        v: common_vendor.o(submitOrder)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a7a49bdc"]]);
wx.createPage(MiniProgramPage);
