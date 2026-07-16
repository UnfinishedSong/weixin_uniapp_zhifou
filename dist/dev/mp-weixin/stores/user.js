"use strict";
const common_vendor = require("../common/vendor.js");
const data_member = require("../data/member.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref({
    id: 1,
    openid: "test_openid",
    nickname: "知否用户",
    avatar: "",
    phone: "138****8888"
  });
  const memberInfo = common_vendor.ref(
    data_member.createMemberInfo(1, 0, 0, 0)
  );
  const isLoggedIn = common_vendor.ref(true);
  const login = (openid, nickname, avatar) => {
    userInfo.value = {
      id: 1,
      openid,
      nickname,
      avatar,
      phone: "138****8888"
    };
    isLoggedIn.value = true;
  };
  const logout = () => {
    isLoggedIn.value = false;
    userInfo.value = {
      id: 0,
      openid: "",
      nickname: "",
      avatar: "",
      phone: ""
    };
    memberInfo.value = data_member.createMemberInfo(0, 0, 0, 0);
  };
  const spend = (amount) => {
    memberInfo.value.totalSpent += amount;
    memberInfo.value.points += Math.floor(amount * 0.5);
    const newMemberInfo = data_member.createMemberInfo(
      memberInfo.value.userId,
      memberInfo.value.balance,
      memberInfo.value.points,
      memberInfo.value.totalSpent
    );
    memberInfo.value.level = newMemberInfo.level;
    memberInfo.value.levelName = newMemberInfo.levelName;
    memberInfo.value.progress = newMemberInfo.progress;
    memberInfo.value.benefits = newMemberInfo.benefits;
  };
  const discount = common_vendor.computed(() => {
    return memberInfo.value.level === 1 ? 1 : memberInfo.value.level === 2 ? 0.98 : memberInfo.value.level === 3 ? 0.95 : 0.9;
  });
  return {
    userInfo,
    memberInfo,
    isLoggedIn,
    login,
    logout,
    spend,
    discount
  };
});
exports.useUserStore = useUserStore;
