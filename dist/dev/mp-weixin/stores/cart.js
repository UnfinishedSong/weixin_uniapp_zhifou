"use strict";
const common_vendor = require("../common/vendor.js");
const useCartStore = common_vendor.defineStore("cart", () => {
  const items = common_vendor.ref([]);
  const totalCount = common_vendor.computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });
  const totalPrice = common_vendor.computed(() => {
    return items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });
  const addItem = (product, quantity = 1, spec) => {
    const existingItem = items.value.find(
      (item) => item.product.id === product.id && item.spec === spec
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        id: Date.now(),
        product,
        quantity,
        spec
      });
    }
    common_vendor.index.showToast({
      title: "已加入购物车",
      icon: "success"
    });
  };
  const removeItem = (id) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };
  const updateQuantity = (id, quantity) => {
    const item = items.value.find((item2) => item2.id === id);
    if (item) {
      if (quantity <= 0) {
        removeItem(id);
      } else {
        item.quantity = quantity;
      }
    }
  };
  const clearCart = () => {
    items.value = [];
  };
  const isEmpty = common_vendor.computed(() => items.value.length === 0);
  return {
    items,
    totalCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty
  };
});
exports.useCartStore = useCartStore;
