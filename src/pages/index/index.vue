<template>
  <view class="page">
    <view class="swiper-wrapper">
      <swiper 
        class="swiper" 
        indicator-dots 
        autoplay 
        interval="4500" 
        duration="800"
        circular
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#FFFFFF"
        indicator-dots-style="width: 16rpx; height: 16rpx; border-radius: 50%; margin-right: 16rpx;"
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image class="banner-image" :src="banner.image" mode="aspectFill" />
          <view class="banner-overlay">
            <text class="banner-title">{{ banner.title }}</text>
            <text class="banner-subtitle">{{ banner.subtitle }}</text>
          </view>
        </swiper-item>
      </swiper>
      
      <view class="header-overlay">
        <view class="logo">
          <text class="logo-icon">🌸</text>
          <text class="logo-text">知否花店</text>
        </view>
      </view>
    </view>
    
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

const banners = ref([
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20flower%20shop%20banner%20pink%20romantic%20floral%20arrangement&image_size=landscape_16_9',
    title: '七夕特惠',
    subtitle: '全场鲜花8折起'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20rose%20bouquet%20luxury%20flower%20gift&image_size=landscape_16_9',
    title: '新品上市',
    subtitle: '卡布奇诺玫瑰'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=birthday%20flowers%20celebration%20colorful%20bouquet&image_size=landscape_16_9',
    title: '生日花礼',
    subtitle: '定制专属祝福'
  }
])
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow: hidden;
}

.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

.swiper {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  bottom: 150rpx;
  left: 0;
  right: 0;
  padding: 40rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.banner-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  display: block;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 12rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 60rpx 30rpx 30rpx;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.logo-icon {
  font-size: 56rpx;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.2));
}

.logo-text {
  font-size: 44rpx;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}
</style>
