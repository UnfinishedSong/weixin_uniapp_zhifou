"use strict";
const common_vendor = require("../../common/vendor.js");
const data_products = require("../../data/products.js");
const stores_cart = require("../../stores/cart.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  setup(__props) {
    const cartStore = stores_cart.useCartStore();
    const product = common_vendor.ref(null);
    const selectedSpec = common_vendor.ref("");
    const quantity = common_vendor.ref(1);
    common_vendor.onMounted(() => {
      var _a, _b, _c;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const id = parseInt(((_a = currentPage.options) == null ? void 0 : _a.id) || "1");
      product.value = data_products.getProductById(id) || null;
      if ((_c = (_b = product.value) == null ? void 0 : _b.specs) == null ? void 0 : _c.length) {
        selectedSpec.value = product.value.specs[0];
      }
    });
    const selectSpec = (spec) => {
      selectedSpec.value = spec;
    };
    const increaseQty = () => {
      if (product.value && quantity.value < product.value.stock) {
        quantity.value++;
      }
    };
    const decreaseQty = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };
    const addToCart = () => {
      if (product.value) {
        cartStore.addItem(product.value, quantity.value, selectedSpec.value);
      }
    };
    const buyNow = () => {
      if (product.value) {
        cartStore.addItem(product.value, quantity.value, selectedSpec.value);
        common_vendor.index.navigateTo({ url: "/pages/checkout/checkout" });
      }
    };
    const goHome = () => {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    };
    const goCart = () => {
      common_vendor.index.switchTab({ url: "/pages/cart/cart" });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      return common_vendor.e({
        a: common_vendor.f(((_a = product.value) == null ? void 0 : _a.images) || [], (image, index, i0) => {
          return {
            a: image,
            b: index
          };
        }),
        b: common_vendor.t((_b = product.value) == null ? void 0 : _b.name),
        c: (_c = product.value) == null ? void 0 : _c.isHot
      }, ((_d = product.value) == null ? void 0 : _d.isHot) ? {} : {}, {
        d: (_e = product.value) == null ? void 0 : _e.isNew
      }, ((_f = product.value) == null ? void 0 : _f.isNew) ? {} : {}, {
        e: common_vendor.t((_g = product.value) == null ? void 0 : _g.price),
        f: (_h = product.value) == null ? void 0 : _h.originalPrice
      }, ((_i = product.value) == null ? void 0 : _i.originalPrice) ? {
        g: common_vendor.t((_j = product.value) == null ? void 0 : _j.originalPrice)
      } : {}, {
        h: (_k = product.value) == null ? void 0 : _k.originalPrice
      }, ((_l = product.value) == null ? void 0 : _l.originalPrice) ? {
        i: common_vendor.t((((_m = product.value) == null ? void 0 : _m.originalPrice) || 0) - (((_n = product.value) == null ? void 0 : _n.price) || 0))
      } : {}, {
        j: common_vendor.t((_o = product.value) == null ? void 0 : _o.description),
        k: common_vendor.t((_p = product.value) == null ? void 0 : _p.sales),
        l: common_vendor.t((_q = product.value) == null ? void 0 : _q.stock),
        m: common_vendor.f(((_r = product.value) == null ? void 0 : _r.specs) || [], (spec, index, i0) => {
          return {
            a: common_vendor.t(spec),
            b: index,
            c: selectedSpec.value === spec ? 1 : "",
            d: common_vendor.o(($event) => selectSpec(spec), index)
          };
        }),
        n: common_vendor.o(decreaseQty),
        o: common_vendor.t(quantity.value),
        p: common_vendor.o(increaseQty),
        q: common_vendor.o(goHome),
        r: common_vendor.unref(cartStore).totalCount > 0
      }, common_vendor.unref(cartStore).totalCount > 0 ? {
        s: common_vendor.t(common_vendor.unref(cartStore).totalCount)
      } : {}, {
        t: common_vendor.o(goCart),
        v: common_vendor.o(addToCart),
        w: common_vendor.o(buyNow)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8216645a"]]);
wx.createPage(MiniProgramPage);
