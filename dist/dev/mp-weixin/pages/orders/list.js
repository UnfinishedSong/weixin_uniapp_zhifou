"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_order = require("../../stores/order.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "list",
  setup(__props) {
    const orderStore = stores_order.useOrderStore();
    const tabs = [
      { label: "待付款", value: "pending" },
      { label: "待收货", value: "shipped" },
      { label: "已完成", value: "completed" }
    ];
    const statusText = {
      pending: "待付款",
      paid: "已付款",
      shipped: "待收货",
      completed: "已完成",
      cancelled: "已取消"
    };
    const activeTab = common_vendor.ref("");
    const filteredOrders = common_vendor.computed(() => {
      return orderStore.orders.filter((o) => o.status === activeTab.value);
    });
    const payOrder = (orderId) => {
      orderStore.payOrder(orderId);
    };
    const cancelOrder = (orderId) => {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确定要取消这个订单吗？",
        success: (res) => {
          if (res.confirm) {
            orderStore.cancelOrder(orderId);
          }
        }
      });
    };
    const confirmOrder = (orderId) => {
      common_vendor.index.showModal({
        title: "确认收货",
        content: "确定已收到商品吗？",
        success: (res) => {
          if (res.confirm) {
            orderStore.confirmOrder(orderId);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: tab.value,
            c: activeTab.value === tab.value ? 1 : "",
            d: common_vendor.o(($event) => activeTab.value = tab.value, tab.value)
          };
        }),
        b: filteredOrders.value.length > 0
      }, filteredOrders.value.length > 0 ? common_vendor.e({
        c: common_vendor.f(filteredOrders.value, (order, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(order.orderNo),
            b: common_vendor.t(statusText[order.status]),
            c: common_vendor.n(order.status)
          }, _ctx.item.spec ? {
            d: common_vendor.t(_ctx.item.spec)
          } : {}, {
            e: order.id
          });
        }),
        d: _ctx.item.image,
        e: common_vendor.t(_ctx.item.productName),
        f: _ctx.item.spec,
        g: common_vendor.t(_ctx.item.price),
        h: common_vendor.t(_ctx.item.quantity),
        i: common_vendor.t(_ctx.order.payAmount),
        j: _ctx.order.status === "pending"
      }, _ctx.order.status === "pending" ? {
        k: common_vendor.o(($event) => payOrder(_ctx.order.id))
      } : {}, {
        l: _ctx.order.status === "pending"
      }, _ctx.order.status === "pending" ? {
        m: common_vendor.o(($event) => cancelOrder(_ctx.order.id))
      } : {}, {
        n: _ctx.order.status === "shipped"
      }, _ctx.order.status === "shipped" ? {
        o: common_vendor.o(($event) => confirmOrder(_ctx.order.id))
      } : {}, {
        p: _ctx.order.status === "completed"
      }, _ctx.order.status === "completed" ? {} : {}) : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-15d966e3"]]);
wx.createPage(MiniProgramPage);
