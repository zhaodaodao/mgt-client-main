<template>
  <div :style="{ background: '#fff', height: '100vh' }">
    <img
      src="../../../public/img/404.png"
      alt="没有找到页面"
      :width="clientWidth / 2"
      :height="((clientWidth / 2) * 9) / 16"
    />
  </div>
</template>

<script>
export default {
  setup() {
    return {
      clientWidth: document.documentElement.clientWidth,
    }
  },
}
</script>
