<template>
  <div>
    <div class="about">
      <header class="about__header">
        關於Steps
      </header>
      <main class="about__main">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ab culpa praesentium id aspernatur perspiciatis quis non voluptatem neque delectus officia excepturi quae laboriosam iusto nisi laborum, vero natus. Vel.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos iusto distinctio vero voluptatibus ut cupiditate, quidem adipisci praesentium. Quae numquam incidunt itaque ad dolorem nisi, eum impedit adipisci illum error?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia alias asperiores recusandae temporibus nemo et, sed consequatur ad? Consequatur hic dolores corrupti voluptate quidem a minus minima quaerat non deserunt?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus, illo officia explicabo odit consequatur ipsum aspernatur consequuntur est voluptatum consectetur officiis numquam ducimus sint ea necessitatibus nisi impedit praesentium.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt excepturi laboriosam nulla expedita libero asperiores obcaecati nesciunt? Totam ea earum libero in eligendi ratione autem laboriosam sunt, consequatur placeat asperiores?
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni, ut sunt voluptate corrupti cum ipsum ipsam vel architecto aperiam culpa eum deleniti suscipit unde praesentium hic rem molestiae maiores quos.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda debitis sunt nesciunt, distinctio quidem eum! Repudiandae modi qui sed atque nisi eveniet praesentium alias? Dolorum quia placeat corporis est veritatis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil fugiat, dolor totam quibusdam nostrum cum optio? Culpa enim magni illum labore a mollitia voluptates, quas facilis dicta eaque nihil!
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum nihil velit ducimus nobis repudiandae inventore? Pariatur, aut cupiditate consequatur exercitationem dolores ducimus. Blanditiis, quidem non est nisi illo eos? Magnam.
        </p>
      </main>
      <footer class="about__footer">
        <button class="about__btn" @click="$emit('close')">關閉</button>
      </footer>
    </div>
    <div class="backdrop" @click="$emit('close')"></div>
  </div>
</template>

<style lang="scss">
.about {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40rem;
  height: 40rem;
  z-index: 100;
  background-color: #fff;
  padding: 2rem 3rem;

  &__header {
    font-size: 2rem;
  }

  &__main {
    height: 30rem;
    overflow: auto;
    margin: 1rem 0;
  }

  &__footer {
    text-align: center;
  }

  &__btn {
    border: none;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(#D8D8D8, .7);
  z-index: 90;
}
</style>

