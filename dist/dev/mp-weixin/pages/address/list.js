"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_order = require("../../stores/order.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "list",
  setup(__props) {
    const orderStore = stores_order.useOrderStore();
    const selectedId = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      const defaultAddress = orderStore.getDefaultAddress();
      if (defaultAddress) {
        selectedId.value = defaultAddress.id;
      }
    });
    const selectAddress = (id) => {
      selectedId.value = id;
      orderStore.setDefaultAddress(id);
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 200);
    };
    const addAddress = () => {
      common_vendor.index.showToast({ title: "添加地址功能开发中", icon: "none" });
    };
    const editAddress = (address) => {
      common_vendor.index.showToast({ title: "编辑地址功能开发中", icon: "none" });
    };
    const deleteAddress = (id) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个地址吗？",
        success: (res) => {
          if (res.confirm) {
            orderStore.deleteAddress(id);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(orderStore).addresses.length > 0
      }, common_vendor.unref(orderStore).addresses.length > 0 ? {
        b: common_vendor.f(common_vendor.unref(orderStore).addresses, (address, k0, i0) => {
          return common_vendor.e({
            a: selectedId.value === address.id
          }, selectedId.value === address.id ? {} : {}, {
            b: selectedId.value === address.id ? 1 : "",
            c: common_vendor.t(address.name),
            d: common_vendor.t(address.phone),
            e: address.isDefault
          }, address.isDefault ? {} : {}, {
            f: common_vendor.t(address.province),
            g: common_vendor.t(address.city),
            h: common_vendor.t(address.district),
            i: common_vendor.t(address.detail),
            j: common_vendor.o(($event) => editAddress(), address.id),
            k: common_vendor.o(($event) => deleteAddress(address.id), address.id),
            l: address.id,
            m: selectedId.value === address.id ? 1 : "",
            n: common_vendor.o(($event) => selectAddress(address.id), address.id)
          });
        })
      } : {}, {
        c: common_vendor.o(addAddress)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b9746c2a"]]);
wx.createPage(MiniProgramPage);
