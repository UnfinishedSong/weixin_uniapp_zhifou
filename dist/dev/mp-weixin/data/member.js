"use strict";
const memberLevels = [
  {
    level: 1,
    name: "含苞待放",
    minAmount: 0,
    discount: 1,
    benefits: ["基础服务"]
  },
  {
    level: 2,
    name: "初露锋芒",
    minAmount: 300,
    discount: 0.98,
    benefits: ["生日礼", "专属客服", "9.8折优惠"]
  },
  {
    level: 3,
    name: "繁花似锦",
    minAmount: 800,
    discount: 0.95,
    benefits: ["生日礼", "专属客服", "优先配送", "9.5折优惠"]
  },
  {
    level: 4,
    name: "绽放芳华",
    minAmount: 2e3,
    discount: 0.9,
    benefits: ["生日礼", "专属客服", "优先配送", "专属折扣", "9折优惠"]
  }
];
function getMemberLevel(totalSpent) {
  for (let i = memberLevels.length - 1; i >= 0; i--) {
    if (totalSpent >= memberLevels[i].minAmount) {
      return memberLevels[i];
    }
  }
  return memberLevels[0];
}
function calculateProgress(totalSpent) {
  const currentLevel = getMemberLevel(totalSpent);
  const nextLevel = memberLevels.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel)
    return 100;
  const diff = nextLevel.minAmount - currentLevel.minAmount;
  const currentDiff = totalSpent - currentLevel.minAmount;
  return Math.min(100, Math.round(currentDiff / diff * 100));
}
function createMemberInfo(userId, balance, points, totalSpent) {
  const levelInfo = getMemberLevel(totalSpent);
  return {
    id: userId,
    userId,
    level: levelInfo.level,
    levelName: levelInfo.name,
    balance,
    points,
    totalSpent,
    progress: calculateProgress(totalSpent),
    benefits: levelInfo.benefits
  };
}
exports.createMemberInfo = createMemberInfo;
exports.memberLevels = memberLevels;
