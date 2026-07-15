<template>
  <view class="page">
    <view class="user-header" :style="{ background: headerGradient }">
      <view class="user-info">
        <view class="avatar">
          <text>👤</text>
        </view>
        <view class="user-detail">
          <text class="user-name">{{ userStore.userInfo.nickname }}</text>
          <view class="member-tag">{{ userStore.memberInfo.levelName }}</view>
        </view>
      </view>
      <view class="edit-btn" @click="goEditProfile">
        <text>编辑资料</text>
      </view>
    </view>

    <view class="stats-card">
      <view class="stat-item" @click="goOrders">
        <text class="stat-value">{{ orderStore.orders.length }}</text>
        <text class="stat-label">全部订单</text>
      </view>
      <view class="stat-item" @click="goOrders('pending')">
        <text class="stat-value">{{ pendingCount }}</text>
        <text class="stat-label">待付款</text>
      </view>
      <view class="stat-item" @click="goOrders('shipped')">
        <text class="stat-value">{{ shippedCount }}</text>
        <text class="stat-label">待收货</text>
      </view>
      <view class="stat-item" @click="goCoupon">
        <text class="stat-value">{{ couponCount }}</text>
        <text class="stat-label">优惠券</text>
      </view>
    </view>

    <view class="order-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <view class="section-more" @click="goOrders">
          <text>全部订单</text>
          <text class="more-icon">→</text>
        </view>
      </view>
      
      <view v-if="recentOrders.length > 0" class="order-list">
        <view 
          v-for="order in recentOrders" 
          :key="order.id"
          class="order-item"
          @click="goOrderDetail(order.id)"
        >
          <view class="order-header">
            <text class="order-no">{{ order.orderNo }}</text>
            <text class="order-status" :class="order.status">{{ statusText[order.status] }}</text>
          </view>
          <view class="order-items">
            <view 
              v-for="item in order.items.slice(0, 3)" 
              :key="item.id"
              class="order-product"
            >
              <image :src="item.image" mode="aspectFill" />
            </view>
            <view v-if="order.items.length > 3" class="more-products">
              <text>+{{ order.items.length - 3 }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-total">共{{ totalQty(order) }}件 实付<text class="total-price">{{ order.payAmount }}</text></text>
            <view v-if="order.status === 'pending'" class="order-actions">
              <view class="action-btn" @click.stop="cancelOrder(order.id)">取消</view>
              <view class="action-btn primary" @click.stop="payOrder(order.id)">付款</view>
            </view>
            <view v-else-if="order.status === 'shipped'" class="order-actions">
              <view class="action-btn primary" @click.stop="confirmOrder(order.id)">确认收货</view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-order">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无订单</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goAddress">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="goCoupon">
        <text class="menu-icon">🎫</text>
        <text class="menu-text">优惠券</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="goFavorites">
        <text class="menu-icon">❤️</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="goHistory">
        <text class="menu-icon">📖</text>
        <text class="menu-text">浏览记录</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="goHelp">
        <text class="menu-icon">❓</text>
        <text class="menu-text">帮助中心</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="goSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import type { Order } from '@/stores/order'

const userStore = useUserStore()
const orderStore = useOrderStore()

const levelColors = ['#999999', '#C0C0C0', '#FFD700', '#FF6B9D']

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

const statusText: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消'
}

const pendingCount = computed(() => orderStore.orders.filter(o => o.status === 'pending').length)
const shippedCount = computed(() => orderStore.orders.filter(o => o.status === 'shipped').length)
const couponCount = computed(() => orderStore.coupons.filter(c => !c.used).length)

const recentOrders = computed(() => orderStore.orders.slice(0, 3))

const totalQty = (order: Order) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const goEditProfile = () => {
  uni.showToast({ title: '编辑资料功能开发中', icon: 'none' })
}

const goOrders = (status?: string) => {
  const url = status ? `/pages/orders/list?status=${status}` : '/pages/orders/list'
  uni.navigateTo({ url })
}

const goOrderDetail = (orderId: number) => {
  uni.showToast({ title: '订单详情功能开发中', icon: 'none' })
}

const goAddress = () => {
  uni.navigateTo({ url: '/pages/address/list' })
}

const goCoupon = () => {
  uni.navigateTo({ url: '/pages/coupon/coupon' })
}

const goFavorites = () => {
  uni.showToast({ title: '收藏功能开发中', icon: 'none' })
}

const goHistory = () => {
  uni.showToast({ title: '浏览记录功能开发中', icon: 'none' })
}

const goHelp = () => {
  uni.showToast({ title: '帮助中心功能开发中', icon: 'none' })
}

const goSettings = () => {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

const payOrder = (orderId: number) => {
  orderStore.payOrder(orderId)
}

const cancelOrder = (orderId: number) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个订单吗？',
    success: (res) => {
      if (res.confirm) {
        orderStore.cancelOrder(orderId)
      }
    }
  })
}

const confirmOrder = (orderId: number) => {
  uni.showModal({
    title: '确认收货',
    content: '确定已收到商品吗？',
    success: (res) => {
      if (res.confirm) {
        orderStore.confirmOrder(orderId)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 130rpx;
}

.user-header {
  padding: 60rpx 30rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 60rpx;
  }
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.member-tag {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
  margin-top: 12rpx;
  width: fit-content;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 16rpx 32rpx;
  
  text {
    font-size: 26rpx;
    color: #FFFFFF;
  }
}

.stats-card {
  background: #FFFFFF;
  margin: -20rpx 20rpx 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #333333;
}

.stat-label {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.order-section {
  background: #FFFFFF;
  margin: 0 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
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

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-item {
  border: 1rpx solid #EEEEEE;
  border-radius: 16rpx;
  padding: 20rpx;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.order-no {
  font-size: 26rpx;
  color: #999999;
}

.order-status {
  font-size: 26rpx;
  font-weight: 500;
  
  &.pending { color: #FF6B9D; }
  &.paid { color: #3498DB; }
  &.shipped { color: #F39C12; }
  &.completed { color: #52C41A; }
  &.cancelled { color: #999999; }
}

.order-items {
  display: flex;
  gap: 12rpx;
}

.order-product {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  overflow: hidden;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.more-products {
  width: 100rpx;
  height: 100rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 24rpx;
    color: #999999;
  }
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.order-total {
  font-size: 26rpx;
  color: #666666;
}

.total-price {
  font-size: 30rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 24rpx;
  }
}

.order-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  border: 1rpx solid #DDDDDD;
  border-radius: 20rpx;
  
  text {
    font-size: 24rpx;
    color: #666666;
  }
  
  &.primary {
    background: #FF6B9D;
    border-color: #FF6B9D;
    
    text {
      color: #FFFFFF;
    }
  }
}

.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.empty-icon {
  font-size: 60rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
  margin-top: 16rpx;
}

.menu-section {
  background: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
  
  &:last-child {
    border-bottom: none;
  }
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #CCCCCC;
}
</style>
