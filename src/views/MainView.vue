<template>
  <main>
    <TitleLogo />
    <CardToolbar />
    <div class="card-display-container">
      <component
        v-for="card in library"
        :is="card.cardData.card_component"
        :gameData="card.gameData"
        :cardData="card.cardData"
        :key="card.id"
      />
    </div>
  </main>
</template>

<script>
import CardToolbar from '@/components/CardToolbar.vue'
import TitleLogo from '@/components/TitleLogo.vue'
import gameStore from '@/state/gameStore'
import userStore from '@/state/userStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'MainView',

  components: {
    CardToolbar,
    TitleLogo
  },

  data() {
    return {}
  },

  mounted() {
    this.initialize()
  },

  computed: {
    ...mapState(gameStore, ['library']),
    ...mapState(userStore, ['loggedInUser'])
  },

  methods: {
    ...mapActions(gameStore, ['getLibrary']),

    async initialize() {
      await this.getLibrary(this.loggedInUser.id)

      console.log(this.library)
    }
  }
}
</script>

<style scoped>
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
