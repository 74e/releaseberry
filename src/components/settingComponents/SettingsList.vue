<template>
  <ul class="settings-list">
    <li
      v-for="setting in settings"
      :key="setting.component"
      @click="changeSettingsView(setting.component)"
      :class="['settings-item', { active: openSetting == setting.component }]"
    >
      {{ setting.label }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SettingsList',

  props: ['openSetting', 'settings'],

  mounted() {
    this.changeSettingsView(this.settings[0].component);
  },

  methods: {
    changeSettingsView(setting) {
      this.$emit('changeSettingsView', setting);
    }
  }
};
</script>

<style scoped>
.settings-list {
  height: 100%;
  min-width: 170px;
  border-right: 2px solid rgba(var(--accentColor), 0.44);
  padding: 12px 16px;
  list-style-type: none;

  .settings-item {
    margin-bottom: 6px;
    padding: 4px 16px;
    border-radius: 4px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
    outline: 1px solid rgba(255, 255, 255, 0);
    cursor: pointer;
    transition: all 0.2s ease-in;

    &:hover {
      color: rgba(255, 255, 255, 0.7);
      background-color: rgba(255, 255, 255, 0.06) !important;
      outline: 1px solid rgba(255, 255, 255, 0.2);
    }

    &.active {
      color: rgba(255, 255, 255, 0.75);
      position: relative;
      background-color: rgba(255, 255, 255, 0.03);
      &::before {
        content: '';
        display: block;
        position: absolute;
        transform: translateY(-50%);
        left: 0;
        top: 50%;
        width: 3px;
        height: 70%;
        background-color: rgba(var(--accentColor));
        border-radius: 2px;
      }
    }
  }
}
</style>
