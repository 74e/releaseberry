<template>
  <div class="media-container">
    <div class="display">
      <img v-if="!selectedMedia?.type" :src="selectedMedia?.url" />
      <video v-else :src="selectedMedia.url" controls autoplay muted />
    </div>

    <div class="gallery-selection">
      <div
        v-for="item in media"
        :key="item.id"
        class="thumbnail"
        :class="['thumbnail', { selected: selectedMedia?.url === item.url }]"
      >
        <img :src="item.thumbnail" @click="selectMedia(item)" />
        <div v-if="item?.type" class="play">▶</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaGallery',

  props: ['media'],

  mounted() {
    this.selectedMedia = this.media[0];
  },

  data() {
    return {
      selectedMedia: null
    };
  },

  methods: {
    selectMedia(mediaItem) {
      this.selectedMedia = mediaItem;
    }
  }
};
</script>

<style scoped>
.media-container {
  user-select: none;
}

.display {
  width: 100%;
  aspect-ratio: 16 / 9;

  img,
  video {
    border-radius: var(--radius-sm);
  }
}

.gallery-selection {
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  padding: 12px 16px;
  filter: brightness(80%);
  background-color: var(--dark-95);
  -ms-overflow-style: scrollbar; /* IE and Edge */
  scrollbar-width: thin; /* Firefox */

  &::-webkit-scrollbar {
    display: block;
  }

  .thumbnail {
    height: 50px;
    aspect-ratio: 16 / 9;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      border-radius: 4px;
    }

    &:hover {
      filter: brightness(120%);
    }

    .play {
      position: absolute;
      background-color: var(--dark-85);
      border-radius: 4px;
      padding: 8px 12px 10px 12px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    &.selected {
      border-radius: 4px;
      outline: 2px solid white;
      filter: brightness(120%);
    }
  }
}
</style>
