<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('知否花店小程序启动')
})

onShow(() => {
  console.log('小程序显示')
})

onHide(() => {
  console.log('小程序隐藏')
})
</script>

<style lang="scss">
@import './styles/global.scss';
</style>
