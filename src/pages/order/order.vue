<template>
  <view class="page">
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索鲜花、礼品..."
          @confirm="handleSearch"
        />
        <text v-if="searchKeyword" class="clear-btn" @click="clearSearch">✕</text>
      </view>
    </view>

    <view class="content">
      <scroll-view class="category-sidebar" scroll-y>
        <view 
          v-for="category in allCategories" 
          :key="category.id"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <text class="category-icon">{{ category.icon }}</text>
          <text class="category-name">{{ category.name }}</text>
        </view>
      </scroll-view>

      <scroll-view class="product-area" scroll-y>
        <view v-if="filteredProducts.length > 0" class="product-list">
          <view 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="product-item"
            @click="goDetail(product.id)"
          >
            <image class="product-image" :src="product.images[0]" mode="aspectFill" />
            <view class="product-content">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-desc">{{ product.description }}</text>
              <view class="product-specs">
                <text 
                  v-for="(spec, index) in product.specs?.slice(0, 3) || []" 
                  :key="index"
                  class="spec-tag"
                >{{ spec }}</text>
              </view>
              <view class="product-footer">
                <view class="price-wrap">
                  <text class="product-price">{{ product.price }}</text>
                  <text v-if="product.originalPrice" class="original-price">{{ product.originalPrice }}</text>
                </view>
                <view class="quantity-control">
                  <view 
                    class="qty-btn minus" 
                    @click.stop="decreaseQty(product)"
                  >
                    <text>-</text>
                  </view>
                  <text class="qty-num">{{ getQty(product.id) }}</text>
                  <view 
                    class="qty-btn plus" 
                    @click.stop="increaseQty(product)"
                  >
                    <text>+</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text class="empty-icon">🌸</text>
          <text class="empty-text">暂无商品</text>
        </view>
      </scroll-view>
    </view>

    <view class="bottom-bar">
      <view class="cart-info" @click="toggleCartPopup">
        <view class="cart-icon-wrap">
          <text class="cart-icon">🛒</text>
          <view v-if="cartCount > 0" class="cart-badge">{{ cartCount > 99 ? '99+' : cartCount }}</view>
        </view>
        <text class="cart-text">购物车</text>
      </view>
      <view class="checkout-btn" @click="goCheckout">
        <text class="checkout-price">{{ totalPrice }}</text>
        <text class="checkout-text">去结算</text>
      </view>
    </view>

    <view v-if="showCartPopup" class="cart-popup-mask" @click="toggleCartPopup"></view>
    <CustomTabBar />
    <view class="cart-popup" :class="{ show: showCartPopup }">
      <view class="cart-popup-header">
        <text class="cart-popup-title">购物车</text>
        <view class="cart-popup-close" @click="toggleCartPopup">
          <text>✕</text>
        </view>
      </view>
      
      <scroll-view class="cart-popup-content" scroll-y>
        <view v-if="cartStore.isEmpty" class="empty-cart">
          <text class="empty-icon">🛒</text>
          <text class="empty-text">购物车是空的</text>
        </view>
        
        <view v-else class="cart-list">
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
                  <view class="qty-btn" @click="updateCartQty(item, item.quantity - 1)">
                    <text>-</text>
                  </view>
                  <text class="qty-num">{{ item.quantity }}</text>
                  <view class="qty-btn plus" @click="updateCartQty(item, item.quantity + 1)">
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
      </scroll-view>
      
      <view v-if="!cartStore.isEmpty" class="cart-popup-footer">
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
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { categories, products, type Product } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '@/stores/cart'

const cartStore = useCartStore()

const searchKeyword = ref('')
const selectedCategory = ref(0)
const showCartPopup = ref(false)
const selectedIds = ref<number[]>([])

const allCategories = computed(() => [
  { id: 0, name: '全部', icon: '🌸' },
  ...categories
])

