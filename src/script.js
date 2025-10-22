

// Configuración principal del juego
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {     //fisicas sjjs
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

// Variables globales del juego
let player;
let platforms;
let stars;
let bombs;
let cursors;
let score = 0;
let scoreText;
let gameOver = false;

// Inicializa el juego
const game = new Phaser.Game(config);

function preload() {                         //--- donde se cargan los assets --
  // Cargar imágenes y sprites
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('quieto', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });//quieto
  this.load.spritesheet('dude', 'assets/player/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });//derecha
  this.load.spritesheet('dude-reverse', 'assets/player/Wall Jump (32x32).png', { frameWidth: 32, frameHeight: 32 }); //izquierda

  this.load.spritesheet('dude-jump', 'assets/player/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 }); //salto

  
}

function create() {    // --- donde se crean los objetos del juego --
  // Fondo
  this.add.image(400, 300, 'sky');

  // Plataformas estáticas
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Jugador
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //------------------------- Animaciones del jugador  XD-----------------------
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude-reverse', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  


  this.anims.create({ //quieto
    key: 'idle',
    frames: this.anims.generateFrameNumbers('quieto', { start: 0, end: 3 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });


  this.anims.create({ //salto
    key: 'jump',
    frames: this.anims.generateFrameNumbers('dude-jump', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  // Colisión entre jugador y plataformas
  this.physics.add.collider(player, platforms);

  // Controles de teclado
  cursors = this.input.keyboard.createCursorKeys();

  //-------------------------------------------- Estrellas (coleccionables)------
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(star => {
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // -------------------------------------------Texto de puntuación
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  // Bombas (enemigos)
  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);







}

function update()  { //--- lógica del juego que se ejecuta en cada frame --
   if (gameOver) return;

  // Movimiento horizontal
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('idle', true);
    
  }

  // Salto
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
    player.anims.play('jump', true);

  }
}

function collectStar(player, star) { //--- lógica al recolectar una estrella --
  star.disableBody(true, true);
  score += 100;
  scoreText.setText(`Score: ${score}`);

  // Si todas las estrellas se recolectan
  if (stars.countActive(true) === 0) {
    stars.children.iterate(child => {
      child.enableBody(true, child.x, 0, true, true);
    });

    // Generar una nueva bomba
    const x = player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);

    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }

  
}

function hitBomb(player, bomb) { //--- lógica al chocar con una bomba --
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;

  // Texto de fin de juego
  this.add.text(300, 250, 'GAME OVER', {
    fontSize: '48px',
    fill: '#ff0000'
  });
}




