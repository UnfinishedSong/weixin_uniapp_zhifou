import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createMemberInfo, rechargeAmounts } from '@/data/member'
import type { MemberInfo } from '@/data/member'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    id: 1,
    openid: 'test_openid',
    nickname: '花韵用户',
    avatar: '',
    phone: '138****8888'
  })
  
  const memberInfo = ref<MemberInfo>(
    createMemberInfo(1, 0, 0, 0)
  )
  
  const isLoggedIn = ref(true)
  
  const login = (openid: string, nickname: string, avatar: string) => {
    userInfo.value = {
      id: 1,
      openid,
      nickname,
      avatar,
      phone: '138****8888'
    }
    isLoggedIn.value = true
  }
  
  const logout = () => {
    isLoggedIn.value = false
    userInfo.value = {
      id: 0,
      openid: '',
      nickname: '',
      avatar: '',
      phone: ''
    }
    memberInfo.value = createMemberInfo(0, 0, 0, 0)
  }
  
  const recharge = (amount: number) => {
    const bonus = rechargeAmounts.find(r => r.amount === amount)?.bonus || 0
    const totalAmount = amount + bonus
    
    memberInfo.value.balance += totalAmount
    memberInfo.value.points += amount
    memberInfo.value.totalRecharge += amount
    
    const newMemberInfo = createMemberInfo(
      memberInfo.value.userId,
      memberInfo.value.balance,
      memberInfo.value.points,
      memberInfo.value.totalRecharge
    )
    
    memberInfo.value.level = newMemberInfo.level
    memberInfo.value.levelName = newMemberInfo.levelName
    memberInfo.value.progress = newMemberInfo.progress
    memberInfo.value.benefits = newMemberInfo.benefits
    
    uni.showToast({
      title: `充值成功！到账${totalAmount}元`,
      icon: 'success'
    })
  }
  
  const spend = (amount: number) => {
    if (memberInfo.value.balance >= amount) {
      memberInfo.value.balance -= amount
      memberInfo.value.points += Math.floor(amount * 0.5)
      return true
    }
    return false
  }
  
  const discount = computed(() => {
    return memberInfo.value.level === 1 ? 1 : 
           memberInfo.value.level === 2 ? 0.95 :
           memberInfo.value.level === 3 ? 0.9 : 0.85
  })
  
  return {
    userInfo,
    memberInfo,
    isLoggedIn,
    login,
    logout,
    recharge,
    spend,
    discount
  }
})
