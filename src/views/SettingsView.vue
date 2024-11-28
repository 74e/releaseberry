<template>
  <main>
    <SettingsList
      :openSetting="openSetting"
      :settings="settings"
      :userRole="userRole"
      @changeSettingsView="changeSettingsView"
    />

    <Transition tag="div" name="fade" mode="out-in" class="setting-area">
      <component :is="openSetting" :userRole="userRole" />
    </Transition>
  </main>
</template>

<script>
import userStore from '@/state/userStore';
import UserSettings from '@/components/settingComponents/UserSettings.vue';
import AppearanceSettings from '@/components/settingComponents/AppearanceSettings.vue';
import SettingsList from '@/components/settingComponents/SettingsList.vue';
import AdminPanel from '@/components/settingComponents/AdminPanel.vue';

export default {
  name: 'SettingsView',

  components: { SettingsList, UserSettings, AppearanceSettings, AdminPanel },

  data() {
    return {
      openSetting: null,
      settings: [
        {
          label: 'My account',
          component: 'UserSettings',
          permission: ['USER', 'ADMIN']
        },
        {
          label: 'Appearance',
          component: 'AppearanceSettings',
          permission: ['USER', 'ADMIN']
        },
        {
          label: 'Admin panel',
          component: 'AdminPanel',
          permission: ['ADMIN']
        }
      ]
    };
  },

  mounted() {
    if (!userStore().user) this.$router.push('/');
  },

  computed: {
    userRole() {
      return userStore()?.user.role;
    }
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
