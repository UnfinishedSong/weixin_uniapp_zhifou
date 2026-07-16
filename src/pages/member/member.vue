<template>
  <view class="page">
    <view class="member-header" :style="{ background: headerGradient }">
      <view class="member-info">
        <view class="avatar-wrap">
          <text class="avatar">👤</text>
          <view class="level-badge">{{ userStore.memberInfo.levelName }}</view>
        </view>
        <view class="user-detail">
          <text class="user-name">{{ userStore.userInfo.nickname }}</text>
          <text class="user-phone">{{ userStore.userInfo.phone }}</text>
        </view>
      </view>
      
      <view class="balance-card">
        <view class="balance-item">
          <text class="balance-label">余额</text>
          <text class="balance-value">{{ userStore.memberInfo.balance }}</text>
        </view>
        <view class="divider"></view>
        <view class="balance-item">
          <text class="balance-label">积分</text>
          <text class="balance-value">{{ userStore.memberInfo.points }}</text>
        </view>
        <view class="divider"></view>
        <view class="balance-item">
          <text class="balance-label">累计消费</text>
          <text class="balance-value">{{ userStore.memberInfo.totalSpent }}</text>
        </view>
      </view>

      <view class="progress-section">
        <view class="progress-header">
          <text class="progress-title">会员成长进度</text>
          <text class="progress-target">{{ nextLevelName }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: userStore.memberInfo.progress + '%' }"></view>
        </view>
        <view class="progress-info">
          <text>{{ userStore.memberInfo.levelName }}</text>
          <text>已消费 ¥{{ userStore.memberInfo.totalSpent }}</text>
        </view>
      </view>
    </view>

    <view class="benefits-section">
      <view class="section-title">
        <text class="title-icon">🎁</text>
        <text class="title-text">会员权益</text>
      </view>
      <view class="benefits-list">
        <view 
          v-for="(benefit, index) in userStore.memberInfo.benefits" 
          :key="index"
          class="benefit-item"
        >
          <text class="benefit-icon">✓</text>
          <text class="benefit-text">{{ benefit }}</text>
        </view>
      </view>
    </view>

    <view class="level-guide-section">
      <view class="section-title">
        <text class="title-icon">📊</text>
        <text class="title-text">会员等级说明</text>
      </view>
      <view class="level-list">
        <view 
          v-for="level in memberLevels" 
          :key="level.level"
          class="level-item"
          :class="{ current: level.level === userStore.memberInfo.level }"
        >
          <view class="level-header">
            <text class="level-name">{{ level.name }}</text>
            <text v-if="level.level === userStore.memberInfo.level" class="current-tag">当前</text>
          </view>
          <view class="level-detail">
            <text class="level-amount">消费满{{ level.minAmount }}元</text>
            <text class="level-discount">享{{ (level.discount * 10).toFixed(1) }}折优惠</text>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useUserStore } from '@/stores/user'
import { memberLevels } from '@/data/member'

const userStore = useUserStore()

const levelColors = ['#FF6B9D', '#FFB6C8', '#FFB347', '#52C41A']

const headerGradient = computed(() => {
  const color = levelColors[Math.min(userStore.memberInfo.level - 1, 3)] || '#FF6B9D'
  return `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, 30)} 100%)`
})

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount)
  const b = Math.min(255, (num & 0x0000FF) + amount)
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

const nextLevelName = computed(() => {
  const currentLevel = userStore.memberInfo.level
  const nextLevel = memberLevels.find(l => l.level === currentLevel + 1)
  return nextLevel ? `下一等级: ${nextLevel.name}` : '已达最高等级'
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 130rpx;
}

.member-header {
  padding: 40rpx 30rpx;
  padding-top: 80rpx;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar-wrap {
  position: relative;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
}

.level-badge {
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #FF6B9D;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  white-space: nowrap;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.user-phone {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.balance-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.balance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-label {
  font-size: 26rpx;
  color: #999999;
}

.balance-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-top: 8rpx;
  
  &::before {
    content: '¥';
    font-size: 28rpx;
  }
  
  &:nth-child(3)::before {
    content: '';
  }
}

.divider {
  width: 2rpx;
  height: 60rpx;
  background: #EEEEEE;
}

.progress-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 20rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.progress-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.progress-target {
  font-size: 24rpx;
  color: #FF6B9D;
}

.progress-bar {
  height: 16rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 8rpx;
  transition: width 0.5s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
  
  text {
    font-size: 24rpx;
    color: #666666;
  }
}

.benefits-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.title-icon {
  font-size: 32rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.benefits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: #FFF0F3;
  padding: 16rpx 24rpx;
  border-radius: 20rpx;
}

.benefit-icon {
  font-size: 24rpx;
  color: #FF6B9D;
}

.benefit-text {
  font-size: 26rpx;
  color: #333333;
}

.level-guide-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.level-item {
  border: 2rpx solid #EEEEEE;
  border-radius: 16rpx;
  padding: 20rpx;
  transition: all 0.3s ease;
  
  &.current {
    border-color: #FF6B9D;
    background: rgba(255, 107, 157, 0.05);
  }
}

.level-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.level-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.current-tag {
  font-size: 22rpx;
  color: #FF6B9D;
  background: rgba(255, 107, 157, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.level-detail {
  display: flex;
  gap: 24rpx;
  margin-top: 12rpx;
}

.level-amount,
.level-discount {
  font-size: 24rpx;
  color: #999999;
}
</style>