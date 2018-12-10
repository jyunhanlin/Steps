<template>
  <div>
    <div class="about">
      <header class="about__header">
        關於Steps
      </header>
      <main class="about__main">
        <p>
          Steps是一個輕量化的目標管理工具，讓你輕鬆的紀錄與管理每天的工作項目。
          我們盡量將功能做的簡單直覺，因為我們每天的工作已經如此繁瑣，管理工具應該簡單點。<br><br>
          Steps的主要功能與操作如下：<br>
          <ul>
            <li>- 新增事項：利用快捷鍵(alt+n)或點擊綠色加號</li>
            <li>- 編輯事項：點擊您想編輯的事項</li>
            <li>- 刪除事項：將滑鼠滑到該事項上，然後點擊右邊的刪除</li>
            <li>- 改變事項順序：點擊事項清單右上角的圖示，切換為拖動模式</li>
          </ul>
          <br>
          Steps是一個不斷精進的項目。您在使用的當下，我們也正在規劃、開發新功能。如果您對Steps有任何的改善建議（或許願想要什麼功能），請在改善與建議告訴我們。<br><br>
          最後，Steps是一個志願性質的項目，參與的人員羅列如下。很感謝所有對這個項目持續付出的人們：
          <ul>
            <li>- <a href="https://www.linkedin.com/in/iancheng0323/">鄭斐凡</a></li>
            <li>- <a href="https://github.com/jyunhanlin">林均翰</a></li>
          </ul>
        </p>
        <h2>Credits:</h2>
        <p>
          <img src="../assets/stairs.png" alt="" style="margin-right:1rem">
          <img src="../assets/shuffle_light.png" alt="" style="margin-right:1rem">
          <img src="../assets/shuffle_dark.png" alt="">
          <div>
            Icons made by
            <a href="https://www.freepik.com/" title="Freepik">Freepik</a>
            from
            <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
            is licensed by
            <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
          </div>
          <img src="../assets/menu.png" alt="">
          <div>
            Icons made by
            <a href="https://www.flaticon.com/authors/chris-veigt" title="Chris Veigt">Chris Veigt</a>
            from
            <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
            is licensed by
            <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
          </div>
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
    p{
      font-size:1.4rem;
    }
    h2{
      margin-top:1rem;
    }
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