const filteredProducts = computed(() => {
  let result = selectedCategory.value === 0 
    ? products 
    : products.filter(p => p.categoryId === selectedCategory.value)
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

const qtyMap = ref<Record<number, number>>({})

const getQty = (productId: number) => {
  return qtyMap.value[productId] || 0
}

const increaseQty = (product: Product) => {
  qtyMap.value[product.id] = (qtyMap.value[product.id] || 0) + 1
  cartStore.addItem(product, 1)
}

const decreaseQty = (product: Product) => {
  const currentQty = qtyMap.value[product.id] || 0
  if (currentQty > 0) {
    qtyMap.value[product.id] = currentQty - 1
    const cartItem = cartStore.items.find(item => item.product.id === product.id)
    if (cartItem) {
      cartStore.updateQuantity(cartItem.id, cartItem.quantity - 1)
    }
  }
}

const cartCount = computed(() => cartStore.totalCount)
const totalPrice = computed(() => cartStore.totalPrice)

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

const selectCategory = (categoryId: number) => {
  selectedCategory.value = categoryId
}

const handleSearch = () => {
}

const clearSearch = () => {
  searchKeyword.value = ''
}

const goDetail = (productId: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${productId}` })
}

const toggleCartPopup = () => {
  showCartPopup.value = !showCartPopup.value
  if (showCartPopup.value) {
    selectedIds.value = cartStore.items.map(item => item.id)
  }
}

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

const updateCartQty = (item: CartItem, quantity: number) => {
  if (quantity <= 0) {
    removeItem(item.id)
  } else {
    cartStore.updateQuantity(item.id, quantity)
    qtyMap.value[item.product.id] = quantity
  }
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

const goCheckout = () => {
  if (selectedIds.value.length === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  showCartPopup.value = false
  uni.navigateTo({ url: '/pages/checkout/checkout' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.search-bar {
  background: #FFFFFF;
  padding: 16rpx 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-input-wrap {
  background: #F5F5F5;
  border-radius: 30rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.search-icon {
  font-size: 28rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  background: transparent;
}

.clear-btn {
  font-size: 24rpx;
  color: #999999;
  padding: 8rpx;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-sidebar {
  width: 180rpx;
  background: #F8F8F8;
  height: calc(100vh - 200rpx);
}

.category-item {
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  position: relative;
  transition: all 0.3s ease;
  
  &.active {
    background: #FFFFFF;
    
    .category-name {
      color: #FF6B9D;
      font-weight: 600;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 40rpx;
      background: #FF6B9D;
      border-radius: 0 3rpx 3rpx 0;
    }
  }
}

.category-icon {
  font-size: 36rpx;
}

.category-name {
  font-size: 24rpx;
  color: #666666;
}

.product-area {
  flex: 1;
  padding: 16rpx;
  height: calc(100vh - 200rpx);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.product-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  gap: 16rpx;
}

.product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.product-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 8rpx;
}

.spec-tag {
  padding: 4rpx 12rpx;
  background: #F5F5F5;
  border-radius: 6rpx;
  font-size: 22rpx;
  color: #999999;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
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

.original-price {
  font-size: 22rpx;
  color: #CCCCCC;
  text-decoration: line-through;
  
  &::before {
    content: '¥';
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.bottom-bar {
  position: fixed;
  bottom: 110rpx;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 16rpx 20rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.cart-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.cart-icon-wrap {
  position: relative;
}

.cart-icon {
  font-size: 44rpx;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -12rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #FF4D4F;
  color: #FFFFFF;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.cart-text {
  font-size: 22rpx;
  color: #999999;
  margin-top: 4rpx;
}

.checkout-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFB6C8 100%);
  border-radius: 40rpx;
  padding: 20rpx 48rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.checkout-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  
  &::before {
    content: '¥';
    font-size: 24rpx;
  }
}

.checkout-text {
  font-size: 28rpx;
  color: #FFFFFF;
}

.cart-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.cart-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: 30rpx 30rpx 0 0;
  z-index: 1001;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  &.show {
    transform: translateY(0);
  }
}

.cart-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.cart-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.cart-popup-close {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 32rpx;
    color: #999999;
  }
}

.cart-popup-content {
  flex: 1;
  padding: 20rpx;
  max-height: 60vh;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
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

.delete-btn {
  padding: 12rpx 20rpx;
  
  text {
    font-size: 26rpx;
    color: #999999;
  }
}

.cart-popup-footer {
  padding: 20rpx;
  border-top: 1rpx solid #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
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
</style>
