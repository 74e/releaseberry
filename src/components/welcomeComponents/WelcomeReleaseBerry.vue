<template>
  <div class="welcome-container">
    <IntroSection />
    <div class="divider" />
    <AddDemoSection />
    <div class="divider" />
    <CustomizeSection />
    <div class="divider" />
    <CommunitySection />
  </div>
</template>

<script>
import IntroSection from './IntroSection.vue';
import AddDemoSection from './AddDemoSection.vue';
import CustomizeSection from './CustomizeSection.vue';
import CommunitySection from './CommunitySection.vue';

export default {
  name: 'WelcomeReleaseBerry',

  components: { IntroSection, AddDemoSection, CustomizeSection, CommunitySection },

  data() {
    return {};
  },

  computed: {},

  methods: {}
};
</script>

<style scoped>
.welcome-container {
  padding: 34px;
  border: 1px solid rgb(34, 34, 34);
  border-radius: var(--radius-l);
  background-color: rgba(17, 19, 24, 0.65);
  backdrop-filter: blur(30px);
}

.divider {
  background: linear-gradient(
    to left,
    #5e515100,
    #5e515100 15%,
    #ffffff21 50%,
    #5e515100 85%,
    #33333300 100%
  );
  height: 2px;
  width: 100%;
  margin: 100px 0;
}
</style>
