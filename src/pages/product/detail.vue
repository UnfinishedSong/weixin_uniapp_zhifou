<template>
  <view class="page">
    <swiper 
      class="product-swiper" 
      indicator-dots 
      autoplay 
      circular
      indicator-color="rgba(255,255,255,0.5)"
      indicator-active-color="#FFFFFF"
    >
      <swiper-item v-for="(image, index) in product?.images || []" :key="index">
        <image :src="image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="product-info">
      <view class="product-header">
        <text class="product-name">{{ product?.name }}</text>
        <view class="product-tags">
          <text v-if="product?.isHot" class="tag hot">热销</text>
          <text v-if="product?.isNew" class="tag new">新品</text>
        </view>
      </view>
      
      <view class="price-row">
        <text class="current-price">{{ product?.price }}</text>
        <text v-if="product?.originalPrice" class="original-price">{{ product?.originalPrice }}</text>
        <text v-if="product?.originalPrice" class="discount-tag">省{{ (product?.originalPrice || 0) - (product?.price || 0) }}元</text>
      </view>
      
      <text class="product-desc">{{ product?.description }}</text>
      
      <view class="sales-info">
        <text>已售{{ product?.sales }}件</text>
        <text>库存{{ product?.stock }}件</text>
      </view>
    </view>

    <view class="spec-section">
      <view class="section-title">规格选择</view>
      <view class="spec-list">
        <view 
          v-for="(spec, index) in product?.specs || []" 
          :key="index"
          class="spec-item"
          :class="{ active: selectedSpec === spec }"
          @click="selectSpec(spec)"
        >
          <text>{{ spec }}</text>
        </view>
      </view>
    </view>

    <view class="quantity-section">
      <view class="section-title">购买数量</view>
      <view class="quantity-control">
        <view class="qty-btn" @click="decreaseQty">
          <text>-</text>
        </view>
        <text class="qty-num">{{ quantity }}</text>
        <view class="qty-btn plus" @click="increaseQty">
          <text>+</text>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="action-item" @click="goHome">
        <text class="action-icon">🏠</text>
        <text class="action-text">首页</text>
      </view>
      <view class="action-item" @click="goCart">
        <text class="action-icon">🛒</text>
        <text class="action-text">购物车</text>
        <view v-if="cartStore.totalCount > 0" class="cart-badge">{{ cartStore.totalCount }}</view>
      </view>
      <view class="add-cart-btn" @click="addToCart">
        <text>加入购物车</text>
      </view>
      <view class="buy-now-btn" @click="buyNow">
        <text>立即购买</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getProductById, type Product } from '@/data/products'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const product = ref<Product | null>(null)
const selectedSpec = ref('')
const quantity = ref(1)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as { options?: { id?: string } }
  const id = parseInt(currentPage.options?.id || '1')
  product.value = getProductById(id) || null
  
  if (product.value?.specs?.length) {
    selectedSpec.value = product.value.specs[0]
  }
})

const selectSpec = (spec: string) => {
  selectedSpec.value = spec
}

const increaseQty = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value, selectedSpec.value)
  }
}

const buyNow = () => {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value, selectedSpec.value)
    uni.navigateTo({ url: '/pages/checkout/checkout' })
  }
}

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const goCart = () => {
  uni.switchTab({ url: '/pages/cart/cart' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 140rpx;
}

.product-swiper {
  width: 100%;
  height: 750rpx;
}

.product-swiper image {
  width: 100%;
  height: 100%;
}

.product-info {
  padding: 30rpx;
}

.product-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.product-name {
  flex: 1;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
}

.product-tags {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  
  &.hot {
    background: rgba(255, 77, 79, 0.1);
    color: #FF4D4F;
  }
  
  &.new {
    background: rgba(82, 196, 26, 0.1);
    color: #52C41A;
  }
}

.price-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 20rpx;
}

.current-price {
  font-size: 48rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 32rpx;
  }
}

.original-price {
  font-size: 28rpx;
  color: #CCCCCC;
  text-decoration: line-through;
  
  &::before {
    content: '¥';
  }
}

.discount-tag {
  font-size: 24rpx;
  color: #FF6B9D;
  background: rgba(255, 107, 157, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.product-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-top: 20rpx;
}

.sales-info {
  display: flex;
  gap: 30rpx;
  margin-top: 20rpx;
  
  text {
    font-size: 24rpx;
    color: #999999;
  }
}

.spec-section {
  padding: 30rpx;
  background: #F9F9F9;
}

.section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.spec-item {
  padding: 16rpx 32rpx;
  border: 2rpx solid #DDDDDD;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  text {
    font-size: 28rpx;
    color: #666666;
  }
  
  &.active {
    border-color: #FF6B9D;
    background: rgba(255, 107, 157, 0.05);
    
    text {
      color: #FF6B9D;
    }
  }
}

.quantity-section {
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 30rpx;
}

.qty-btn {
  width: 64rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 36rpx;
    color: #666666;
    line-height: 1;
  }
  
  &.plus {
    background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
    border-radius: 30rpx;
    
    text {
      color: #FFFFFF;
    }
  }
}

.qty-num {
  width: 80rpx;
  text-align: center;
  font-size: 32rpx;
  color: #333333;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.action-icon {
  font-size: 40rpx;
}

.action-text {
  font-size: 22rpx;
  color: #999999;
  margin-top: 4rpx;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 28rpx;
  height: 28rpx;
  background: #FF4D4F;
  color: #FFFFFF;
  font-size: 18rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

.add-cart-btn {
  flex: 1;
  background: #FFD700;
  border-radius: 40rpx;
  padding: 24rpx;
  text-align: center;
  
  text {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
  }
}

.buy-now-btn {
  flex: 1;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 40rpx;
  padding: 24rpx;
  text-align: center;
  
  text {
    font-size: 30rpx;
    font-weight: 500;
    color: #FFFFFF;
  }
}
</style>
