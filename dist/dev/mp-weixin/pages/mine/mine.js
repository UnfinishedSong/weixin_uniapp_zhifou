"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const stores_order = require("../../stores/order.js");
const data_member = require("../../data/member.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "mine",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const orderStore = stores_order.useOrderStore();
    const levelColors = ["#FF6B9D", "#FFB6C8", "#FFB347", "#52C41A"];
    const headerGradient = common_vendor.computed(() => {
      const color = levelColors[Math.min(userStore.memberInfo.level - 1, 3)] || "#FF6B9D";
      return `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, 30)} 100%)`;
    });
    function adjustColor(hex, amount) {
      const num = parseInt(hex.replace("#", ""), 16);
      const r = Math.min(255, (num >> 16) + amount);
      const g = Math.min(255, (num >> 8 & 255) + amount);
      const b = Math.min(255, (num & 255) + amount);
      return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }
    const nextLevelName = common_vendor.computed(() => {
      const currentLevel = userStore.memberInfo.level;
      const nextLevel = data_member.memberLevels.find((l) => l.level === currentLevel + 1);
      return nextLevel ? `下一等级: ${nextLevel.name}` : "已达最高等级";
    });
    const getOrderStatus = (order) => {
      const statusMap = {
        pending: "待下单",
        paid: "已付款",
        making: "制作中",
        shipped: "配送中",
        pickup_ready: "待自取",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[order.status] || "未知状态";
    };
    const recentOrders = common_vendor.computed(() => orderStore.orders.slice(0, 3));
    const totalQty = (order) => {
      return order.items.reduce((sum, item) => sum + item.quantity, 0);
    };
    const goEditProfile = () => {
      common_vendor.index.showToast({ title: "编辑资料功能开发中", icon: "none" });
    };
    const goOrders = (status) => {
      const url = status ? `/pages/orders/list?status=${status}` : "/pages/orders/list";
      common_vendor.index.navigateTo({ url });
    };
    const goOrderDetail = (orderId) => {
      common_vendor.index.showToast({ title: "订单详情功能开发中", icon: "none" });
    };
    const goAddress = () => {
      common_vendor.index.navigateTo({ url: "/pages/address/list" });
    };
    const goConsult = () => {
      common_vendor.index.showModal({
        title: "🌸 详情咨询",
        content: "有任何问题都可以联系我们哦~\n\n📞 客服热线：138-8888-8888\n💬 微信同号，欢迎骚扰~",
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
        a: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname),
        b: common_vendor.t(common_vendor.unref(userStore).memberInfo.levelName),
        c: common_vendor.o(goEditProfile),
        d: headerGradient.value,
        e: common_vendor.t(nextLevelName.value),
        f: common_vendor.unref(userStore).memberInfo.progress + "%",
        g: common_vendor.t(common_vendor.unref(userStore).memberInfo.levelName),
        h: common_vendor.t(common_vendor.unref(userStore).memberInfo.totalSpent),
        i: common_vendor.f(common_vendor.unref(userStore).memberInfo.benefits, (benefit, index, i0) => {
          return {
            a: common_vendor.t(benefit),
            b: index
          };
        }),
        j: common_vendor.o(goOrders),
        k: recentOrders.value.length > 0
      }, recentOrders.value.length > 0 ? {
        l: common_vendor.f(recentOrders.value, (order, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(order.orderNo),
            b: common_vendor.t(getOrderStatus(order)),
            c: common_vendor.n(order.status),
            d: common_vendor.t(order.deliveryType === "delivery" ? "🚀 外卖配送" : "🏪 门店自提"),
            e: common_vendor.n(order.deliveryType),
            f: common_vendor.f(order.items.slice(0, 3), (item, k1, i1) => {
              return {
                a: item.image,
                b: item.id
              };
            }),
            g: order.items.length > 3
          }, order.items.length > 3 ? {
            h: common_vendor.t(order.items.length - 3)
          } : {}, {
            i: common_vendor.t(totalQty(order)),
            j: common_vendor.t(order.payAmount),
            k: order.status === "pending"
          }, order.status === "pending" ? {
            l: common_vendor.o(($event) => cancelOrder(order.id), order.id),
            m: common_vendor.o(($event) => payOrder(order.id), order.id)
          } : order.status === "shipped" ? {
            o: common_vendor.o(($event) => confirmOrder(order.id), order.id)
          } : order.status === "pickup_ready" ? {
            q: common_vendor.o(($event) => confirmOrder(order.id), order.id)
          } : {}, {
            n: order.status === "shipped",
            p: order.status === "pickup_ready",
            r: order.id,
            s: common_vendor.o(($event) => goOrderDetail(order.id), order.id)
          });
        })
      } : {}, {
        m: common_vendor.o(goAddress),
        n: common_vendor.o(goConsult)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d41d38da"]]);
wx.createPage(MiniProgramPage);
