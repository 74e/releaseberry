<template>
  <div class="content">
    <h1 class="section-heading">Accent Color</h1>
    <AccentColorSetting class="root-section" />
    <h1 class="section-heading">Accent Border</h1>
    <AccentBorderSetting class="root-section" />
  </div>
</template>

<script>
import AccentColorSetting from './AccentColorSetting.vue';
import AccentBorderSetting from './AccentBorderSetting.vue';

export default {
  name: 'AppearanceSettings',

  components: { AccentColorSetting, AccentBorderSetting }
};
</script>

<style scoped>
/* .content {} */

.root-section {
  padding: 12px 18px;
}

.section-heading {
  font-weight: bold;
  font-size: 18px;
}
</style>
