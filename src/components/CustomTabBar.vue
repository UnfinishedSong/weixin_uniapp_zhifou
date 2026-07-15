<template>
  <view class="custom-tabbar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="handleClick(index)"
    >
      <view class="tab-icon-wrap">
        <text v-if="index === 0" class="icon-text">{{ currentIndex === 0 ? '🏠' : '🏠' }}</text>
        <text v-else-if="index === 1" class="icon-text">{{ currentIndex === 1 ? '🛒' : '🛒' }}</text>
        <text v-else class="icon-text">{{ currentIndex === 2 ? '👤' : '👤' }}</text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
      <view v-if="index === 1 && localCartCount > 0" class="badge">{{ localCartCount > 99 ? '99+' : localCartCount }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCartStore } from '@/stores/cart'

const tabList = [
  { pagePath: '/pages/index/index', text: '首页' },
  { pagePath: '/pages/order/order', text: '点单' },
  { pagePath: '/pages/mine/mine', text: '我的' }
]

const cartStore = useCartStore()
const currentIndex = ref(0)
const localCartCount = ref(0)
let updateTimer: ReturnType<typeof setTimeout> | null = null

const updateCurrentIndex = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const route = '/' + currentPage.route
  const index = tabList.findIndex(item => item.pagePath === route)
  if (index >= 0 && index !== currentIndex.value) {
    currentIndex.value = index
  }
}

const updateCartCount = () => {
  if (updateTimer) return
  updateTimer = setTimeout(() => {
    localCartCount.value = cartStore.totalCount
    updateTimer = null
  }, 50)
}

const handleClick = (index: number) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({
    url: tabList[index].pagePath,
    success: () => {
      updateCurrentIndex()
    }
  })
}

watch(() => cartStore.totalCount, () => {
  updateCartCount()
})

onMounted(() => {
  updateCurrentIndex()
  localCartCount.value = cartStore.totalCount
})

onUnmounted(() => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
})
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4rpx 20rpx rgba(255, 107, 157, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10rpx 0;
  border-radius: 16rpx;
  transition: all 0.2s ease;

  &.active {
    background: rgba(255, 107, 157, 0.08);
    
    .tab-icon-wrap {
      transform: scale(1.15);
    }
    
    .tab-text {
      color: #FF4D6D;
      font-weight: 600;
    }
    
    .icon-text {
      filter: drop-shadow(0 2rpx 4rpx rgba(255, 77, 109, 0.3));
    }
  }
}

.tab-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6rpx;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-text {
  font-size: 48rpx;
  transition: filter 0.2s ease;
}

.tab-text {
  font-size: 24rpx;
  color: #999999;
  transition: color 0.2s ease;
}

.badge {
  position: absolute;
  top: -4rpx;
  right: calc(50% - 40rpx);
  min-width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #FF4D6D 0%, #FF758F 100%);
  color: #FFFFFF;
  font-size: 20rpx;
  font-weight: 600;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 109, 0.4);
}
</style>
