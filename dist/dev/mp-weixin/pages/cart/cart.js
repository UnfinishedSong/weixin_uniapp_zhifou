"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_cart = require("../../stores/cart.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "cart",
  setup(__props) {
    const cartStore = stores_cart.useCartStore();
    const selectedIds = common_vendor.ref([]);
    const isAllSelected = common_vendor.computed(() => {
      return cartStore.items.length > 0 && selectedIds.value.length === cartStore.items.length;
    });
    const selectedCount = common_vendor.computed(() => {
      return selectedIds.value.reduce((count, id) => {
        const item = cartStore.items.find((i) => i.id === id);
        return count + ((item == null ? void 0 : item.quantity) || 0);
      }, 0);
    });
    const selectedTotal = common_vendor.computed(() => {
      return selectedIds.value.reduce((total, id) => {
        const item = cartStore.items.find((i) => i.id === id);
        return total + ((item == null ? void 0 : item.product.price) || 0) * ((item == null ? void 0 : item.quantity) || 0);
      }, 0);
    });
    const toggleSelect = (id) => {
      const index = selectedIds.value.indexOf(id);
      if (index === -1) {
        selectedIds.value.push(id);
      } else {
        selectedIds.value.splice(index, 1);
      }
    };
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedIds.value = [];
      } else {
        selectedIds.value = cartStore.items.map((item) => item.id);
      }
    };
    const increaseQty = (item) => {
      cartStore.updateQuantity(item.id, item.quantity + 1);
    };
    const decreaseQty = (item) => {
      cartStore.updateQuantity(item.id, item.quantity - 1);
    };
    const removeItem = (id) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个商品吗？",
        success: (res) => {
          if (res.confirm) {
            cartStore.removeItem(id);
            const index = selectedIds.value.indexOf(id);
            if (index !== -1) {
              selectedIds.value.splice(index, 1);
            }
          }
        }
      });
    };
    const goShopping = () => {
      common_vendor.index.switchTab({ url: "/pages/order/order" });
    };
    const goDetail = (productId) => {
      common_vendor.index.navigateTo({ url: `/pages/product/detail?id=${productId}` });
    };
    const goCheckout = () => {
      if (selectedIds.value.length === 0) {
        common_vendor.index.showToast({ title: "请选择商品", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/checkout/checkout" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(cartStore).isEmpty
      }, common_vendor.unref(cartStore).isEmpty ? {
        b: common_vendor.o(goShopping)
      } : {
        c: common_vendor.f(common_vendor.unref(cartStore).items, (item, k0, i0) => {
          return common_vendor.e({
            a: selectedIds.value.includes(item.id)
          }, selectedIds.value.includes(item.id) ? {} : {}, {
            b: selectedIds.value.includes(item.id) ? 1 : "",
            c: common_vendor.o(($event) => toggleSelect(item.id), item.id),
            d: item.product.images[0],
            e: common_vendor.o(($event) => goDetail(item.product.id), item.id),
            f: common_vendor.t(item.product.name),
            g: item.spec
          }, item.spec ? {
            h: common_vendor.t(item.spec)
          } : {}, {
            i: common_vendor.t(item.product.price),
            j: common_vendor.o(($event) => decreaseQty(item), item.id),
            k: common_vendor.t(item.quantity),
            l: common_vendor.o(($event) => increaseQty(item), item.id),
            m: common_vendor.o(($event) => removeItem(item.id), item.id),
            n: item.id
          });
        })
      }, {
        d: !common_vendor.unref(cartStore).isEmpty
      }, !common_vendor.unref(cartStore).isEmpty ? common_vendor.e({
        e: isAllSelected.value
      }, isAllSelected.value ? {} : {}, {
        f: isAllSelected.value ? 1 : "",
        g: common_vendor.o(toggleSelectAll),
        h: common_vendor.t(selectedTotal.value),
        i: common_vendor.t(selectedCount.value),
        j: common_vendor.o(goCheckout)
      }) : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fb6ea9e5"]]);
wx.createPage(MiniProgramPage);
