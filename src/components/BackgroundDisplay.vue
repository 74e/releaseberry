<template>
  <div class="temporaryBG" />
</template>

<script></script>

<style scoped>
.temporaryBG {
  position: fixed;
  inset: 0;
  background-image: url('/fakeEffect.png');
  background-size: cover;
  mix-blend-mode: lighten;

  z-index: -20;
}
</style>
