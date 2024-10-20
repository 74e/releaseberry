<template>
  <div class="reorder-container">
    <div class="btn-container">
      <button @click="insert">Insert at random index</button>
      <button @click="reset">Reset</button>
    </div>

    <TransitionGroup tag="ul" name="fade" class="reorder" @mousedown="handleMouseDown">
      <li v-for="item in items" class="item" :data-item="item" :key="item">
        <div class="inner">{{ item }}</div>
        <button @click="remove(item)">x</button>
      </li>
    </TransitionGroup>
  </div>
</template>

<script>
const getInitialItems = () => [1, 2, 3, 4, 5];
let id = getInitialItems().length + 1;

export default {
  data() {
    return {
      items: getInitialItems(),
      dragStartItem: null,
      initY: null,
      initX: null
    };
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

    handleMouseDown(event) {
      const item = event.target.closest('.item');

      if (item) {
        this.dragStartItem = item;
        this.initX = event.pageX;
        this.initY = event.pageY;

        item.classList.add('dragging');
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
      }
    },

    handleMouseMove(event) {
      this.dragStartItem.style.inset = `${event.pageY - this.initY}px 0 0 ${event.pageX - this.initX}px`;
    },

    handleMouseUp() {
      this.dragStartItem.classList.add('moving');
      this.dragStartItem.style.inset = `0`;

      setTimeout(() => this.dragStartItem.classList.remove('moving', 'dragging'), 300);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
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
  position: relative;

  .inner {
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.199);
  }

  &.moving {
    transition: all 0.3s ease-in;
  }

  &.dragging {
    z-index: 100;
  }
}

/* 1. declare transition */
.fade-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
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
