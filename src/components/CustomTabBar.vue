<template>
  <view class="custom-tabbar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="switchTab(index)"
    >
      <view class="tab-icon">
        <text v-if="index === 0" class="icon-text">🏠</text>
        <text v-else-if="index === 1" class="icon-text">🛒</text>
        <text v-else class="icon-text">👤</text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
      <view v-if="index === 1 && cartCount > 0" class="badge">{{ cartCount > 99 ? '99+' : cartCount }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const tabList = [
  { pagePath: '/pages/index/index', text: '首页' },
  { pagePath: '/pages/order/order', text: '点单' },
  { pagePath: '/pages/mine/mine', text: '我的' }
]

const cartStore = useCartStore()
const currentIndex = ref(0)

const cartCount = computed(() => cartStore.totalCount)

const getCurrentPageIndex = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const route = '/' + currentPage.route
  const index = tabList.findIndex(item => item.pagePath === route)
  return index >= 0 ? index : 0
}

const switchTab = (index: number) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({
    url: tabList[index].pagePath
  })
}

onMounted(() => {
  currentIndex.value = getCurrentPageIndex()
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
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
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
  transition: all 0.3s ease;

  &.active {
    .tab-icon {
      transform: scale(1.1);
    }
    .tab-text {
      color: #FF6B9D;
    }
  }
}

.tab-icon {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6rpx;
  transition: transform 0.3s ease;
}

.icon-text {
  font-size: 44rpx;
}

.tab-text {
  font-size: 22rpx;
  color: #999999;
  transition: color 0.3s ease;
}

.badge {
  position: absolute;
  top: -8rpx;
  right: 50%;
  transform: translateX(20rpx);
  min-width: 32rpx;
  height: 32rpx;
  background: #FF4D4F;
  color: #FFFFFF;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}
</style>
