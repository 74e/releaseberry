<template>
  <!-- add to main later @contextmenu="(event) => handleContextMenu(event)"-->

  <div class="notepad-bg">
    <div class="bg-blur" />
  </div>

  <main>
    <NotepadWindow
      v-for="noteWindow in windows"
      :noteWindow="noteWindow"
      :key="noteWindow"
    />
    <div class="text-menu">
      <button @click="createNewWindow" class="add">
        <IconPlus class="add-icon" />
      </button>
      <button @click="console.log(windows)" class="add">
        <IconPlus class="add-icon" />
      </button>
      <div class="notes">
        <!-- // render out indiviual notes
        // TODO: use vuex/pinja for state management -->
      </div>
    </div>
  </main>
</template>

<script>
import NotepadWindow from '../components/NotepadWindow.vue'

export default {
  name: 'NotepadDashboard',

  components: {
    NotepadWindow
  },

  data() {
    return { windows: [] }
  },

  mounted() {
    //   addEventListener("click", (event) => console.log(event));
  },

  computed: {},

  methods: {
    handleContextMenu(event) {
      console.log(event.clientX, event.clientY)

      event.preventDefault()
    },

    createNewWindow() {
      this.windows.push({
        id: Math.floor(Math.random() * 10001),
        noteTitle: 'Text Document',
        noteContent: ''
      })
    }
  }
}
</script>

<style scoped>
.notepad-bg {
  background-image: url('../assets/images/notepad-bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  left: 0;

  z-index: -1;
}

.bg-blur {
  backdrop-filter: blur(16px);
  width: 100%;
  height: 100%;
}

.text-menu {
  width: 60px;
  height: 100%;
  border-left: 2px solid rgba(255, 255, 255, 0.205);
  padding: 8px;

  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  flex-direction: col;
  justify-content: center;

  button.add {
    --color: rgba(255, 255, 255, 0.267);
    --hover: rgba(255, 255, 255, 0.479);

    border: 2px solid var(--color);
    border-radius: var(--border-radius);
    background: none;
    width: 38px;
    height: 38px;

    svg {
      width: 20px;
      height: 20px;

      fill: var(--color);
    }

    &:hover {
      border-color: var(--hover);

      svg {
        fill: var(--hover);
      }
    }
  }
}
</style>
