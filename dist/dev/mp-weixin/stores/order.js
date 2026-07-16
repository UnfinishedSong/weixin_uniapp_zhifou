"use strict";
const common_vendor = require("../common/vendor.js");
const useOrderStore = common_vendor.defineStore("order", () => {
  const orders = common_vendor.ref([
    {
      id: 1,
      orderNo: "HY202607150001",
      items: [
        {
          id: 1,
          productId: 1,
          productName: "卡布奇诺玫瑰11枝",
          price: 168,
          quantity: 1,
          spec: "11枝",
          image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20cappuccino%20roses%20bouquet%20elegant%20floral%20arrangement&image_size=square"
        }
      ],
      address: {
        id: 1,
        name: "张三",
        phone: "138****8888",
        province: "北京市",
        city: "北京市",
        district: "朝阳区",
        detail: "朝阳区xxx街道xxx小区1号楼101室",
        isDefault: true
      },
      totalAmount: 168,
      payAmount: 168,
      status: "completed",
      createdAt: "2026-07-15 10:30:00"
    },
    {
      id: 2,
      orderNo: "HY202607140002",
      items: [
        {
          id: 2,
          productId: 4,
          productName: "康乃馨20枝",
          price: 98,
          quantity: 1,
          spec: "20枝",
          image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20carnation%20flowers%20bouquet%20warm%20pink&image_size=square"
        },
        {
          id: 3,
          productId: 5,
          productName: "向日葵10枝",
          price: 138,
          quantity: 1,
          spec: "10枝",
          image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunflowers%20bouquet%20bright%20cheerful&image_size=square"
        }
      ],
      address: {
        id: 1,
        name: "张三",
        phone: "138****8888",
        province: "北京市",
        city: "北京市",
        district: "朝阳区",
        detail: "朝阳区xxx街道xxx小区1号楼101室",
        isDefault: true
      },
      totalAmount: 236,
      payAmount: 224.2,
      status: "shipped",
      createdAt: "2026-07-14 14:20:00"
    }
  ]);
  const addresses = common_vendor.ref([
    {
      id: 1,
      name: "张三",
      phone: "138****8888",
      province: "北京市",
      city: "北京市",
      district: "朝阳区",
      detail: "朝阳区xxx街道xxx小区1号楼101室",
      isDefault: true
    },
    {
      id: 2,
      name: "李四",
      phone: "139****9999",
      province: "上海市",
      city: "上海市",
      district: "浦东新区",
      detail: "浦东新区xxx路xxx号",
      isDefault: false
    }
  ]);
  const coupons = common_vendor.ref([
    { id: 1, name: "新人专享", value: 10, minAmount: 100, used: false },
    { id: 2, name: "满减优惠", value: 20, minAmount: 200, used: false },
    { id: 3, name: "生日礼包", value: 30, minAmount: 150, used: true }
  ]);
  const createOrder = (items, addressId, deliveryType, remark, couponId) => {
    const address = addresses.value.find((a) => a.id === addressId);
    if (!address) {
      common_vendor.index.showToast({ title: "请选择收货地址", icon: "none" });
      return null;
    }
    const orderItems = items.map((item, index) => ({
      id: index + 1,
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      spec: item.spec,
      image: item.product.images[0]
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let payAmount = totalAmount;
    if (couponId) {
      const coupon = coupons.value.find((c) => c.id === couponId);
      if (coupon && !coupon.used && totalAmount >= coupon.minAmount) {
        payAmount -= coupon.value;
        coupon.used = true;
      }
    }
    const order = {
      id: Date.now(),
      orderNo: `HY${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "")}${String(orders.value.length + 1).padStart(4, "0")}`,
      items: orderItems,
      address,
      totalAmount,
      payAmount: Math.max(0, payAmount),
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN")
    };
    orders.value.unshift(order);
    return order;
  };
  const payOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId);
    if (order) {
      order.status = "paid";
      common_vendor.index.showToast({ title: "支付成功", icon: "success" });
    }
  };
  const cancelOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId);
    if (order && order.status === "pending") {
      order.status = "cancelled";
      common_vendor.index.showToast({ title: "已取消订单", icon: "success" });
    }
  };
  const confirmOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId);
    if (order && order.status === "shipped") {
      order.status = "completed";
      common_vendor.index.showToast({ title: "已确认收货", icon: "success" });
    }
  };
  const addAddress = (address) => {
    const newId = Math.max(...addresses.value.map((a) => a.id), 0) + 1;
    addresses.value.push({ ...address, id: newId });
    common_vendor.index.showToast({ title: "地址添加成功", icon: "success" });
  };
  const deleteAddress = (addressId) => {
    const index = addresses.value.findIndex((a) => a.id === addressId);
    if (index !== -1) {
      addresses.value.splice(index, 1);
      common_vendor.index.showToast({ title: "地址已删除", icon: "success" });
    }
  };
  const updateAddress = (addressId, address) => {
    const index = addresses.value.findIndex((a) => a.id === addressId);
    if (index !== -1) {
      addresses.value[index] = { ...address, id: addressId };
      common_vendor.index.showToast({ title: "地址已更新", icon: "success" });
    }
  };
  const getDefaultAddress = () => {
    return addresses.value.find((a) => a.isDefault) || addresses.value[0];
  };
  const getUnusedCoupons = () => {
    return coupons.value.filter((c) => !c.used);
  };
  return {
    orders,
    addresses,
    coupons,
    createOrder,
    payOrder,
    cancelOrder,
    confirmOrder,
    addAddress,
    deleteAddress,
    updateAddress,
    getDefaultAddress,
    getUnusedCoupons
  };
});
exports.useOrderStore = useOrderStore;
