import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/data/products'

export interface CartItem {
  id: number
  product: Product
  quantity: number
  spec?: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  
  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })
  
  const addItem = (product: Product, quantity: number = 1, spec?: string) => {
    const existingItem = items.value.find(
      item => item.product.id === product.id && item.spec === spec
    )
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: Date.now(),
        product,
        quantity,
        spec
      })
    }
    
    uni.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  }
  
  const removeItem = (id: number) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        item.quantity = quantity
      }
    }
  }
  
  const clearCart = () => {
    items.value = []
  }
  
  const isEmpty = computed(() => items.value.length === 0)
  
  return {
    items,
    totalCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty
  }
})
