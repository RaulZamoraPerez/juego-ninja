// =============================
//  CONFIGURACIÓN PRINCIPAL
// =============================
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

// =============================
//  VARIABLES GLOBALES
// =============================
let player, platforms, coins, bombs, cursors;
let score = 0;
let scoreText;
let gameOver = false;
let dialogText, dialogBox;


let amigo, amigoDialogBox, amigoDialogText;


const game = new Phaser.Game(config);

// =============================
//  CARGA DE ASSETS
// =============================
function preload() {
  // Fondo y plataformas
  this.load.image('sky', 'assets/fondo.png');
  this.load.image('ground', 'assets/Brown On (32x8).png');
  this.load.image('bomb', 'assets/bomb.png');

  // Sprites del jugador
  this.load.spritesheet('quieto', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('dude', 'assets/player/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('dude-jump', 'assets/player/Double Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });

  

  this.load.spritesheet('coin', 'assets/dinero/coin.png', { frameWidth: 16, frameHeight: 16 });


  //amigo
  this.load.spritesheet('amigo', 'assets/amigo/Run (32x32).png', {frameWidth: 32, frameHeight: 30})
  this.load.spritesheet('amigo-quieto', 'assets/amigo/Idle (32x32).png', {frameWidth: 32, frameHeight: 30})



  //animales
  this.load.spritesheet('gallina', 'assets/animales/gallina/Run (32x32).png', { frameWidth: 32, frameHeight: 34 });
}

// =============================
//  CREACIÓN DE OBJETOS
// =============================
function create() {


  // Fondo
  this.add.image(config.width / 2, config.height / 2, 'sky');

  // Plataformas
  platforms = this.physics.add.staticGroup();
  platforms.create(256, 568, 'ground').setScale(3).refreshBody();
  platforms.create(250, 400, 'ground');
  platforms.create(50, 300, 'ground');
  platforms.create(400, 250, 'ground');
  platforms.create(750, 150, 'ground');

  // Jugador
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // =============================
  //  ANIMACIONES DEL JUGADOR
  // =============================
  

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('quieto', { start: 0, end: 3 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'correr',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('dude-jump', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();



 //AMIGO 
 amigo = this.physics.add.sprite(player.x - 50, player.y, 'amigo');
amigo.setCollideWorldBounds(true);
amigo.setBounce(0.2);
this.physics.add.collider(amigo, platforms);

this.anims.create({
  key: 'amigo-run',
  frames: this.anims.generateFrameNumbers('amigo', { start: 0, end: 7 }), // ajusta el rango según tus frames
  frameRate: 10,
  repeat: -1
});


 
this.anims.create({
  key: 'amigo-quieto',
  frames: this.anims.generateFrameNumbers('amigo-quieto', { start: 0, end: 0 }),
  frameRate: 1,
  repeat: -1
})



//Gallina
this.anims.create({
  key: 'gallina-correr',
  frames: this.anims.generateFrameNumbers('gallina', { start: 0, end: 7 }),
  frameRate: 10,
  repeat: -1
});

// Globo de diálogo del amigo
const amigoGraphics = this.add.graphics();
amigoGraphics.fillStyle(0xffffff, 0.9);
amigoGraphics.lineStyle(2, 0x000000, 1);
amigoGraphics.fillRoundedRect(0, 0, 200, 50, 10);
amigoGraphics.strokeRoundedRect(0, 0, 200, 50, 10);

amigoDialogBox = this.add.container(amigo.x, amigo.y - 60);
amigoDialogBox.add(amigoGraphics);

amigoDialogText = this.add.text(100, 25, '', {
  fontSize: '14px',
  color: '#000',
  fontStyle: 'bold',
  wordWrap: { width: 180 }
}).setOrigin(0.5);

amigoDialogBox.add(amigoDialogText);
amigoDialogBox.setVisible(false);



  // =============================
  //  🔥 MONEDAS ANIMADAS
  // =============================
  this.anims.create({
    key: 'spin',
    frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 7 }), // ajusta según tu spritesheet
    frameRate: 10,
    repeat: -1
  });

  // Grupo de monedas
  coins = this.physics.add.group({
    key: 'coin',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  coins.children.iterate(coin => {
    coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    coin.play('spin'); // animación de giro
  });

  this.physics.add.collider(coins, platforms);
  this.physics.add.overlap(player, coins, collectCoin, null, this);

  // =============================
  //  PUNTUACIÓN
  // =============================
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: 'white'
  });

  // =============================
  //  BOMBAS (ENEMIGOS)
  // =============================
  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);

  // =============================
  //  GLOBO DE DIÁLOGO
  // =============================
  const graphics = this.add.graphics();
  graphics.fillStyle(0xffffff, 0.9);
  graphics.lineStyle(2, 0x000000, 1);
  graphics.fillRoundedRect(0, 0, 120, 40, 10);
  graphics.strokeRoundedRect(0, 0, 120, 40, 10);

  dialogBox = this.add.container(player.x, player.y - 60);
  dialogBox.add(graphics);

  dialogText = this.add.text(60, 20, 'Hola amigos', {
    fontSize: '16px',
    color: '#000',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  dialogBox.add(dialogText);
  dialogBox.setVisible(false);


  showAmigoDialog(this, '¡Han secuestrado a Motocle! Ayúdanos a encontrarlo xdxd', 5000);



  // Tecla P para voltereta
  this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

  
}

// =============================
//  MOSTRAR DIÁLOGO
// =============================
function showDialog(scene, message) {
  dialogText.setText(message);
  dialogBox.setVisible(true);
  scene.time.delayedCall(2000, () => {
    dialogBox.setVisible(false);
  });
}


function showAmigoDialog(scene, message, duration = 3000) {
  amigoDialogText.setText(message);
  amigoDialogBox.setVisible(true);

  scene.time.delayedCall(duration, () => {
    amigoDialogBox.setVisible(false);
  });
}


// =============================
//  ACTUALIZACIÓN CONSTANTE
// =============================
function update() {
  if (gameOver) return;

  // Movimiento lateral de jugador 
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('correr', true);
      player.setFlipX(true);  // Voltear sprite a la izquierda
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('correr', true);
    player.setFlipX(false);  // Voltear sprite a la derecha
  } else {
    player.setVelocityX(0);
    player.anims.play('idle', true);
  }

  // Salto
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
    player.anims.play('jump', true);

      // 🐾 Amigo salta también
  if (amigo.body.touching.down) {
    amigo.setVelocityY(-330);
  }
  }

  
  // Mostrar diálogo con ESPACIO
  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    showDialog(this, '¡salchicha!');
  }

  // Seguir al jugador con el globo
  if (dialogBox.visible) {
    dialogBox.setPosition(player.x, player.y - 60);
  }




  // =============================
