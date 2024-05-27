<template>
  <main>
    <TitleLogo />
    <CardToolbar />
    <div class="card-display-container">
      <CardDefault />
      <CardDefaultMinimal />
    </div>
  </main>
</template>

<script>
import CardToolbar from '@/components/CardToolbar.vue'
import CardDefault from '@/components/cards/CardDefault.vue'
import CardDefaultMinimal from '@/components/cards/CardDefaultMinimal.vue'
import TitleLogo from '@/components/TitleLogo.vue'

export default {
  name: 'MainView',

  components: {
    CardToolbar,
    CardDefault,
    CardDefaultMinimal,
    TitleLogo
  },

  data() {
    return {}
  },

  mounted() {},

  methods: {}
}
</script>

<style>
.card-display-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 48px;
  margin: 30px auto;

  width: 80%;
  min-width: 1023px;

  z-index: -1;

  @media (max-width: 1150px) {
    min-width: 925px;
  }

  @media (max-width: 960px) {
    min-width: unset;
    width: 100%;
  }
}

main {
  min-height: 100vh;
  padding: 40px 16px;

  @media (max-width: 500px) {
    padding: 16px;
  }
}
</style>
