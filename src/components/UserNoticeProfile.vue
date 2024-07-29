<template>
  <div class="notice-container">
    <div class="not-logged-in-notice">
      <h1>Welcome to the profile page</h1>

      <div class="info-section">
        <h2>Login or create an account to view your profile!</h2>
        <span>
          Follow other people and see what have added to their library or share your
          achievements and anticipated releases with the community while leveling up!
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserNoticeProfileComponent',

  inject: ['accentColor']
}
</script>

<style scoped>
.notice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .not-logged-in-notice {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--dark-50);
    box-shadow:
      0px 4px 4px rgba(0, 0, 0, 0.25),
      0px 8px 11px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-m);
    border: solid v-bind(accentColor);
    border-width: 0 2px;

    height: 600px;
    width: 100%;
    padding: 12px;

    h1 {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 2px solid #565e6e4b;
      padding: 12px;
      border-radius: var(--radius-l);

      h2 {
        font-size: 18px;
        margin-bottom: 8px;
        color: rgb(189, 189, 189);
      }

      span {
        text-align: center;
      }
    }
  }
}
</style>
