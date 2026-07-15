<template>
  <view class="page">
    <view v-if="cartStore.isEmpty" class="empty-cart">
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车是空的</text>
      <view class="empty-btn" @click="goShopping">
        <text>去逛逛</text>
      </view>
    </view>

    <view v-else class="cart-content">
      <view class="cart-list">
        <view 
          v-for="item in cartStore.items" 
          :key="item.id"
          class="cart-item"
        >
          <view 
            class="checkbox" 
            :class="{ checked: selectedIds.includes(item.id) }"
            @click="toggleSelect(item.id)"
          >
            <text v-if="selectedIds.includes(item.id)">✓</text>
          </view>
          <view class="item-image" @click="goDetail(item.product.id)">
            <image :src="item.product.images[0]" mode="aspectFill" />
          </view>
          <view class="item-info">
            <text class="item-name">{{ item.product.name }}</text>
            <text v-if="item.spec" class="item-spec">{{ item.spec }}</text>
            <view class="item-footer">
              <text class="item-price">{{ item.product.price }}</text>
              <view class="quantity-control">
                <view class="qty-btn" @click="decreaseQty(item)">
                  <text>-</text>
                </view>
                <text class="qty-num">{{ item.quantity }}</text>
                <view class="qty-btn plus" @click="increaseQty(item)">
                  <text>+</text>
                </view>
              </view>
            </view>
          </view>
          <view class="delete-btn" @click="removeItem(item.id)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!cartStore.isEmpty" class="bottom-bar">
      <view class="select-all" @click="toggleSelectAll">
        <view 
          class="checkbox" 
          :class="{ checked: isAllSelected }"
        >
          <text v-if="isAllSelected">✓</text>
        </view>
        <text>全选</text>
      </view>
      <view class="total-info">
        <text class="total-label">合计:</text>
        <text class="total-price">{{ selectedTotal }}</text>
      </view>
      <view class="checkout-btn" @click="goCheckout">
        <text>结算({{ selectedCount }})</text>
      </view>
    </view>

    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '@/stores/cart'

const cartStore = useCartStore()
const selectedIds = ref<number[]>([])

const isAllSelected = computed(() => {
  return cartStore.items.length > 0 && selectedIds.value.length === cartStore.items.length
})

const selectedCount = computed(() => {
  return selectedIds.value.reduce((count, id) => {
    const item = cartStore.items.find(i => i.id === id)
    return count + (item?.quantity || 0)
  }, 0)
})

const selectedTotal = computed(() => {
  return selectedIds.value.reduce((total, id) => {
    const item = cartStore.items.find(i => i.id === id)
    return total + ((item?.product.price || 0) * (item?.quantity || 0))
  }, 0)
})

const toggleSelect = (id: number) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = cartStore.items.map(item => item.id)
  }
}

const increaseQty = (item: CartItem) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseQty = (item: CartItem) => {
  cartStore.updateQuantity(item.id, item.quantity - 1)
}

const removeItem = (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个商品吗？',
    success: (res) => {
      if (res.confirm) {
        cartStore.removeItem(id)
        const index = selectedIds.value.indexOf(id)
        if (index !== -1) {
          selectedIds.value.splice(index, 1)
        }
      }
    }
  })
}

const goShopping = () => {
  uni.switchTab({ url: '/pages/order/order' })
}

const goDetail = (productId: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${productId}` })
}

const goCheckout = () => {
  if (selectedIds.value.length === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/checkout/checkout' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 130rpx;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;
}

.empty-icon {
  font-size: 120rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999999;
  margin-top: 30rpx;
}

.empty-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 40rpx;
  padding: 24rpx 64rpx;
  margin-top: 40rpx;
  
  text {
    font-size: 30rpx;
    color: #FFFFFF;
    font-weight: 500;
  }
}

.cart-content {
  padding: 20rpx;
}

.cart-list {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #F5F5F5;
  
  &:last-child {
    border-bottom: none;
  }
}

.checkbox {
  width: 48rpx;
  height: 48rpx;
  border: 2rpx solid #DDDDDD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  
  text {
    font-size: 28rpx;
    color: #FFFFFF;
  }
  
  &.checked {
    background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
    border-color: transparent;
  }
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-right: 20rpx;
}

.item-image image {
  width: 100%;
  height: 100%;
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
  margin-top: 16rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 24rpx;
  }
}

.quantity-control {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 30rpx;
}

.qty-btn {
  width: 56rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 32rpx;
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
  width: 60rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
}

.delete-btn {
  padding: 12rpx 20rpx;
  
  text {
    font-size: 26rpx;
    color: #999999;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 110rpx;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.select-all {
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  text {
    font-size: 28rpx;
    color: #333333;
  }
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
  font-size: 36rpx;
  font-weight: 600;
  color: #FF6B9D;
  
  &::before {
    content: '¥';
    font-size: 28rpx;
  }
}

.checkout-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 40rpx;
  padding: 24rpx 48rpx;
  
  text {
    font-size: 30rpx;
    color: #FFFFFF;
    font-weight: 500;
  }
}
</style>
