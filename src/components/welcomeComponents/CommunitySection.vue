<template>
  <section class="section-one">
    <div class="left">
      <img src="../../assets/feature-demo-3.png" alt="card splash art" />
    </div>

    <div class="right">
      <h1>Collect Experience, Level up, Unlock Achievements</h1>

      <span>
        Unlock achievements to gain experience. Released games in your library let you
        collect accumulated experience that built up from the moment they are added to
        your library.
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
  gap: 76px;

  .right {
    width: 60%;
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
    width: 40%;
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
