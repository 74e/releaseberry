<template>
  <section class="section-one">
    <div class="left">
      <img src="../../assets/feature-demo-1.png" alt="card splash art" />
    </div>

    <div class="right">
      <h1>Powered by Steam.</h1>

      <span>
        Search through the vast selection of the Steam store. Select your game and add it
        to Release Berries library. All the latest information about the game will be
        available to you.
      </span>
    </div>
  </section>
</template>

<style scoped>
.section-one {
  max-width: 1025px;
  margin: auto;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 46px;

  .right {
    width: 50%;
    h1 {
      color: var(--accent);
      font-size: 50px;
      line-height: 55px;
      margin-bottom: 8px;
    }

    span {
      font-size: 20px;
      color: rgb(184, 184, 184);
    }
  }

  .left {
    position: relative;
    z-index: 1;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &::after {
    content: '';
    display: block;
    background-color: var(--accent);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 10%;
    filter: blur(120px);
  }

  @media (max-width: 910px) {
    flex-direction: column;

    gap: 16px;

    .right {
      width: 100%;

      h1 {
        font-size: 36px;
        line-height: unset;
      }
    }

    .left {
      height: 200px;
    }
  }
}
</style>
