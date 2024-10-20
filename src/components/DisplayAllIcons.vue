<template>
  <div class="container">
    <div class="item" v-for="(_, icon) in allIcons" :key="icon">
      <component class="icon" :is="icon" />
      <span> {{ icon }}</span>
    </div>
  </div>

  <div class="reorder-container">
    <div class="btn-container">
      <button @click="insert">Insert at random index</button>
      <button @click="reset">Reset</button>
    </div>

    <div class="test">
      <TransitionGroup tag="div" name="fade" class="reorder">
        <div
          v-for="item in items"
          :class="['item', { dragging: item === dragStartItem }]"
          :key="item"
          @dragstart="(event) => startdrag(item, event)"
          @dragenter="enterdrag(item)"
          @dragend="enddrag"
          draggable="true"
        >
          {{ item }}
          <button @click="remove(item)">x</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import icons from './icons/index';

const getInitialItems = () => [1, 2, 3, 4, 5];
let id = getInitialItems().length + 1;

export default {
  data() {
    return {
      allIcons: icons,
      items: getInitialItems(),
      dragStartItem: null,
      timer: null,
      movingItems: []
    };
  },
  mounted() {
    let word = [];
    for (const iconName in icons) {
      word.push(iconName);
    }

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  },

  methods: {
    insert() {
      const i = Math.round(Math.random() * this.items.length);
      this.items.splice(i, 0, id++);
    },
    reset() {
      this.items = getInitialItems();
      id = getInitialItems().length + 1;
    },
    remove(item) {
      const i = this.items.indexOf(item);
      if (i > -1) this.items.splice(i, 1);
    },
    startdrag(item) {
      this.dragStartItem = item;
    },
    enterdrag(item) {
      if (item == this.dragStartItem || this.movingItems.includes(item)) return;

      const swapTarget = this.items.indexOf(item);
      const previousIndex = this.items.indexOf(this.dragStartItem);

      this.movingItems = this.items.slice(
        Math.min(swapTarget, previousIndex),
        Math.max(swapTarget, previousIndex) + 1
      );

      // this is probably where I handle the store instead
      this.items.splice(previousIndex, 1);
      this.items.splice(swapTarget, 0, this.dragStartItem);

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.movingItems = [];
      }, 300);
    },
    enddrag() {
      this.dragStartItem = null;
    }
  }
};
</script>

<style scoped>
.btn-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.3 ease-in;
}
.icon,
img {
  height: 40px;
  width: 40px;
}

span {
  font-size: 12px;
}

.dragging {
  opacity: 0.5;
  cursor: none !important;
}

.container,
.reorder {
  padding: 0;
  list-style-type: none;
  justify-content: center;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.item {
  width: 160px;
  background-color: #242424;
  border: 1px solid #666;
  box-sizing: border-box;
  color: white;
  padding: 8px;
}

/* 1. declare transition */
.fade-move {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-leave-active {
  position: absolute;
}

/* 2. declare enter from and leave to state */
/*  .fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}  */
</style>
