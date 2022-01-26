const scene = {
  startScreen: function () {
    let intro = document.getElementById("start-screen");
    intro.style.width = `${CONFIG.width}px`;
    intro.style.height = `${CONFIG.height}px`;
    document.getElementById("start-game").onclick = () => {
      intro.style.display = "none";
      canvas.style.display = "block";
      init();
    };
  },

  game: function () {
    init();
  },

  endScreen: function () {
    context.resetTransform();
    context.clearRect(0, 0, CONFIG.width, CONFIG.height);
    gameObjects = [];
    tiles = [];
    collectibles = [];
    projectiles = [];
    badprojectiles = [];
    enemies = [];

    let outro = document.getElementById("end-screen");
    outro.style.width = `${CONFIG.width}px`;
    outro.style.height = `${CONFIG.height}px`;

    canvas.style.display = "none";
    outro.style.display = "block";
  },
};

export default scene;
