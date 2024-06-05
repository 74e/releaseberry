<template>
  <main>
    <TitleLogo />
    <CardToolbar />
    <div v-if="modifiedCardData" class="card-display-container">
      <component
        :is="card.component"
        v-for="card in modifiedCardData"
        :gameData="card.gameData"
        :styleSettings="card.styleSettings"
        :displaySettings="card.displaySettings"
        :key="card"
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
import {
  releaseBerryStandard,
  releaseBerryMinimal
} from '@/assets/styleSettings/defaultPresetsAndSettings.js'
import TimerDisplay from '@/components/TimerDisplay.vue'

export default {
  name: 'MainView',

  components: {
    CardToolbar,
    TitleLogo,
    TimerDisplay
  },

  data() {
    return {}
  },

  mounted() {
    this.initialize()

    setTimeout(() => {
      console.log(this.modifiedCardData)
    }, 2000)
  },

  computed: {
    ...mapState(gameStore, ['library']),
    ...mapState(userStore, ['loggedInUser']),

    card() {
      return this.modifiedCardData
    },

    // Make shift to simulate kind of what the backend will return when its finished
    modifiedCardData() {
      return this.library?.map((game) => {
        const randomStyle = Math.floor(
          Math.random() * releaseBerryStandard.presets.length
        )
        const cards = [
          {
            component: 'CardDefault',
            styleSettings: releaseBerryStandard.presets[randomStyle],
            displaySettings: releaseBerryStandard.settings
          },
          {
            component: 'CardDefaultMinimal',
            styleSettings: releaseBerryMinimal.presets[randomStyle],
            displaySettings: releaseBerryMinimal.settings
          }
        ]
        const randomCard = Math.floor(Math.random() * cards.length)

        return {
          gameData: {
            ...game
          },
          ...cards[randomCard]
        }
      })
    }
  },

  methods: {
    ...mapActions(gameStore, ['getLibrary']),

    async initialize() {
      this.getLibrary(this.loggedInUser.id)
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
