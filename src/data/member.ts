export interface MemberLevel {
  level: number
  name: string
  minAmount: number
  discount: number
  benefits: string[]
}

export interface MemberInfo {
  id: number
  userId: number
  level: number
  levelName: string
  balance: number
  points: number
  totalRecharge: number
  progress: number
  benefits: string[]
}

export const memberLevels: MemberLevel[] = [
  {
    level: 1,
    name: '普通会员',
    minAmount: 0,
    discount: 1,
    benefits: ['基础服务']
  },
  {
    level: 2,
    name: '银卡会员',
    minAmount: 100,
    discount: 0.95,
    benefits: ['生日礼', '专属客服', '9.5折优惠']
  },
  {
    level: 3,
    name: '金卡会员',
    minAmount: 500,
    discount: 0.9,
    benefits: ['生日礼', '专属客服', '优先配送', '9折优惠']
  },
  {
    level: 4,
    name: '钻石会员',
    minAmount: 1000,
    discount: 0.85,
    benefits: ['生日礼', '专属客服', '优先配送', '专属折扣', '8.5折优惠']
  }
]

export function getMemberLevel(totalRecharge: number): MemberLevel {
  for (let i = memberLevels.length - 1; i >= 0; i--) {
    if (totalRecharge >= memberLevels[i].minAmount) {
      return memberLevels[i]
    }
  }
  return memberLevels[0]
}

export function calculateProgress(totalRecharge: number): number {
  const currentLevel = getMemberLevel(totalRecharge)
  const nextLevel = memberLevels.find(l => l.level === currentLevel.level + 1)
  
  if (!nextLevel) return 100
  
  const diff = nextLevel.minAmount - currentLevel.minAmount
  const currentDiff = totalRecharge - currentLevel.minAmount
  
  return Math.min(100, Math.round((currentDiff / diff) * 100))
}

export function createMemberInfo(userId: number, balance: number, points: number, totalRecharge: number): MemberInfo {
  const levelInfo = getMemberLevel(totalRecharge)
  
  return {
    id: userId,
    userId,
    level: levelInfo.level,
    levelName: levelInfo.name,
    balance,
    points,
    totalRecharge,
    progress: calculateProgress(totalRecharge),
    benefits: levelInfo.benefits
  }
}

export const rechargeAmounts = [
  { amount: 50, bonus: 0 },
  { amount: 100, bonus: 5 },
  { amount: 200, bonus: 15 },
  { amount: 500, bonus: 50 },
  { amount: 1000, bonus: 120 }
]
