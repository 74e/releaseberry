<template>
  <div class="content">
    <h1 class="section-heading">User details</h1>
    <UpdateUserInfoSection class="root-section" />
    <h1 class="section-heading">Account</h1>
    <DeleteAccountSection class="root-section" />
  </div>
</template>

<script>
import UpdateUserInfoSection from './UpdateUserInfoSection.vue';
import DeleteAccountSection from './DeleteAccountSection.vue';

export default {
  name: 'UserSettings',

  components: { UpdateUserInfoSection, DeleteAccountSection },

  data() {
    return {};
  },

  computed: {},

  methods: {}
};
</script>

<style scoped>
.content {
  width: 600px;
}

.root-section {
  padding: 12px 18px;
}

.section-heading {
  font-weight: bold;
  font-size: 18px;
}
</style>
