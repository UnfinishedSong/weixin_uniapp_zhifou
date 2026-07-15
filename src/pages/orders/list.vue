<template>
  <view class="page">
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <view v-if="filteredOrders.length > 0" class="order-list">
      <view 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-item"
      >
        <view class="order-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <text class="order-status" :class="order.status">{{ statusText[order.status] }}</text>
        </view>
        <view class="order-items">
          <view 
            v-for="item in order.items" 
            :key="item.id"
            class="order-product"
          >
            <image :src="item.image" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ item.productName }}</text>
              <text v-if="item.spec" class="product-spec">{{ item.spec }}</text>
              <view class="product-footer">
                <text class="product-price">{{ item.price }}</text>
                <text class="product-qty">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-total">实付<text class="total-price">{{ order.payAmount }}</text></text>
          <view class="order-actions">
            <view v-if="order.status === 'pending'" class="action-btn" @click="payOrder(order.id)">付款</view>
            <view v-if="order.status === 'pending'" class="action-btn outline" @click="cancelOrder(order.id)">取消</view>
            <view v-if="order.status === 'shipped'" class="action-btn" @click="confirmOrder(order.id)">确认收货</view>
            <view v-if="order.status === 'completed'" class="action-btn outline">再次购买</view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📦</text>
      <text class="empty-text">暂无相关订单</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

const tabs = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending' },
  { label: '待收货', value: 'shipped' },
  { label: '已完成', value: 'completed' }
]

const statusText: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消'
}

const activeTab = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as { options?: { status?: string } }
  const status = currentPage.options?.status
  if (status) {
    activeTab.value = status
  }
})

const filteredOrders = computed(() => {
  if (!activeTab.value) return orderStore.orders
  return orderStore.orders.filter(o => o.status === activeTab.value)
})

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

.order-list {
  padding: 20rpx;
}

.order-item {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
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
  flex-direction: column;
  gap: 16rpx;
}

.order-product {
  display: flex;
  gap: 16rpx;
}

.order-product image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 28rpx;
  color: #333333;
}

.product-spec {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.product-price {
  font-size: 28rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 22rpx;
  }
}

.product-qty {
  font-size: 24rpx;
  color: #999999;
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #F5F5F5;
}

.order-total {
  font-size: 26rpx;
  color: #666666;
}

.total-price {
  font-size: 32rpx;
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
  padding: 16rpx 32rpx;
  background: #FF6B9D;
  border-radius: 20rpx;
  
  text {
    font-size: 26rpx;
    color: #FFFFFF;
  }
  
  &.outline {
    background: transparent;
    border: 1rpx solid #DDDDDD;
    
    text {
      color: #666666;
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
