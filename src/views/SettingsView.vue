<template>
  <main>
    <SettingsList
      :openSetting="openSetting"
      :settings="settings"
      @changeSettingsView="changeSettingsView"
    />

    <Transition tag="div" name="fade" mode="out-in" class="setting-area">
      <component :is="openSetting" />
    </Transition>
  </main>
</template>

<script>
import userStore from '@/state/userStore';
import UserSettings from '@/components/settingComponents/UserSettings.vue';
import AppearanceSettings from '@/components/settingComponents/AppearanceSettings.vue';
import SettingsList from '@/components/settingComponents/SettingsList.vue';

export default {
  name: 'SettingsView',

  components: { SettingsList, UserSettings, AppearanceSettings },

  data() {
    return {
      openSetting: null,
      settings: [
        { label: 'My account', component: 'UserSettings' },
        { label: 'Appearance', component: 'AppearanceSettings' }
      ]
    };
  },

  mounted() {
    if (!userStore().user) this.$router.push('/');
  },

  methods: {
    changeSettingsView(setting) {
      this.openSetting = setting;
    }
  }
};
</script>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  padding: 40px;
  margin: auto;
  backdrop-filter: blur(35px);
  background-color: var(--dark-30);
  display: flex;

  @media (max-width: 500px) {
    padding: 16px;
  }
}

.setting-area {
  padding: 12px 24px;
}
</style>
