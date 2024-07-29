<template>
  <div v-if="noteWindow" :style="windowPosition" class="window-container">
    <div
      class="application-top-bar"
      @mousemove="(event) => onMoveDragAction(event)"
      @mousedown="(event) => initiateDragAction(event)"
      @mouseup="setMouseUnclicked()"
    >
      <div class="document-title-container">
        <img src="../assets/notepad.png" alt="notepad-logo" />
        <span>{{ noteWindow.noteTitle }}</span>
      </div>

      <div class="window-controls">
        <!-- <IconMinimize />
        <IconMaximize />
        <IconClose /> -->
      </div>

      <div class="application-controls">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
      </div>
    </div>

    <div class="note-field">
      <textarea
        @keyup="currentLnAndRowPosition"
        @input="updateNoteContent"
        @mouseup="getSelectedContent"
        ref="noteArea"
        class="note-area"
        :value="noteContent"
        spellcheck="false"
      ></textarea>
    </div>
    <div class="application-bottom-bar">
      <div class="ln-col">
        Ln
        {{ this.ln }}, Col
        {{ this.col }}
      </div>
      <div class="scale info-box">100%</div>
      <div class="word-count info-box">
        {{ wordCountDisplay }}
        {{ selectedContent ? 'Selected' : 'Words' }}
      </div>
    </div>
  </div>
</template>

<script>
// import _ from "lodash";

export default {
  name: 'NotepadWindow',

  props: {
    noteWindow: {
      type: [Object, null],
      default: null
    },

    noteContent: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      mouseOver: false,
      mouseClicked: false,
      currentWindowY: 50,
      currentWindowX: 50,
      initialWindowY: null,
      initialWindowX: null,
      initialMouseY: null,
      initialMouseX: null,
      col: 1,
      ln: 1,
      selectedContent: null
    }
  },

  computed: {
    windowPosition() {
      return {
        top: this.currentWindowY + 'px',
        left: this.currentWindowX + 'px'
      }
    },

    wordCountDisplay() {
      return this.getWordCount(this.selectedContent || this.noteWindow.noteContent)
    }
  },

  methods: {
    updateNoteContent(event) {
      this.$emit('update:noteContent', event.target.value)
    },
    /*
     * When moving the mouse too fast it can cause the mousemove event to "slip off"
     * as the window doesnt keep up with the mouse movement 1:1
     *
     * Possible solution: Use a global mousemove event in parent component
     * that checks with mousemove for "mouseClicked" + the specific window that has been clicked.
     * To run the functions from the NotepadWindow its required to emit this child components
     * ref to the parent component. Might need to modify/rethink methods in this component
     */

    currentLnAndRowPosition() {
      const cursorPosition = this.$refs.noteArea.selectionStart
      // substr cuts the string at cursor position before spliting into rows
      const lines = this.noteContent.substring(0, cursorPosition).split('\n')

      this.ln = lines.length
      this.col = lines[lines.length - 1] ? lines[lines.length - 1].length + 1 : 1
    },

    // TODO: Add custom scrollbar
    // TODO: Add a way to rename notepad window from file dropdown, dropdown for app controls
    onMoveDragAction(event) {
      if (this.mouseClicked) {
        this.currentWindowX = this.initialWindowX + (event.clientX - this.initialMouseX)
        this.currentWindowY = this.initialWindowY + (event.clientY - this.initialMouseY)
      }
    },

    // onMoveDragAction: _.throttle(function (event) {
    //   if (this.mouseClicked) {
    //     this.currentWindowX = this.initialWindowX + (event.clientX - this.initialMouseX);
    //     this.currentWindowY = this.initialWindowY + (event.clientY - this.initialMouseY);
    //   }
    // }, 10),

    initiateDragAction(event) {
      if (event.target.classList.contains('application-top-bar')) {
        this.initialMouseY = event.clientY
        this.initialMouseX = event.clientX
        this.initialWindowX = this.currentWindowX
        this.initialWindowY = this.currentWindowY
        this.mouseClicked = true
      }
    },

    setMouseUnclicked() {
      this.mouseClicked = false
    },

    getSelectedContent() {
      const textarea = this.$refs.noteArea
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      this.selectedContent = null
      this.currentLnAndRowPosition()

      if (start === end) return

      const selectedText = this.noteWindow.noteContent.substring(start, end)
      this.selectedContent = selectedText
    },

    getWordCount(textContent) {
      return textContent.match(/\S+/g)?.length || '0'
    }
  }
}
</script>

<style scoped>
.window-container {
  resize: both;
  overflow: hidden;
  position: fixed;
  background-color: var(--foreground-acrylic);
  backdrop-filter: blur(120px);
  border: var(--border);
  box-shadow: var(--box-shadow-close);
  width: 800px;
  height: 400px;
  border-radius: var(--radius-m);
  color: var(--font-color-white);
  min-height: 340px;
  min-width: 470px;
}

.application-top-bar {
  width: 100%;
  height: 64px;
  color: inherit;
  background-color: var(--dark-50);
  padding: 9px 14px;
  position: relative;

  .document-title-container {
    display: flex;
    align-items: center;
    width: fit-content;
    float: left;

    img {
      width: 12px;
      height: 14px;
    }

    span {
      margin-left: 14px;
      font-size: var(--font-size-small);
      transform: translateY(-1px);
    }
  }

  .window-controls {
    float: right;
    display: flex;
    align-items: center;
    gap: 32px;
    margin: 4px 4px 0 0;
  }

  .application-controls {
    position: absolute;
    font-size: var(--font-size-default);

    display: flex;
    align-items: center;
    gap: 28px;
    bottom: 8px;
    left: 12px;
  }
}

.note-field {
  width: 100%;
  height: calc(100% - 90px);

  textarea {
    color: inherit;
    background-color: rgba(0, 110, 255, 0.082);
    resize: none;
    width: 100%;
    height: 100%;
    border: none;
    padding: 12px 14px;

    &:focus {
      outline: none !important;
    }
  }
}

.application-bottom-bar {
  width: 100%;
  height: 26px;
  background-color: var(--dark-50);
  padding: 5px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--font-color-default);
  .ln-col {
    width: 100%;
  }

  .info-box {
    border-left: var(--border);
    padding-left: 8px;
  }

  .word-count {
    width: 130px;
  }

  .scale {
    width: 80px;
  }
}

/* .window-container {
  resize: both;
  position: fixed;
  overflow: hidden;
  background-color: var(--foreground-acrylic);
  backdrop-filter: blur(120px);
  border: var(--border);
  box-shadow: var(--box-shadow-close);
  width: 800px;
  height: 200px;
  border-radius: 4px;
} */
</style>
