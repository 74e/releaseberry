<template>
  <div class="imgs">
    <img v-for="(image, index) in newImages" :src="image" :key="index" alt="" />
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';

const avatars = inject('profileImages');
const newImages = ref([]);
function preloadImages(imageUrls) {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });
    })
  );
}
onMounted(async () => {
  await preloadImages(avatars);
  newImages.value = avatars;
});
</script>
<style scoped>
.imgs {
  position: absolute;
  top: -100%;
  height: 20px;
  width: 20px;
  overflow: hidden;
}
</style>
