<template>
  <section class="section-one">
    <div class="left">
      <h1>From forgotten text files to interactive collection.</h1>

      <span>
        Keep tabs on your games with a gamified twist. Follow games and keep track of
        their release counter.
      </span>
    </div>

    <div class="right">
      <img src="../../assets/card-splash.png" alt="card splash art" />
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
  gap: 16px;

  .left {
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

  .right {
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
    width: 150px;
    height: 150px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 50%;
    filter: blur(90px);
  }

  @media (max-width: 910px) {
    flex-direction: column-reverse;

    .left {
      width: 100%;

      h1 {
        font-size: 36px;
        line-height: unset;
      }
    }

    .right {
      height: 300px;
    }
  }
}
</style>
