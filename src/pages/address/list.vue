<template>
  <view class="page">
    <view v-if="orderStore.addresses.length > 0" class="address-list">
      <view 
        v-for="address in orderStore.addresses" 
        :key="address.id"
        class="address-item"
        :class="{ active: selectedId === address.id }"
        @click="selectAddress(address.id)"
      >
        <view class="radio" :class="{ checked: selectedId === address.id }">
          <text v-if="selectedId === address.id">✓</text>
        </view>
        <view class="address-info">
          <view class="address-header">
            <text class="address-name">{{ address.name }}</text>
            <text class="address-phone">{{ address.phone }}</text>
            <text v-if="address.isDefault" class="default-tag">默认</text>
          </view>
          <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
        </view>
        <view class="address-actions">
          <text class="action-btn" @click.stop="editAddress(address)">编辑</text>
          <text class="action-btn" @click.stop="deleteAddress(address.id)">删除</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📍</text>
      <text class="empty-text">暂无收货地址</text>
    </view>

    <view class="add-btn" @click="addAddress">
      <text>+ 添加收货地址</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'
import type { Address } from '@/stores/order'

const orderStore = useOrderStore()
const selectedId = ref<number | null>(null)

onMounted(() => {
  const defaultAddress = orderStore.getDefaultAddress()
  if (defaultAddress) {
    selectedId.value = defaultAddress.id
  }
})

const selectAddress = (id: number) => {
  selectedId.value = id
  uni.navigateBack()
}

const addAddress = () => {
  uni.showToast({ title: '添加地址功能开发中', icon: 'none' })
}

const editAddress = (address: Address) => {
  uni.showToast({ title: '编辑地址功能开发中', icon: 'none' })
}

const deleteAddress = (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: (res) => {
      if (res.confirm) {
        orderStore.deleteAddress(id)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 180rpx;
}

.address-list {
  padding: 20rpx;
}

.address-item {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.radio {
  width: 48rpx;
  height: 48rpx;
  border: 2rpx solid #DDDDDD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  text {
    font-size: 28rpx;
    color: #FFFFFF;
  }
  
  &.checked {
    background: #FF6B9D;
    border-color: #FF6B9D;
  }
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
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

.default-tag {
  font-size: 22rpx;
  color: #FF6B9D;
  background: rgba(255, 107, 157, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.address-detail {
  font-size: 26rpx;
  color: #999999;
  margin-top: 12rpx;
  display: block;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.action-btn {
  font-size: 26rpx;
  color: #999999;
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

.add-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  padding: 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  text-align: center;
  
  text {
    font-size: 32rpx;
    font-weight: 500;
    color: #FFFFFF;
  }
}
</style>
