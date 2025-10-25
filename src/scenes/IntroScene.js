// La intro de la historia del juego xD, falta pulirla un poco o mucho xD
export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    // Carga recursos
    this.load.image('introBg', 'assets/fondo_intro.png');
    this.load.image('playerPortrait', 'assets/player/Idle (32x32).png');
    this.load.audio('introMusic', 'assets/musica_intro.mp3');
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'introBg').setScale(1.5);

    // Música
    this.sound.play('introMusic', { loop: true, volume: 0.5 });

    // Título
    this.add.text(400, 80, '🔥 MODO HISTORIA 🔥', {
      fontSize: '40px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Imagen o retrato del personaje
    const portrait = this.add.image(400, 250, 'playerPortrait').setScale(3);

    // Historia animada
    const lines = [
      "Era un día tranquilo en PixelTown...",
      "Pero algo terrible sucedió...",
      "¡Motocle ha sido secuestrado!",
      "Tú y tu amigo deben rescatarlo.",
    ];

    let index = 0;
    const text = this.add.text(400, 450, '', {
      fontSize: '22px',
      color: '#fff',
      wordWrap: { width: 700 },
      align: 'center'
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 3000,
      repeat: lines.length - 1,
      callback: () => {
        text.setText(lines[index]);
        index++;
      }
    });

    // Texto de continuar
    const pressText = this.add.text(400, 560, 'Presiona ESPACIO para comenzar', {
      fontSize: '18px',
      color: '#ff0'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: pressText,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Iniciar juego
    this.input.keyboard.once('keydown-SPACE', () => {
      this.sound.stopAll();
      this.scene.start('GameScene');
    });
  }
}
