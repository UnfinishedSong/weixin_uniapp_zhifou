<template>
  <view class="page">
    <view class="address-section" @click="goAddress">
      <view v-if="selectedAddress" class="address-info">
        <view class="address-header">
          <text class="address-name">{{ selectedAddress.name }}</text>
          <text class="address-phone">{{ selectedAddress.phone }}</text>
        </view>
        <text class="address-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
      </view>
      <view v-else class="address-empty">
        <text class="empty-icon">📍</text>
        <text class="empty-text">请选择收货地址</text>
      </view>
      <text class="address-arrow">→</text>
    </view>

    <view class="items-section">
      <view class="section-title">商品清单</view>
      <view class="items-list">
        <view 
          v-for="item in cartStore.items" 
          :key="item.id"
          class="item-row"
        >
          <image class="item-image" :src="item.product.images[0]" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name">{{ item.product.name }}</text>
            <text v-if="item.spec" class="item-spec">{{ item.spec }}</text>
            <view class="item-footer">
              <text class="item-price">{{ item.product.price }}</text>
              <text class="item-qty">×{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="coupon-section" @click="goCoupon">
      <view class="coupon-left">
        <text class="coupon-icon">🎫</text>
        <text class="coupon-label">优惠券</text>
      </view>
      <view class="coupon-right">
        <text v-if="selectedCoupon" class="coupon-value">-¥{{ selectedCoupon.value }}</text>
        <text v-else-if="availableCoupons.length > 0" class="coupon-count">{{ availableCoupons.length }}张可用</text>
        <text v-else class="coupon-none">暂无可用</text>
        <text class="coupon-arrow">→</text>
      </view>
    </view>

    <view class="remark-section">
      <text class="remark-label">订单备注</text>
      <input 
        class="remark-input" 
        v-model="remark" 
        placeholder="选填，可填写您的特殊要求"
      />
    </view>

    <view class="summary-section">
      <view class="summary-row">
        <text class="summary-label">商品金额</text>
        <text class="summary-value">{{ cartStore.totalPrice }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">运费</text>
        <text class="summary-value">0.00</text>
      </view>
      <view v-if="selectedCoupon" class="summary-row discount">
        <text class="summary-label">优惠券</text>
        <text class="summary-value">-{{ selectedCoupon.value }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">会员折扣</text>
        <text class="summary-value">{{ discountText }}</text>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-label">实付:</text>
        <text class="total-price">{{ finalPrice }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">
        <text>提交订单</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import type { Address } from '@/stores/order'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const selectedAddress = ref<Address | null>(orderStore.getDefaultAddress() || null)
const selectedCoupon = ref(orderStore.coupons.find(c => !c.used && cartStore.totalPrice >= c.minAmount) || null)
const remark = ref('')

const availableCoupons = computed(() => {
  return orderStore.coupons.filter(c => !c.used && cartStore.totalPrice >= c.minAmount)
})

const discountText = computed(() => {
  const discount = userStore.discount
  if (discount === 1) return '无折扣'
  return `-${((1 - discount) * 100).toFixed(0)}%`
})

const finalPrice = computed(() => {
  let price = cartStore.totalPrice * userStore.discount
  if (selectedCoupon.value) {
    price -= selectedCoupon.value.value
  }
  return Math.max(0, price)
})

const goAddress = () => {
  uni.navigateTo({ url: '/pages/address/list' })
}

const goCoupon = () => {
  uni.navigateTo({ url: '/pages/coupon/coupon' })
}

const submitOrder = () => {
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  
  if (cartStore.isEmpty) {
    uni.showToast({ title: '购物车为空', icon: 'none' })
    return
  }
  
  const order = orderStore.createOrder(
    cartStore.items,
    selectedAddress.value.id,
    remark.value,
    selectedCoupon.value?.id
  )
  
  if (order) {
    uni.showModal({
      title: '订单提交成功',
      content: `订单号: ${order.orderNo}\n实付金额: ¥${order.payAmount}`,
      showCancel: false,
      success: () => {
        cartStore.clearCart()
        uni.redirectTo({ url: '/pages/orders/list' })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 160rpx;
}

.address-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.address-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.address-phone {
  font-size: 28rpx;
  color: #666666;
}

.address-detail {
  font-size: 26rpx;
  color: #999999;
  margin-top: 12rpx;
  display: block;
}

.address-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 48rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
  margin-top: 8rpx;
}

.address-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

.items-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.item-row {
  display: flex;
  gap: 16rpx;
}

.item-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.item-spec {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.item-price {
  font-size: 28rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 22rpx;
  }
}

.item-qty {
  font-size: 26rpx;
  color: #999999;
}

.coupon-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coupon-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.coupon-icon {
  font-size: 32rpx;
}

.coupon-label {
  font-size: 28rpx;
  color: #333333;
}

.coupon-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.coupon-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #FF6B9D;
}

.coupon-count {
  font-size: 28rpx;
  color: #FF6B9D;
}

.coupon-none {
  font-size: 28rpx;
  color: #999999;
}

.coupon-arrow {
  font-size: 28rpx;
  color: #CCCCCC;
}

.remark-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.remark-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.remark-input {
  width: 100%;
  font-size: 28rpx;
  color: #333333;
}

.summary-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0;
  
  &.discount {
    .summary-value {
      color: #FF6B9D;
    }
  }
}

.summary-label {
  font-size: 28rpx;
  color: #666666;
}

.summary-value {
  font-size: 28rpx;
  color: #333333;
  
  &::before {
    content: '¥';
    font-size: 22rpx;
  }
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
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.total-info {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.total-label {
  font-size: 28rpx;
  color: #666666;
}

.total-price {
  font-size: 40rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 28rpx;
  }
}

.submit-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 40rpx;
  padding: 28rpx 80rpx;
  
  text {
    font-size: 32rpx;
    font-weight: 500;
    color: #FFFFFF;
  }
}
</style>
