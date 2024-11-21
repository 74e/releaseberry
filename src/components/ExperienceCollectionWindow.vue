<template>
  <ModalPopup
    ref="modal"
    :blur="true"
    :closeButton="false"
    :escapeEvent="true"
    :accentBorders="['faint']"
  >
    <div class="content" v-if="user">
      <div class="user-info">
        <img :src="profileImages[user.image_index]" alt="profile image" />

        <div class="profile-handle">
          <h2 class="handle">{{ user.username }}</h2>
          <span class="id-handle">@{{ user.handle }}</span>
        </div>
      </div>

      <ExperienceBar style="width: 100%" :experience="expBar.value" />

      <div class="game-info">
        <span class="title">{{ gameTitle }}</span>
        <span class="acc-exp">{{ accDisplay.value }} Exp</span>
      </div>

      <button @click="finalizeCollection" :disabled="!isFinished">Done</button>
    </div>
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';
import userStore from '../state/userStore';
import ExperienceBar from './ExperienceBar.vue';

export default {
  name: 'ExperienceCollectionWindow',

  inject: ['profileImages'],

  components: { ExperienceBar, ModalPopup },

  props: {
    gameTitle: { default: null, type: String },
    accumulatedExp: { default: null, type: Number }
  },

  mounted() {
    this.initiateXpCollection();
  },

  data() {
    return {
      user: null,
      expBar: { value: null },
      accDisplay: { value: null },
      expAfterCollection: null,
      isFinished: false
    };
  },

  methods: {
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    async initiateXpCollection() {
      const { handle, username, image_index, xp } = userStore().user;
      this.user = { handle, username, image_index };
      this.expBar.value = xp;

      this.expAfterCollection = xp + this.accumulatedExp;

      await this.animateCount(0, this.accumulatedExp, this.accDisplay, 0.001, 1.2);
      await this.delay(800);
      await Promise.all([
        this.animateCount(xp, this.expAfterCollection, this.expBar),
        this.animateCount(this.accumulatedExp, 0, this.accDisplay)
      ]);

      this.isFinished = true;
    },

    finalizeCollection() {
      this.$emit('collectAnimFinished', this.expAfterCollection);
    },

    easeOutExpo(t) {
      if (t === 0 || t === 1) return t;
      return Math.sin((t * Math.PI) / 2);
    },

    animateCount(from, to, value, baseDurationPerUnit = 0.001, constantDuration = null) {
      const start = performance.now(); // Record the start time
      let duration;

      if (constantDuration) {
        duration = constantDuration;
      } else {
        duration = Math.min(Math.abs(to - from) * baseDurationPerUnit, 8);
      }

      return new Promise((resolve) => {
        const update = (currentTime) => {
          const elapsed = (currentTime - start) / 1000; // Time in seconds
          const progress = Math.min(elapsed / duration, 1); // Cap progress at 1
          const easedProgress = this.easeOutExpo(progress); // Apply easing
          const currentValue = from + (to - from) * easedProgress;

          value.value = Number(currentValue.toFixed(0));

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(update); // Start animation
      });
    }
  }
};
</script>

<style scoped>
.content {
  width: 380px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  img {
    width: 50px;
    border-radius: 6px;
  }
}

.profile-handle {
  margin: 8px 0;
  padding-left: 12px;
  position: relative;
  overflow: hidden;
  line-height: 19px;

  width: max-content;

  @media (max-width: 1150px) {
    margin: 0;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 2px;
    border-radius: 4px;
    width: 3px;
    height: 35px;
    background-color: rgba(var(--accentColor));
    transition: all 0.3s ease-out;
    opacity: 100%;
  }

  h2 {
    font-size: 18px;
    font-weight: 500;

    overflow: hidden;
    text-overflow: '-';
    white-space: nowrap;
  }

  span {
    font-size: 14px;
    color: #848c8f;
    display: block;
    overflow: hidden;
    text-overflow: '-';
    white-space: nowrap;
  }

  @media (max-width: 410px) {
    h2 {
      font-size: 14px;
    }

    span {
      font-size: 11px;
    }
  }
}

.game-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px;
  margin-top: 6px;
  position: relative;

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.001) 0%,
      rgba(255, 255, 255, 0.001) 3%,
      #ffffff34 40%,
      #ffffff34 60%,
      rgba(255, 255, 255, 0.001) 97%,
      rgba(255, 255, 255, 0.001) 100%
    );
  }

  &::after {
    bottom: 0px;
  }

  &::before {
    top: 0px;
  }

  .title {
    font-size: 15px;
  }

  .acc-exp {
    color: rgba(var(--accentColor));
    font-size: 17px;
  }
}

button {
  position: absolute;
  width: 55%;
  left: 50%;
  top: calc(100% + 16px);
  transform: translateX(-50%);

  padding: 8px;
  background-color: var(--dark-85);
  box-shadow: var(--shadow-default);
  border-radius: 10px;
  border: 2px solid rgba(var(--accentColor), 0.66);
  color: rgba(var(--accentColor));
  transition: all 0.2s ease-in;
  cursor: pointer;

  &:disabled {
    opacity: 0;
  }

  &:hover {
    filter: brightness(1.3);
  }
}
</style>
