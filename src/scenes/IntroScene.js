export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    console.log("📥 Cargando assets de la intro...");
    
    // Carga recursos (con fallbacks)
    try {
      this.load.image('introBg', 'assets/fondo_intro.png');
      this.load.image('playerPortrait', 'assets/Idle (32x32).png');
      this.load.audio('introMusic', 'assets/musica_intro.mp3');
    } catch (error) {
      console.log("⚠️ Algunos assets de intro no encontrados");
    }
    
    // Crear fallbacks
    this.createIntroFallbacks();
  }

  createIntroFallbacks() {
    const graphics = this.add.graphics();
    
    // Fondo de intro
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460);
    graphics.fillRect(0, 0, 1000, 600);
    graphics.generateTexture('introBgFallback', 1000, 600);
    
    graphics.destroy();
  }

  create() {
    const { width, height } = this.sys.game.config;
    
    // Fondo
    const bgTexture = this.textures.exists('introBg') ? 'introBg' : 'introBgFallback';
    this.add.image(width/2, height/2, bgTexture);

    // Música (solo si existe)
    if (this.sound.get('introMusic')) {
      this.sound.play('introMusic', { loop: true, volume: 0.3 });
    }

    // Título
    this.add.text(width/2, 80, '🔥 MODO HISTORIA 🔥', {
      fontSize: '40px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Retrato del personaje
    const portraitTexture = this.textures.exists('playerPortrait') ? 'playerPortrait' : 'ninjaFallback';
    const portrait = this.add.image(width/2, 250, portraitTexture).setScale(3);

    // Historia animada
    const lines = [
      "Era un día tranquilo en PixelTown...",
      "Pero algo terrible sucedió...",
      "¡Motocle ha sido secuestrado!",
      "Tú y tu amigo deben rescatarlo.",
      "¡Es hora de la aventura ninja!"
    ];

    let index = 0;
    const text = this.add.text(width/2, 450, '', {
      fontSize: '22px',
      color: '#fff',
      wordWrap: { width: 700 },
      align: 'center',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Mostrar primera línea inmediatamente
    text.setText(lines[0]);
    index++;

    this.time.addEvent({
      delay: 3000,
      repeat: lines.length - 2,
      callback: () => {
        if (index < lines.length) {
          text.setText(lines[index]);
          index++;
        }
      }
    });

    // Texto de continuar
    const pressText = this.add.text(width/2, 560, 'Presiona ESPACIO para comenzar la aventura', {
      fontSize: '18px',
      color: '#ff0',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: pressText,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Controles
    this.input.keyboard.once('keydown-SPACE', () => {
      this.sound.stopAll();
      this.scene.start('GameScene');
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.sound.stopAll();
      this.scene.start('MenuScene');
    });

    console.log("✅ IntroScene creada");
  }
}
