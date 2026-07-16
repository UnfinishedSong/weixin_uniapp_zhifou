"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const data_member = require("../../data/member.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "member",
  setup(__props) {
    const userStore = stores_user.useUserStore();
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(userStore).memberInfo.levelName),
        b: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname),
        c: common_vendor.t(common_vendor.unref(userStore).userInfo.phone),
        d: common_vendor.t(common_vendor.unref(userStore).memberInfo.balance),
        e: common_vendor.t(common_vendor.unref(userStore).memberInfo.points),
        f: common_vendor.t(common_vendor.unref(userStore).memberInfo.totalSpent),
        g: common_vendor.t(nextLevelName.value),
        h: common_vendor.unref(userStore).memberInfo.progress + "%",
        i: common_vendor.t(common_vendor.unref(userStore).memberInfo.levelName),
        j: common_vendor.t(common_vendor.unref(userStore).memberInfo.totalSpent),
        k: headerGradient.value,
        l: common_vendor.f(common_vendor.unref(userStore).memberInfo.benefits, (benefit, index, i0) => {
          return {
            a: common_vendor.t(benefit),
            b: index
          };
        }),
        m: common_vendor.f(common_vendor.unref(data_member.memberLevels), (level, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(level.name),
            b: level.level === common_vendor.unref(userStore).memberInfo.level
          }, level.level === common_vendor.unref(userStore).memberInfo.level ? {} : {}, {
            c: common_vendor.t(level.minAmount),
            d: common_vendor.t((level.discount * 10).toFixed(1)),
            e: level.level,
            f: level.level === common_vendor.unref(userStore).memberInfo.level ? 1 : ""
          });
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-afe8e14b"]]);
wx.createPage(MiniProgramPage);
