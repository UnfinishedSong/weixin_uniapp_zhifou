"use strict";
const common_vendor = require("../../common/vendor.js");
const data_products = require("../../data/products.js");
const stores_cart = require("../../stores/cart.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "order",
  setup(__props) {
    const cartStore = stores_cart.useCartStore();
    const searchKeyword = common_vendor.ref("");
    const selectedCategory = common_vendor.ref(0);
    const showCartPopup = common_vendor.ref(false);
    const selectedIds = common_vendor.ref([]);
    const hotProducts = common_vendor.ref(data_products.getHotProducts());
    const deliveryType = common_vendor.ref("delivery");
    const allCategories = common_vendor.computed(() => [
      { id: 0, name: "全部", icon: "🌸" },
      ...data_products.categories
    ]);
    const filteredProducts = common_vendor.computed(() => {
      let result = selectedCategory.value === 0 ? data_products.products : data_products.products.filter((p) => p.categoryId === selectedCategory.value);
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        result = result.filter(
          (p) => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword)
        );
      }
      return result;
    });
    const qtyMap = common_vendor.ref({});
    const getQty = (productId) => {
      return qtyMap.value[productId] || 0;
    };
    const increaseQty = (product) => {
      qtyMap.value[product.id] = (qtyMap.value[product.id] || 0) + 1;
      cartStore.addItem(product, 1);
    };
    const decreaseQty = (product) => {
      const currentQty = qtyMap.value[product.id] || 0;
      if (currentQty > 0) {
        qtyMap.value[product.id] = currentQty - 1;
        const cartItem = cartStore.items.find((item) => item.product.id === product.id);
        if (cartItem) {
          cartStore.updateQuantity(cartItem.id, cartItem.quantity - 1);
        }
      }
    };
    const cartCount = common_vendor.computed(() => cartStore.totalCount);
    const totalPrice = common_vendor.computed(() => cartStore.totalPrice);
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
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
    };
    const handleSearch = () => {
    };
    const clearSearch = () => {
      searchKeyword.value = "";
    };
    const goDetail = (productId) => {
      common_vendor.index.navigateTo({ url: `/pages/product/detail?id=${productId}` });
    };
    const toggleCartPopup = () => {
      showCartPopup.value = !showCartPopup.value;
      if (showCartPopup.value) {
        selectedIds.value = cartStore.items.map((item) => item.id);
      }
    };
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
    const updateCartQty = (item, quantity) => {
      if (quantity <= 0) {
        removeItem(item.id);
      } else {
        cartStore.updateQuantity(item.id, quantity);
        qtyMap.value[item.product.id] = quantity;
      }
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
    const goCheckout = () => {
      if (cartStore.items.length === 0) {
        common_vendor.index.showToast({ title: "请选择商品", icon: "none" });
        return;
      }
      showCartPopup.value = false;
      common_vendor.index.navigateTo({ url: `/pages/checkout/checkout?deliveryType=${deliveryType.value}` });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: searchKeyword.value,
        c: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        d: searchKeyword.value
      }, searchKeyword.value ? {
        e: common_vendor.o(clearSearch)
      } : {}, {
        f: common_vendor.f(allCategories.value, (category, k0, i0) => {
          return {
            a: common_vendor.t(category.icon),
            b: common_vendor.t(category.name),
            c: category.id,
            d: selectedCategory.value === category.id ? 1 : "",
            e: common_vendor.o(($event) => selectCategory(category.id), category.id)
          };
        }),
        g: hotProducts.value.length > 0
      }, hotProducts.value.length > 0 ? {
        h: common_vendor.f(hotProducts.value, (product, k0, i0) => {
          return {
            a: product.images[0],
            b: common_vendor.t(product.name),
            c: common_vendor.t(product.price),
            d: common_vendor.o(($event) => increaseQty(product), product.id),
            e: product.id,
            f: common_vendor.o(($event) => goDetail(product.id), product.id)
          };
        })
      } : {}, {
        i: filteredProducts.value.length > 0
      }, filteredProducts.value.length > 0 ? {
        j: common_vendor.f(filteredProducts.value, (product, k0, i0) => {
          var _a;
          return common_vendor.e({
            a: product.images[0],
            b: common_vendor.t(product.name),
            c: common_vendor.t(product.description),
            d: common_vendor.f(((_a = product.specs) == null ? void 0 : _a.slice(0, 2)) || [], (spec, index, i1) => {
              return {
                a: common_vendor.t(spec),
                b: index
              };
            }),
            e: common_vendor.t(product.price),
            f: common_vendor.o(($event) => increaseQty(product), product.id),
            g: getQty(product.id) > 0
          }, getQty(product.id) > 0 ? {
            h: common_vendor.t(getQty(product.id))
          } : {}, {
            i: getQty(product.id) > 0
          }, getQty(product.id) > 0 ? {
            j: common_vendor.o(($event) => decreaseQty(product), product.id)
          } : {}, {
            k: product.id
          });
        })
      } : {}, {
        k: cartCount.value > 0
      }, cartCount.value > 0 ? {
        l: common_vendor.t(cartCount.value > 99 ? "99+" : cartCount.value)
      } : {}, {
        m: common_vendor.o(toggleCartPopup),
        n: common_vendor.t(totalPrice.value),
        o: common_vendor.o(goCheckout),
        p: showCartPopup.value
      }, showCartPopup.value ? {
        q: common_vendor.o(toggleCartPopup)
      } : {}, {
        r: common_vendor.o(toggleCartPopup),
        s: common_vendor.unref(cartStore).isEmpty
      }, common_vendor.unref(cartStore).isEmpty ? {} : {
        t: common_vendor.f(common_vendor.unref(cartStore).items, (item, k0, i0) => {
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
            j: common_vendor.o(($event) => updateCartQty(item, item.quantity - 1), item.id),
            k: common_vendor.t(item.quantity),
            l: common_vendor.o(($event) => updateCartQty(item, item.quantity + 1), item.id),
            m: common_vendor.o(($event) => removeItem(item.id), item.id),
            n: item.id
          });
        })
      }, {
        v: !common_vendor.unref(cartStore).isEmpty
      }, !common_vendor.unref(cartStore).isEmpty ? common_vendor.e({
        w: isAllSelected.value
      }, isAllSelected.value ? {} : {}, {
        x: isAllSelected.value ? 1 : "",
        y: common_vendor.o(toggleSelectAll),
        z: common_vendor.t(selectedTotal.value),
        A: common_vendor.t(selectedCount.value),
        B: common_vendor.o(goCheckout)
      }) : {}, {
        C: showCartPopup.value ? 1 : ""
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-88bf5328"]]);
wx.createPage(MiniProgramPage);
