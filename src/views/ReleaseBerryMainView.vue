<template>
  <main>
    <TitleLogo margin="s" />

    <ViewMenu :component="component" :setView="setView" />

    <Transition name="fade" mode="out-in">
      <component :is="component" />
    </Transition>
  </main>
</template>

<script>
import GlobalLibraryArea from '@/components/GlobalLibraryArea.vue';
import LeaderboardArea from '@/components/LeaderboardArea.vue';
import CalenderArea from '@/components/CalenderArea.vue';
import TitleLogo from '@/components/TitleLogo.vue';
import ViewMenu from '@/components/ViewMenu.vue';

export default {
  name: 'ReleaseBerryCenter',

  components: { GlobalLibraryArea, LeaderboardArea, CalenderArea, TitleLogo, ViewMenu },

  data() {
    return {
      component: 'GlobalLibraryArea'
    };
  },

  mounted() {},

  computed: {},

  methods: {
    setView(view) {
      this.component = view;
    }
  }
};
</script>

<style scoped>
main {
  min-height: 100vh;
  padding: 40px 16px;
  margin: auto;

  @media (max-width: 500px) {
    padding: 16px;
  }
}
</style>