//  MOVIMIENTO DEL AMIGO
// =============================

// =============================
// MOVIMIENTO INTELIGENTE DEL AMIGO
// =============================
const diffX = player.x - amigo.x;
const diffY = player.y - amigo.y;
const velocidad = 120;
const distanciaMinima = 50;

if (Math.abs(diffX) > distanciaMinima) {
  // Mover horizontal
  if (diffX > 0) { //
    amigo.setVelocityX(velocidad); // mover a la derecha
    amigo.setFlipX(false);
  } else {
    amigo.setVelocityX(-velocidad); // mover a la izquierda
    amigo.setFlipX(true); 
  }
  amigo.anims.play('amigo-run', true); 

  // Saltar solo si es necesario para subir plataformas alcanzables
  if (diffY < -20 && amigo.body.touching.down) {
    const puedeSubir = platforms.getChildren().some(p => {
      const bounds = p.getBounds();
      return Phaser.Geom.Rectangle.Contains(bounds, amigo.x + (diffX > 0 ? 16 : -16), amigo.y + 32);
    });
    if (puedeSubir) {
      amigo.setVelocityY(-250); // salto controlado
    }
  }

} else {
  amigo.setVelocityX(0);
  amigo.anims.play('amigo-quieto', true);
}

// =============================
// ACTUALIZAR POSICIÓN DEL DIÁLOGO
// =============================
if (amigoDialogBox.visible) {
  amigoDialogBox.setPosition(amigo.x, amigo.y - 60);
}


// 🔹 Voltereta al presionar P
if (Phaser.Input.Keyboard.JustDown(this.keyP) && player.body.touching.down) {
  player.setVelocityY(-150); // salto más alto
  player.anims.play('jump', true);

  // Pequeño giro visual en el aire (rotación completa)
  this.tweens.add({
    targets: player,
    angle: 360,
    duration: 600,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      player.angle = 0; // restaurar
      player.anims.play('idle', true);
    }
  });
}



}

// =============================
//  RECOLECTAR MONEDA
// =============================
function collectCoin(player, coin) {
  coin.disableBody(true, true);
  score += 100;
  scoreText.setText(`Score: ${score}`);

  // Si ya no hay monedas activas, reiniciar y agregar bomba
  if (coins.countActive(true) === 0) {
    coins.children.iterate(child => {
      child.enableBody(true, child.x, 0, true, true);
      child.play('spin');
    });

    const x = player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);

      //
    
    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
 

}

// =============================
//  COLISIÓN CON BOMBA
// =============================
function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  gameOver = true;

  this.add.text(300, 250, 'GAME OVER', {
    fontSize: '48px',
    fill: '#ff0000'
  });
}
