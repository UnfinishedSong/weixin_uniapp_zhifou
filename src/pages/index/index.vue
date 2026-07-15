<template>
  <view class="page">
    <view class="header" :style="{ background: headerGradient }">
      <view class="header-content">
        <view class="logo">
          <text class="logo-icon">🌸</text>
          <text class="logo-text">知否花店</text>
        </view>
        <view class="search-box" @click="goSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索鲜花、礼品...</text>
        </view>
      </view>
    </view>

    <view v-if="currentHoliday" class="holiday-banner" :style="{ background: holidayGradient }">
      <view class="holiday-content">
        <view class="holiday-info">
          <text class="holiday-icon">{{ holidayIcon }}</text>
          <view class="holiday-text">
            <text class="holiday-name">{{ currentHoliday.name }}</text>
            <text class="holiday-desc">{{ currentHoliday.description }}</text>
          </view>
        </view>
        <view class="holiday-btn" @click="goHolidayProducts">
          <text>立即选购</text>
        </view>
      </view>
    </view>

    <view class="swiper-container">
      <swiper 
        class="swiper" 
        indicator-dots 
        autoplay 
        interval="3000" 
        duration="500"
        circular
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#FFFFFF"
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image class="banner-image" :src="banner.image" mode="aspectFill" />
          <view class="banner-overlay">
            <text class="banner-title">{{ banner.title }}</text>
            <text class="banner-subtitle">{{ banner.subtitle }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="category-section">
      <view class="section-title">
        <text class="title-text">鲜花分类</text>
      </view>
      <scroll-view class="category-scroll" scroll-x>
        <view class="category-list">
          <view 
            v-for="category in categories" 
            :key="category.id"
            class="category-item"
            @click="goCategory(category.id)"
          >
            <view class="category-icon">{{ category.icon }}</view>
            <text class="category-name">{{ category.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="product-section">
      <view class="section-header">
        <view class="section-title">
          <text class="title-icon">🔥</text>
          <text class="title-text">热销商品</text>
        </view>
        <view class="section-more" @click="goMore('hot')">
          <text>查看更多</text>
          <text class="more-icon">→</text>
        </view>
      </view>
      <view class="product-grid">
        <view 
          v-for="product in hotProducts" 
          :key="product.id"
          class="product-card"
          @click="goDetail(product.id)"
        >
          <image class="product-image" :src="product.images[0]" mode="aspectFill" />
          <view class="product-tags">
            <text v-if="product.isHot" class="tag hot">热销</text>
            <text v-if="product.isNew" class="tag new">新品</text>
          </view>
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-desc line-clamp-1">{{ product.description }}</text>
            <view class="product-price-row">
              <text class="product-price">{{ product.price }}</text>
              <text v-if="product.originalPrice" class="product-original-price">{{ product.originalPrice }}</text>
            </view>
            <text class="product-sales">已售 {{ product.sales }}</text>
          </view>
          <view class="add-cart-btn" @click.stop="addCart(product)">
            <text>+</text>
          </view>
        </view>
      </view>
    </view>

    <view class="product-section">
      <view class="section-header">
        <view class="section-title">
          <text class="title-icon">✨</text>
          <text class="title-text">新品推荐</text>
        </view>
        <view class="section-more" @click="goMore('new')">
          <text>查看更多</text>
          <text class="more-icon">→</text>
        </view>
      </view>
      <view class="product-grid">
        <view 
          v-for="product in newProducts" 
          :key="product.id"
          class="product-card"
          @click="goDetail(product.id)"
        >
          <image class="product-image" :src="product.images[0]" mode="aspectFill" />
          <view class="product-tags">
            <text v-if="product.isHot" class="tag hot">热销</text>
            <text v-if="product.isNew" class="tag new">新品</text>
          </view>
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-desc line-clamp-1">{{ product.description }}</text>
            <view class="product-price-row">
              <text class="product-price">{{ product.price }}</text>
              <text v-if="product.originalPrice" class="product-original-price">{{ product.originalPrice }}</text>
            </view>
            <text class="product-sales">已售 {{ product.sales }}</text>
          </view>
          <view class="add-cart-btn" @click.stop="addCart(product)">
            <text>+</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { categories, getHotProducts, getNewProducts } from '@/data/products'
import { getCurrentHoliday, holidays } from '@/data/holidays'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/data/products'

const cartStore = useCartStore()

const currentHoliday = ref<typeof holidays[0] | null>(null)
const hotProducts = ref<Product[]>([])
const newProducts = ref<Product[]>([])

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

const holidayIcons: Record<string, string> = {
  '情人节': '❤️',
  '妇女节': '💐',
  '母亲节': '👩',
  '父亲节': '👨',
  '高考': '📚',
  '教师节': '✏️',
  '中秋节': '🌕',
  '国庆节': '🇨🇳',
  '圣诞节': '🎄'
}

const holidayIcon = computed(() => {
  return currentHoliday.value ? holidayIcons[currentHoliday.value.name] || '🌸' : '🌸'
})

const headerGradient = computed(() => {
  if (currentHoliday.value) {
    return `linear-gradient(135deg, ${currentHoliday.value.themeColor} 0%, ${adjustColor(currentHoliday.value.themeColor, 30)} 100%)`
  }
  return 'linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%)'
})

const holidayGradient = computed(() => {
  if (currentHoliday.value) {
    return `linear-gradient(90deg, ${currentHoliday.value.themeColor} 0%, ${adjustColor(currentHoliday.value.themeColor, 20)} 100%)`
  }
  return ''
})

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount)
  const b = Math.min(255, (num & 0x0000FF) + amount)
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/order/order' })
}

const goHolidayProducts = () => {
  uni.navigateTo({ url: '/pages/order/order' })
}

const goCategory = (categoryId: number) => {
  uni.navigateTo({ url: `/pages/order/order?category=${categoryId}` })
}

const goMore = (type: string) => {
  uni.navigateTo({ url: `/pages/order/order?type=${type}` })
}

const goDetail = (productId: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${productId}` })
}

const addCart = (product: Product) => {
  cartStore.addItem(product, 1)
}

onMounted(() => {
  currentHoliday.value = getCurrentHoliday()
  hotProducts.value = getHotProducts()
  newProducts.value = getNewProducts()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.header {
  padding: 60rpx 30rpx 30rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.logo-icon {
  font-size: 44rpx;
}

.logo-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.search-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.search-icon {
  font-size: 32rpx;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999999;
}

.holiday-banner {
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
  overflow: hidden;
}

.holiday-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.holiday-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.holiday-icon {
  font-size: 48rpx;
}

.holiday-text {
  display: flex;
  flex-direction: column;
}

.holiday-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.holiday-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4rpx;
}

.holiday-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 30rpx;
  padding: 16rpx 32rpx;
  
  text {
    font-size: 26rpx;
    color: #FFFFFF;
  }
}

.swiper-container {
  margin: 0 20rpx;
}

.swiper {
  height: 300rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}

.banner-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.banner-subtitle {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8rpx;
}

.category-section {
  margin-top: 30rpx;
  padding: 0 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  gap: 30rpx;
  padding: 10rpx 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.category-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.category-name {
  font-size: 24rpx;
  color: #666666;
}

.product-section {
  margin-top: 30rpx;
  padding: 0 20rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.title-icon {
  font-size: 28rpx;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  text {
    font-size: 26rpx;
    color: #999999;
  }
  
  .more-icon {
    font-size: 24rpx;
  }
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.product-card {
  width: calc(50% - 8rpx);
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.product-image {
  width: 100%;
  height: 280rpx;
}

.product-tags {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  display: flex;
  gap: 8rpx;
}

.tag {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  
  &.hot {
    background: rgba(255, 77, 79, 0.9);
    color: #FFFFFF;
  }
  
  &.new {
    background: rgba(82, 196, 26, 0.9);
    color: #FFFFFF;
  }
}

.product-info {
  padding: 16rpx;
}

.product-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  display: block;
}

.product-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-top: 12rpx;
}

.product-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 24rpx;
  }
}

.product-original-price {
  font-size: 24rpx;
  color: #CCCCCC;
  text-decoration: line-through;
  
  &::before {
    content: '¥';
  }
}

.product-sales {
  font-size: 22rpx;
  color: #CCCCCC;
  display: block;
  margin-top: 8rpx;
}

.add-cart-btn {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 36rpx;
    color: #FFFFFF;
    font-weight: 300;
    line-height: 1;
  }
}

.bottom-space {
  height: 130rpx;
}
</style>
