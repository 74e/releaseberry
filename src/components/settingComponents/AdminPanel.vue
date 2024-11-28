<template>
  <div>
    <h1 class="section-heading">Game Index</h1>
    <IndexSetting class="root-section" />
  </div>
</template>

<script>
import IndexSetting from './IndexSetting.vue';

export default {
  name: 'AdminPanel',
  components: { IndexSetting },
  props: ['userRole'],

  mounted() {
    // if a user somehow ends up with the panel open
    if (this.userRole !== 'ADMIN') {
      this.$router.push('/');
    }
  }
};
</script>

<style>
/* .content {} */

.root-section {
  padding: 12px 18px;
}

.section-heading {
  font-weight: bold;
  font-size: 18px;
}
</style>
