<template>
  <view class="page">
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'unused' }"
        @click="activeTab = 'unused'"
      >
        <text>未使用 ({{ unusedCoupons.length }})</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'used' }"
        @click="activeTab = 'used'"
      >
        <text>已使用 ({{ usedCoupons.length }})</text>
      </view>
    </view>

    <view v-if="filteredCoupons.length > 0" class="coupon-list">
      <view 
        v-for="coupon in filteredCoupons" 
        :key="coupon.id"
        class="coupon-card"
        :class="{ disabled: activeTab === 'used' }"
        @click="selectCoupon(coupon)"
      >
        <view class="coupon-left">
          <text class="coupon-value">{{ coupon.value }}</text>
          <text class="coupon-unit">元</text>
          <text v-if="coupon.minAmount > 0" class="coupon-condition">满{{ coupon.minAmount }}可用</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ coupon.name }}</text>
          <text class="coupon-date">{{ coupon.startDate }} - {{ coupon.endDate }}</text>
          <view v-if="activeTab === 'unused'" class="coupon-status">
            <text>去使用</text>
          </view>
          <view v-else class="coupon-status used">
            <text>已使用</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">🎫</text>
      <text class="empty-text">{{ activeTab === 'unused' ? '暂无可用优惠券' : '暂无已使用优惠券' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

const activeTab = ref('unused')

const unusedCoupons = computed(() => orderStore.coupons.filter(c => !c.used))
const usedCoupons = computed(() => orderStore.coupons.filter(c => c.used))

const filteredCoupons = computed(() => {
  return activeTab.value === 'unused' ? unusedCoupons.value : usedCoupons.value
})

const selectCoupon = (coupon: typeof orderStore.coupons[0]) => {
  if (activeTab.value === 'unused') {
    uni.navigateBack()
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.tabs {
  background: #FFFFFF;
  display: flex;
  padding: 0 20rpx;
}

.tab-item {
  flex: 1;
  padding: 30rpx 0;
  text-align: center;
  position: relative;
  
  text {
    font-size: 28rpx;
    color: #666666;
    transition: color 0.3s ease;
  }
  
  &.active {
    text {
      color: #FF6B9D;
      font-weight: 500;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 6rpx;
      background: #FF6B9D;
      border-radius: 3rpx;
    }
  }
}

.coupon-list {
  padding: 20rpx;
}

.coupon-card {
  display: flex;
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  
  &.disabled {
    opacity: 0.6;
  }
}

.coupon-left {
  width: 200rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -20rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 40rpx;
    height: 40rpx;
    background: #F5F5F5;
    border-radius: 50%;
  }
}

.coupon-value {
  font-size: 56rpx;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1;
}

.coupon-unit {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.coupon-condition {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 12rpx;
}

.coupon-right {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

.coupon-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.coupon-date {
  font-size: 24rpx;
  color: #999999;
  margin-top: 12rpx;
}

.coupon-status {
  align-self: flex-end;
  margin-top: auto;
  padding: 12rpx 24rpx;
  background: rgba(255, 107, 157, 0.1);
  border-radius: 20rpx;
  
  text {
    font-size: 24rpx;
    color: #FF6B9D;
  }
  
  &.used {
    background: #F5F5F5;
    
    text {
      color: #999999;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
  margin-top: 20rpx;
}
</style>
