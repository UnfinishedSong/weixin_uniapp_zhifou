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
  totalSpent: number
  progress: number
  benefits: string[]
}

export const memberLevels: MemberLevel[] = [
  {
    level: 1,
    name: '含苞待放',
    minAmount: 0,
    discount: 1,
    benefits: ['基础服务']
  },
  {
    level: 2,
    name: '初露锋芒',
    minAmount: 300,
    discount: 0.98,
    benefits: ['生日礼', '专属客服', '9.8折优惠']
  },
  {
    level: 3,
    name: '繁花似锦',
    minAmount: 800,
    discount: 0.95,
    benefits: ['生日礼', '专属客服', '优先配送', '9.5折优惠']
  },
  {
    level: 4,
    name: '绽放芳华',
    minAmount: 2000,
    discount: 0.9,
    benefits: ['生日礼', '专属客服', '优先配送', '专属折扣', '9折优惠']
  }
]

export function getMemberLevel(totalSpent: number): MemberLevel {
  for (let i = memberLevels.length - 1; i >= 0; i--) {
    if (totalSpent >= memberLevels[i].minAmount) {
      return memberLevels[i]
    }
  }
  return memberLevels[0]
}

export function calculateProgress(totalSpent: number): number {
  const currentLevel = getMemberLevel(totalSpent)
  const nextLevel = memberLevels.find(l => l.level === currentLevel.level + 1)
  
  if (!nextLevel) return 100
  
  const diff = nextLevel.minAmount - currentLevel.minAmount
  const currentDiff = totalSpent - currentLevel.minAmount
  
  return Math.min(100, Math.round((currentDiff / diff) * 100))
}

export function createMemberInfo(userId: number, balance: number, points: number, totalSpent: number): MemberInfo {
  const levelInfo = getMemberLevel(totalSpent)
  
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
  }
}

export const rechargeAmounts = [
  { amount: 50, bonus: 0 },
  { amount: 100, bonus: 5 },
  { amount: 200, bonus: 15 },
  { amount: 500, bonus: 50 },
  { amount: 1000, bonus: 120 }
]
