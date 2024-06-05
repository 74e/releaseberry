<template>
  <div class="loading-icon">
    <img :src="loadingGif" alt="Loading" />
  </div>
</template>

<script setup>
import loadingGif from '../../assets/loadingAnimation.gif'
</script>

<style scoped>
.loading-icon {
  img {
    width: 100%;
  }
}
</style>
