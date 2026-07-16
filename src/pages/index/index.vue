<template>
  <view class="page">
    <view class="bg-slider">
      <view 
        v-for="(bg, index) in bgImages" 
        :key="index"
        class="bg-item"
        :class="{ active: currentBgIndex === index }"
      >
        <image class="bg-image" :src="bg.image" mode="aspectFill" />
        <view class="bg-overlay"></view>
      </view>
    </view>

    <view class="content-wrapper">
      <view class="header-section">
        <view class="user-card">
          <view class="user-avatar">
            <text>👤</text>
          </view>
          <view class="user-info">
            <view class="user-name-wrap">
              <text class="user-name">{{ userStore.userInfo.nickname }}</text>
              <view class="member-tag">{{ userStore.memberInfo.levelName }}</view>
            </view>
            <text class="user-id">ID: {{ userStore.userInfo.id }}</text>
          </view>
          <view class="edit-btn">
            <text>编辑资料</text>
          </view>
        </view>
      </view>

      <view class="quick-actions">
        <view class="action-card" @click="goPickup">
          <view class="action-icon">🏪</view>
          <text class="action-name">门店自取</text>
          <text class="action-sub">凭码取花</text>
        </view>
        <view class="action-card" @click="goDelivery">
          <view class="action-icon">🚀</view>
          <text class="action-name">鲜花配送</text>
          <text class="action-sub">全城送达</text>
        </view>
        <view class="action-card" @click="goCustom">
          <view class="action-icon">🎨</view>
          <text class="action-name">私人定制</text>
          <text class="action-sub">专属设计</text>
        </view>
      </view>

      <view class="secondary-actions">
        <view class="secondary-item" @click="goGroupBuy">
          <view class="secondary-icon">💐</view>
          <text class="secondary-name">团购鲜花</text>
        </view>
        <view class="secondary-item" @click="goOrders">
          <view class="secondary-icon">📦</view>
          <text class="secondary-name">我的订单</text>
        </view>
        <view class="secondary-item" @click="goCoupon">
          <view class="secondary-icon">🎫</view>
          <text class="secondary-name">优惠券</text>
        </view>
      </view>

      <view class="promo-card">
        <view class="promo-left">
          <text class="promo-icon">🌸</text>
          <view class="promo-info">
            <text class="promo-title">今日特惠</text>
            <text class="promo-desc">限时抢购，低至5折</text>
          </view>
        </view>
        <view class="promo-btn" @click="goPromo">
          <text>去领花</text>
        </view>
      </view>

      <view class="bottom-space"></view>
    </view>

    <view class="bg-indicators">
      <view 
        v-for="(_, index) in bgImages" 
        :key="index"
        class="indicator-dot"
        :class="{ active: currentBgIndex === index }"
      ></view>
    </view>
    
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const bgImages = ref([
  { image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20pink%20rose%20floral%20arrangement%20soft%20light%20romantic%20background&image_size=landscape_16_9' },
  { image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20white%20lily%20flowers%20fresh%20garden%20morning%20light%20dreamy&image_size=landscape_16_9' },
  { image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20sunflower%20field%20warm%20sunset%20golden%20hour%20cheerful&image_size=landscape_16_9' }
])

const currentBgIndex = ref(0)
let bgTimer: ReturnType<typeof setInterval> | null = null

const startBgTimer = () => {
  bgTimer = setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % bgImages.value.length
  }, 5000)
}

const goPickup = () => {
  uni.navigateTo({ url: '/pages/order/order?deliveryType=pickup' })
}

const goDelivery = () => {
  uni.navigateTo({ url: '/pages/order/order?deliveryType=delivery' })
}

const goCustom = () => {
  uni.showModal({
    title: '🌸 私人定制服务',
    content: '想要独一无二的花束吗？\n花艺师小姐姐随时在线哦~ \n\n📞 定制热线：138-8888-8888\n💬 微信同号，欢迎骚扰~',
    showCancel: false,
    confirmText: '记下啦',
    confirmColor: '#FF6B9D',
    success: () => {
      uni.setClipboardData({
        data: '13888888888',
        success: () => {
          uni.showToast({ title: '号码已复制', icon: 'success' })
        }
      })
    }
  })
}

const goGroupBuy = () => {
  uni.showToast({ title: '团购功能开发中', icon: 'none' })
}

const goOrders = () => {
  uni.navigateTo({ url: '/pages/orders/list' })
}

const goCoupon = () => {
  uni.navigateTo({ url: '/pages/coupon/coupon' })
}

const goPromo = () => {
  uni.navigateTo({ url: '/pages/order/order' })
}

onMounted(() => {
  startBgTimer()
})

onUnmounted(() => {
  if (bgTimer) {
    clearInterval(bgTimer)
  }
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
}

.bg-slider {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-item {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  
  &.active {
    opacity: 1;
  }
}

.bg-image {
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 107, 157, 0.4) 0%, rgba(255, 107, 157, 0.2) 50%, rgba(0, 0, 0, 0.3) 100%);
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 60rpx 30rpx 30rpx;
}

.header-section {
  margin-bottom: 40rpx;
}

.user-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 157, 0.2);
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #FFB6C8 0%, #FF6B9D 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  
  text {
    font-size: 52rpx;
  }
}

.user-info {
  flex: 1;
}

.user-name-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.user-name {
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
}

.member-tag {
  font-size: 22rpx;
  color: #FF6B9D;
  background: rgba(255, 107, 157, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.user-id {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.edit-btn {
  background: rgba(255, 107, 157, 0.1);
  border-radius: 20rpx;
  padding: 14rpx 28rpx;
  
  text {
    font-size: 26rpx;
    color: #FF6B9D;
  }
}

.quick-actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 157, 0.15);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.action-icon {
  font-size: 56rpx;
}

.action-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
}

.action-sub {
  font-size: 22rpx;
  color: #999999;
}

.secondary-actions {
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.secondary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  
  &:not(:last-child) {
    border-right: 1rpx solid #F5F5F5;
  }
}

.secondary-icon {
  font-size: 40rpx;
}

.secondary-name {
  font-size: 26rpx;
  color: #666666;
}

.promo-card {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 24rpx;
  padding: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 157, 0.3);
}

.promo-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.promo-icon {
  font-size: 48rpx;
}

.promo-info {
  display: flex;
  flex-direction: column;
}

.promo-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.promo-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4rpx;
}

.promo-btn {
  background: #FFFFFF;
  border-radius: 30rpx;
  padding: 16rpx 36rpx;
  
  text {
    font-size: 28rpx;
    font-weight: 500;
    color: #FF6B9D;
  }
}

.bg-indicators {
  position: fixed;
  bottom: 150rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12rpx;
  z-index: 10;
}

.indicator-dot {
  width: 12rpx;
  height: 12rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &.active {
    width: 32rpx;
    border-radius: 6rpx;
    background: #FFFFFF;
  }
}

.bottom-space {
  height: 130rpx;
}
</style>