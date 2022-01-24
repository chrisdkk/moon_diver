const Scene = {
  startScreen() {
    let image = new Image();
    image.src = "./assets/Start_screen.png";

    context.drawImage(image, 0, 0);
  },
};

export default Scene;
