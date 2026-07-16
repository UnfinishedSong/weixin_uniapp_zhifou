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

    <view class="member-section">
      <view class="progress-card">
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

      <view class="benefits-card">
        <view class="card-header">
          <text class="header-icon">🎁</text>
          <text class="header-title">会员权益</text>
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
            <text class="order-status" :class="order.status">{{ getOrderStatus(order) }}</text>
          </view>
          <view class="delivery-tag" :class="order.deliveryType">
            <text>{{ order.deliveryType === 'delivery' ? '🚀 外卖配送' : '🏪 门店自提' }}</text>
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
            <view v-else-if="order.status === 'pickup_ready'" class="order-actions">
              <view class="action-btn primary" @click.stop="confirmOrder(order.id)">确认取货</view>
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
        <text class="menu-text">地址管理</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="goConsult">
        <text class="menu-icon">💬</text>
        <text class="menu-text">详情咨询</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import { memberLevels } from '@/data/member'
import type { Order } from '@/stores/order'

const userStore = useUserStore()
const orderStore = useOrderStore()

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

const getOrderStatus = (order: Order) => {
  const statusMap: Record<string, string> = {
    pending: '待下单',
    paid: '已付款',
    making: '制作中',
    shipped: '配送中',
    pickup_ready: '待自取',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[order.status] || '未知状态'
}

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

const goConsult = () => {
  uni.showModal({
    title: '🌸 详情咨询',
    content: '有任何问题都可以联系我们哦~\n\n📞 客服热线：138-8888-8888\n💬 微信同号，欢迎骚扰~',
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

.member-section {
  margin: -20rpx 20rpx 20rpx;
}

.progress-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
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

.benefits-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.header-icon {
  font-size: 32rpx;
}

.header-title {
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
  margin-bottom: 12rpx;
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
  &.making { color: #FFB347; }
  &.shipped { color: #F39C12; }
  &.pickup_ready { color: #3498DB; }
  &.completed { color: #52C41A; }
  &.cancelled { color: #999999; }
}

.delivery-tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  
  text {
    font-size: 22rpx;
    color: #FFFFFF;
  }
  
  &.delivery {
    background: rgba(52, 152, 219, 0.15);
    
    text {
      color: #3498DB;
    }
  }
  
  &.pickup {
    background: rgba(255, 107, 157, 0.15);
    
    text {
      color: #FF6B9D;
    }
  }
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