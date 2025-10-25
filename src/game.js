// =============================
//  SCENE: MENU PRINCIPAL
// =============================
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Crear assets básicos si no existen
        this.load.on('loaderror', () => {
            console.log('🔄 Creando assets de respaldo...');
        });

        // Intentar cargar assets del menú
        this.load.image('menuBg', 'assets/menu/background.png');
        this.load.image('playButton', 'assets/menu/buttons/play.png');
        
        // Assets del juego
        this.load.image('sky', 'assets/fondo.png');
        this.load.spritesheet('ninja-idle', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        console.log('🎮 MenuScene iniciado');
        
        const { width, height } = this.sys.game.config;

        // Fondo del menú
        if (this.textures.exists('menuBg')) {
            this.add.image(width/2, height/2, 'menuBg').setDisplaySize(width, height);
        } else {
            // Fondo de respaldo
            const bg = this.add.graphics();
            bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
            bg.fillRect(0, 0, width, height);
        }

        // Título
        const title = this.add.text(width/2, 120, '🥷 NINJA RESCUE', {
            fontSize: '48px',
            color: '#ff6b6b',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const subtitle = this.add.text(width/2, 170, 'LA AVENTURA DE MOTOCLE', {
            fontSize: '20px',
            color: '#ffd93d',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Botones
        this.createMenuButtons();

        // Animaciones del título
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // Controles
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    }

    createMenuButtons() {
        const { width } = this.sys.game.config;

        // Botón JUGAR
        const playBtn = this.add.rectangle(width/2, 280, 200, 60, 0x4ecdc4);
        playBtn.setStrokeStyle(3, 0xffffff);
        const playText = this.add.text(width/2, 280, '🎮 JUGAR', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        playBtn.setInteractive();
        playBtn.on('pointerover', () => {
            playBtn.setFillStyle(0x45b7d1);
            this.tweens.add({ targets: playBtn, scaleX: 1.1, scaleY: 1.1, duration: 150 });
        });
        playBtn.on('pointerout', () => {
            playBtn.setFillStyle(0x4ecdc4);
            this.tweens.add({ targets: playBtn, scaleX: 1, scaleY: 1, duration: 150 });
        });
        playBtn.on('pointerdown', () => this.startGame());

        // Botón HISTORIA
        const storyBtn = this.add.rectangle(width/2, 360, 200, 60, 0x45b7d1);
        storyBtn.setStrokeStyle(3, 0xffffff);
        const storyText = this.add.text(width/2, 360, '📖 HISTORIA', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        storyBtn.setInteractive();
        storyBtn.on('pointerdown', () => this.showStory());

        // Botón SALIR
        const exitBtn = this.add.rectangle(width/2, 440, 200, 60, 0xe74c3c);
        exitBtn.setStrokeStyle(3, 0xffffff);
        const exitText = this.add.text(width/2, 440, '🚪 SALIR', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        exitBtn.setInteractive();
        exitBtn.on('pointerdown', () => this.exitGame());

        // Instrucciones
        this.add.text(width/2, 520, 'CONTROLES: WASD/Flechas = Mover | J = Atacar | SPACE = Saltar', {
            fontSize: '14px',
            color: '#ffffff',
            alpha: 0.8
        }).setOrigin(0.5);
    }

    startGame() {
        console.log('🚀 Iniciando juego...');
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }

    showStory() {
        this.scene.start('IntroScene');
    }

    exitGame() {
        this.add.text(400, 500, '👋 ¡Gracias por jugar!', {
            fontSize: '24px',
            color: '#ffd93d'
        }).setOrigin(0.5);
    }
}

// =============================
//  SCENE: INTRO/HISTORIA
// =============================
class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Fondo
        const bg = this.add.graphics();
        bg.fillStyle(0x2c3e50);
        bg.fillRect(0, 0, width, height);

        // Historia
        const story = [
            '🏰 En un reino lejano...',
            '👑 La princesa Motocle ha sido secuestrada',
            '🥷 Solo un valiente ninja puede rescatarla',
            '⚔️ ¡Prepárate para la aventura!',
            '',
            '🎮 Presiona ENTER para comenzar'
        ];

        story.forEach((line, index) => {
            this.add.text(width/2, 150 + (index * 50), line, {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 2
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: this.add.text(width/2, 150 + (index * 50), line, {
                    fontSize: '24px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000',
                    strokeThickness: 2
                }).setOrigin(0.5),
                alpha: 1,
                duration: 1000,
                delay: index * 800
            });
        });

        // Controles
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // Auto-avanzar después de mostrar toda la historia
        this.time.delayedCall(8000, () => {
            this.scene.start('GameScene');
        });
    }
}

// =============================
//  SCENE: JUEGO PRINCIPAL
// =============================
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Estado del juego
        this.gameState = {
            score: 0,
            health: 100,
            maxHealth: 100,
            lives: 3,
            level: 1,
            coinsCollected: 0,
            totalCoins: 0,
            enemiesKilled: 0
        };
        
        // Controles de habilidades
        this.canAttack = true;
        this.canDash = true;
        this.isGamePaused = false;
    }

    preload() {
        console.log('🎮 Cargando GameScene...');

        // Manejo de errores de carga
        this.load.on('loaderror', (file) => {
            console.log(`❌ Error cargando: ${file.src}`);
        });

        this.load.on('complete', () => {
            console.log('✅ Carga completada');
        });

        try {
            // === FONDOS ===
            this.load.image('sky', 'assets/fondo.png');
            this.load.image('ground', 'assets/Brown On (32x8).png');
            

              //motocle 
            this.load.spritesheet('moto-run', 'assets/motocle/Motocle.png', { frameWidth: 290, frameHeight: 287 });
            this.load.spritesheet('moto-idle', 'assets/motocle/motocle_quieto.png', { frameWidth: 215, frameHeight: 287 });


            // === JUGADOR ===
            this.load.spritesheet('ninja-idle', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('ninja-run', 'assets/player/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('ninja-jump', 'assets/player/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
            
            // === COMPAÑERO ===
            this.load.spritesheet('amigo-idle', 'assets/amigo/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('amigo-run', 'assets/amigo/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
            
            // === ITEMS ===
            this.load.spritesheet('coin', 'assets/dinero/coin.png', { frameWidth: 16, frameHeight: 16 });
            this.load.image('apple', 'assets/items/apple.png');
            
            // === ENEMIGOS ===
            this.load.spritesheet('pig-idle', 'assets/animales/AgryPig/Idle(36x30).png', { frameWidth: 36, frameHeight: 30 });
            this.load.spritesheet('pig-run', 'assets/animales/AgryPig/Run(36x30).png', { frameWidth: 36, frameHeight: 30 });
            this.load.spritesheet('gallina-run', 'assets/animales/gallina/Run (32x34).png', { frameWidth: 32, frameHeight: 34 });

        } catch (error) {
            console.log('❌ Error en preload:', error);
            this.createFallbackAssets();
        }
    }

    createFallbackAssets() {
        console.log('🔧 Creando assets de respaldo...');
        
        // Crear texturas básicas como respaldo
        this.add.graphics().fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98).fillRect(0, 0, 800, 600).generateTexture('sky', 800, 600);
        this.add.graphics().fillStyle(0x8B4513).fillRect(0, 0, 64, 32).generateTexture('ground', 64, 32);
        this.add.graphics().fillStyle(0x3498DB).fillRect(0, 0, 32, 32).generateTexture('ninja-idle', 32, 32);
        this.add.graphics().fillStyle(0x2ECC71).fillRect(0, 0, 32, 32).generateTexture('amigo-idle', 32, 32);
        this.add.graphics().fillStyle(0xF1C40F).fillRect(0, 0, 16, 16).generateTexture('coin', 16, 16);
        this.add.graphics().fillStyle(0xE74C3C).fillRect(0, 0, 32, 32).generateTexture('gallina-run', 32, 32);
        this.add.graphics().fillStyle(0xFF69B4).fillRect(0, 0, 36, 30).generateTexture('pig-idle', 36, 30);
        this.add.graphics().fillStyle(0xFFA500).fillCircle(16, 16, 16).generateTexture('apple', 32, 32);
        
        console.log('✅ Assets de respaldo creados');
    }

    create() {
        console.log('🚀 Creando GameScene...');
        
        const { width, height } = this.sys.game.config;
        
        // Configurar mundo
        const worldWidth = width * 2.5;
        const worldHeight = height;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        
        // === CREAR ELEMENTOS DEL JUEGO ===
        this.createBackground(worldWidth, worldHeight);
        this.createPlatforms(worldWidth, worldHeight);
        this.createAnimations();
        this.createPlayer();
        this.createCompanion();
        this.createCoins(worldWidth, worldHeight);
        this.createEnemies(worldWidth, worldHeight);
        this.createItems(worldWidth, worldHeight);
        this.setupControls();
        this.setupPhysics();
        this.createUI();
        this.setupCamera(worldWidth, worldHeight);
        this.createMenuButton();
        
        console.log('✅ GameScene creado exitosamente');
              // Crear animación de correr
        // Animación de idle
// Crear animaciones (una sola vez)
this.anims.create({
    key: 'moto-idle',
    frames: this.anims.generateFrameNumbers('moto-idle', { start: 1, end: 2 }),
    frameRate: 1,
    repeat: -1
});

this.anims.create({
    key: 'moto-run',
    frames: this.anims.generateFrameNumbers('moto-run', { start: 0, end: 2 }),
    frameRate: 6,
    repeat: -1
});

// Crear la moto (solo una vez)
this.moto = this.physics.add.sprite(100, 450, 'moto-idle');

//colisiones

this.physics.add.collider(this.moto, this.platforms);

this.moto.setCollideWorldBounds(true);
this.moto.setBounce(0.2);
this.moto.setScale(0.3); // o 0.2 según se vea bien


}

    createBackground(worldWidth, worldHeight) {
        if (this.textures.exists('sky')) {
            console.log('✅ Usando fondo personalizado');
            const bg = this.add.image(0, 0, 'sky');
            bg.setOrigin(0, 0);
            bg.setDisplaySize(worldWidth, worldHeight);
        } else {
            console.log('⚠️ Usando fondo de respaldo');
            const bg = this.add.graphics();
            bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98, 1);
            bg.fillRect(0, 0, worldWidth, worldHeight);
        }
        
        // Elementos decorativos
        this.add.text(worldWidth/2, 100, '🏰 RESCATA A MOTOCLE 🏰', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    createPlatforms(worldWidth, worldHeight) {
        this.platforms = this.physics.add.staticGroup();
        
        // Suelo principal
        const groundY = worldHeight - 32;
        for (let i = 0; i < Math.ceil(worldWidth / 64) + 2; i++) {
            this.platforms.create(i * 64, groundY, 'ground');
        }
        
        // Plataformas flotantes
        const platformData = [
            { x: 200, y: groundY - 120 },
            { x: 400, y: groundY - 180 },
            { x: 600, y: groundY - 100 },
            { x: 800, y: groundY - 200 },
            { x: 1000, y: groundY - 140 },
            { x: 1200, y: groundY - 160 },
            { x: 1400, y: groundY - 220 },
            { x: 1600, y: groundY - 120 },
            { x: 1800, y: groundY - 180 }
        ];
        
        platformData.forEach(platform => {
            if (platform.x < worldWidth) {
                this.platforms.create(platform.x, platform.y, 'ground');
            }
        });
        
        console.log('✅ Plataformas creadas');
    }

    createAnimations() {
        // Animaciones del ninja
        if (this.textures.exists('ninja-idle') && !this.anims.exists('ninja-idle')) {
            this.anims.create({
                key: 'ninja-idle',
                frames: this.anims.generateFrameNumbers('ninja-idle', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (this.textures.exists('ninja-run') && !this.anims.exists('ninja-run')) {
            this.anims.create({
                key: 'ninja-run',
                frames: this.anims.generateFrameNumbers('ninja-run', { start: 0, end: 7 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (this.textures.exists('ninja-jump') && !this.anims.exists('ninja-jump')) {
            this.anims.create({
                key: 'ninja-jump',
                frames: this.anims.generateFrameNumbers('ninja-jump', { start: 0, end: 0 }),
                frameRate: 1
            });
        }

        // Animaciones del amigo
        if (this.textures.exists('amigo-idle') && !this.anims.exists('amigo-idle')) {
            this.anims.create({
                key: 'amigo-idle',
                frames: this.anims.generateFrameNumbers('amigo-idle', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
        }

        if (this.textures.exists('amigo-run') && !this.anims.exists('amigo-run')) {
            this.anims.create({
                key: 'amigo-run',
                frames: this.anims.generateFrameNumbers('amigo-run', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Animación de monedas
        if (this.textures.exists('coin') && !this.anims.exists('coin-spin')) {
            this.anims.create({
                key: 'coin-spin',
                frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Animaciones de enemigos
        if (this.textures.exists('gallina-run') && !this.anims.exists('gallina-run')) {
            this.anims.create({
                key: 'gallina-run',
                frames: this.anims.generateFrameNumbers('gallina-run', { start: 0, end: 13 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (this.textures.exists('pig-idle') && !this.anims.exists('pig-idle')) {
            this.anims.create({
                key: 'pig-idle',
                frames: this.anims.generateFrameNumbers('pig-idle', { start: 0, end: 10 }),
                frameRate: 8,
                repeat: -1
            });
        }

        console.log('✅ Animaciones creadas');
    }

    createPlayer() {
        const { height } = this.sys.game.config;
        
        this.player = this.physics.add.sprite(100, height - 100, 'ninja-idle');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(2); // Hacer el ninja más grande
        
        // Stats del jugador
        this.player.health = this.gameState.maxHealth;
        this.player.isInvulnerable = false;
        this.player.isDashing = false;
        
        // Animación inicial
        if (this.anims.exists('ninja-idle')) {
            this.player.anims.play('ninja-idle', true);
        }
        
        console.log('✅ Jugador creado');
    }

    createCompanion() {
        const { height } = this.sys.game.config;
        
        this.companion = this.physics.add.sprite(50, height - 100, 'amigo-idle');
        this.companion.setBounce(0.2);
        this.companion.setCollideWorldBounds(true);
        this.companion.setScale(1.8);
        
        if (this.anims.exists('amigo-idle')) {
            this.companion.anims.play('amigo-idle', true);
        }
        
        console.log('✅ Compañero creado');
    }

    createCoins(worldWidth, worldHeight) {
        this.coins = this.physics.add.group();
        
        const coinPositions = [
            { x: 180, y: worldHeight - 200 },
            { x: 280, y: worldHeight - 120 },
            { x: 380, y: worldHeight - 250 },
            { x: 480, y: worldHeight - 160 },
            { x: 680, y: worldHeight - 180 },
            { x: 780, y: worldHeight - 100 },
            { x: 880, y: worldHeight - 280 },
            { x: 1080, y: worldHeight - 200 },
            { x: 1180, y: worldHeight - 140 },
            { x: 1280, y: worldHeight - 240 },
            { x: 1480, y: worldHeight - 180 },
            { x: 1580, y: worldHeight - 300 },
            { x: 1680, y: worldHeight - 160 },
            { x: 1780, y: worldHeight - 120 },
            { x: 1880, y: worldHeight - 260 }
        ];

        coinPositions.forEach(pos => {
            if (pos.x < worldWidth) {
                const coin = this.coins.create(pos.x, pos.y, 'coin');
                coin.setBounceY(0.4);
                coin.setScale(2);
                
                if (this.anims.exists('coin-spin')) {
                    coin.anims.play('coin-spin', true);
                } else {
                    this.tweens.add({
                        targets: coin,
                        rotation: Math.PI * 2,
                        duration: 2000,
                        repeat: -1
                    });
                }
            }
        });
        
        this.gameState.totalCoins = this.coins.children.size;
        console.log(`✅ ${this.gameState.totalCoins} monedas creadas`);
    }

    createEnemies(worldWidth, worldHeight) {
        this.enemies = this.physics.add.group();
        
        const enemyPositions = [
            { x: 350, y: worldHeight - 80, type: 'gallina' },
            { x: 750, y: worldHeight - 80, type: 'gallina' },
            { x: 1150, y: worldHeight - 80, type: 'pig' },
            { x: 1550, y: worldHeight - 80, type: 'gallina' },
            { x: 1850, y: worldHeight - 80, type: 'pig' }
        ];
        
        enemyPositions.forEach(pos => {
            if (pos.x < worldWidth) {
                let enemy;
                
                if (pos.type === 'gallina') {
                    enemy = this.enemies.create(pos.x, pos.y, 'gallina-run');
                    enemy.setBounce(1);
                    enemy.setCollideWorldBounds(true);
                    enemy.setVelocity(Phaser.Math.Between(-120, 120), 20);
                    enemy.setScale(1.5);
                    enemy.health = 30;
                    enemy.maxHealth = 30;
                    enemy.damage = 15;
                    enemy.enemyType = 'gallina';
                    enemy.scoreValue = 100;
                    
                    if (this.anims.exists('gallina-run')) {
                        enemy.anims.play('gallina-run', true);
                    }
                } else if (pos.type === 'pig') {
                    enemy = this.enemies.create(pos.x, pos.y, 'pig-idle');
                    enemy.setBounce(0.8);
                    enemy.setCollideWorldBounds(true);
                    enemy.setVelocity(Phaser.Math.Between(-80, 80), 20);
                    enemy.setScale(1.5);
                    enemy.health = 50;
                    enemy.maxHealth = 50;
                    enemy.damage = 20;
                    enemy.enemyType = 'pig';
                    enemy.scoreValue = 150;
                    
                    if (this.anims.exists('pig-idle')) {
                        enemy.anims.play('pig-idle', true);
                    }
                }
            }
        });
        
        console.log(`✅ ${this.enemies.children.size} enemigos creados`);
    }

    createItems(worldWidth, worldHeight) {
        this.items = this.physics.add.group();
        
        // Crear manzanas para curar
        const itemPositions = [
            { x: 300, y: worldHeight - 200, type: 'health' },
            { x: 700, y: worldHeight - 150, type: 'health' },
            { x: 1100, y: worldHeight - 200, type: 'health' },
            { x: 1500, y: worldHeight - 180, type: 'health' }
        ];
        
        itemPositions.forEach(pos => {
            if (pos.x < worldWidth && pos.type === 'health') {
                const apple = this.items.create(pos.x, pos.y, 'apple');
                apple.setBounce(0.6);
                apple.setScale(1.5);
                apple.itemType = 'health';
                apple.healAmount = 25;
            }
        });
        
        console.log('✅ Items creados');
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.keys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D'),
            J: this.input.keyboard.addKey('J'),
            K: this.input.keyboard.addKey('K'),
            Q: this.input.keyboard.addKey('Q'),
            SPACE: this.input.keyboard.addKey('SPACE'),
            SHIFT: this.input.keyboard.addKey('SHIFT'),
            ESC: this.input.keyboard.addKey('ESC')
        };

        // Click para atacar
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.performAttack();
            }
        });
        
        console.log('✅ Controles configurados');
    }

    setupPhysics() {
        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.companion, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.items, this.platforms);
        this.physics.add.collider(this.enemies, this.enemies);

        // Interacciones
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitByEnemy, null, this);
        
        console.log('✅ Físicas configuradas');
    }

    createUI() {
        // UI del juego
        this.scoreText = this.add.text(20, 20, 'Puntuación: 0', {
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#000000',
            padding: 8
        }).setScrollFactor(0).setDepth(1000);

        this.healthText = this.add.text(20, 60, 'Vida: 100/100', {
            fontSize: '20px',
            color: '#2ecc71',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#000000',
            padding: 8
        }).setScrollFactor(0).setDepth(1000);

        this.coinsText = this.add.text(20, 100, `Monedas: 0/${this.gameState.totalCoins}`, {
            fontSize: '20px',
            color: '#f1c40f',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#000000',
            padding: 8
        }).setScrollFactor(0).setDepth(1000);

        this.levelText = this.add.text(20, 140, 'Nivel: 1', {
            fontSize: '20px',
            color: '#9b59b6',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#000000',
            padding: 8
        }).setScrollFactor(0).setDepth(1000);

        // Barra de vida visual
        this.createHealthBar();
        
        console.log('✅ UI creada');
    }

    createHealthBar() {
        const { width } = this.sys.game.config;
        
        // Fondo de la barra
        this.healthBarBg = this.add.rectangle(width - 150, 30, 200, 20, 0x000000)
            .setScrollFactor(0).setDepth(999);
        
        // Barra de vida
        this.healthBar = this.add.rectangle(width - 150, 30, 200, 16, 0x2ecc71)
            .setScrollFactor(0).setDepth(1000);
        
        // Texto de la barra
        this.add.text(width - 150, 50, 'VIDA', {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
    }

    updateHealthBar() {
        if (this.healthBar && this.player) {
            const healthPercent = this.player.health / this.gameState.maxHealth;
            this.healthBar.scaleX = healthPercent;
            
            // Cambiar color según la vida
            if (healthPercent > 0.6) {
                this.healthBar.setFillStyle(0x2ecc71); // Verde
            } else if (healthPercent > 0.3) {
                this.healthBar.setFillStyle(0xf39c12); // Naranja
            } else {
                this.healthBar.setFillStyle(0xe74c3c); // Rojo
            }
        }
    }

    setupCamera(worldWidth, worldHeight) {
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(150, 150);
        
        console.log(`✅ Cámara configurada para mundo ${worldWidth}x${worldHeight}`);
    }

    createMenuButton() {
        this.add.text(20, 180, '📋 MENÚ', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: 6,
            alpha: 0.8
        }).setScrollFactor(0).setDepth(1000).setInteractive().on('pointerdown', () => {
            console.log('🔄 Volviendo al menú...');
            this.scene.start('MenuScene');
        });
    }

    // === MÉTODOS DE INTERACCIÓN ===
    collectCoin(player, coin) {
        console.log('💰 Moneda recogida!');
        
        coin.destroy();
        this.gameState.score += 100;
        this.gameState.coinsCollected++;
        
        // Actualizar UI
        this.updateUI();
        
        // Efecto visual
        this.createCollectEffect(coin.x, coin.y, '+100', '#f1c40f');
        
        // Verificar victoria
        if (this.gameState.coinsCollected >= this.gameState.totalCoins) {
            this.levelComplete();
        }
    }

    collectItem(player, item) {
        console.log(`🍎 Item recogido: ${item.itemType}`);
        
        if (item.itemType === 'health' && player.health < this.gameState.maxHealth) {
            const healAmount = Math.min(item.healAmount, this.gameState.maxHealth - player.health);
            player.health += healAmount;
            
            // Actualizar UI
            this.updateUI();
            
            // Efecto visual
            this.createCollectEffect(item.x, item.y, `+${healAmount} HP`, '#2ecc71');
            
            item.destroy();
        }
    }

    hitByEnemy(player, enemy) {
        if (!player.isInvulnerable) {
            console.log(`💥 Golpeado por ${enemy.enemyType}`);
            
            player.health -= enemy.damage;
            this.updateUI();
            
            // Invulnerabilidad temporal
            player.isInvulnerable = true;
            player.setTint(0xff0000);
            
            // Empuje
            const pushForce = player.x < enemy.x ? -300 : 300;
            player.setVelocityX(pushForce);
            
            // Shake de cámara
            this.cameras.main.shake(300, 0.02);
            
            // Efecto visual
            this.createDamageEffect(player.x, player.y, `-${enemy.damage}`, '#e74c3c');
            
            this.time.delayedCall(1500, () => {
                player.clearTint();
                player.isInvulnerable = false;
            });

            if (player.health <= 0) {
                this.gameOver();
            }
        }
    }

    performAttack() {
        if (!this.canAttack) return;
        
        console.log('⚔️ Ataque!');
        
        this.canAttack = false;
        
        // Efecto visual en el jugador
        this.player.setTint(0xffffff);
        this.time.delayedCall(150, () => this.player.clearTint());

        // Detectar enemigos cercanos
        const attackRange = 100;
        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (distance < attackRange) {
                this.damageEnemy(enemy, 35);
            }
        });

        // Efecto de ataque
        this.createAttackEffect();

        // Cooldown
        this.time.delayedCall(400, () => {
            this.canAttack = true;
        });
    }

    damageEnemy(enemy, damage) {
        console.log(`🗡️ Enemigo dañado: ${damage} HP`);
        
        enemy.health -= damage;
        enemy.setTint(0xffffff);
        this.time.delayedCall(200, () => {
            if (enemy.active) enemy.clearTint();
        });

        // Empuje del enemigo
        const pushX = enemy.x < this.player.x ? -150 : 150;
        enemy.setVelocityX(pushX);

        if (enemy.health <= 0) {
            console.log(`💀 Enemigo eliminado: ${enemy.enemyType}`);
            
            // Efectos
            this.createDeathEffect(enemy.x, enemy.y);
            this.createCollectEffect(enemy.x, enemy.y, `+${enemy.scoreValue}`, '#ff6b6b');
            
            // Puntuación
            this.gameState.score += enemy.scoreValue;
            this.gameState.enemiesKilled++;
            
            enemy.destroy();
            this.updateUI();
            
            // Spawn más enemigos si quedan pocos
            if (this.enemies.children.size <= 1) {
                this.spawnMoreEnemies();
            }
        }
    }

    spawnMoreEnemies() {
        console.log('🚀 Spawning más enemigos...');
        
        const spawnPoints = [
            { x: this.player.x + 400, y: this.sys.game.config.height - 80 },
            { x: this.player.x - 400, y: this.sys.game.config.height - 80 }
        ];
        
        spawnPoints.forEach(spawn => {
            if (spawn.x > 0 && spawn.x < this.physics.world.bounds.width) {
                let enemy;
                
                if (Math.random() < 0.6) {
                    enemy = this.enemies.create(spawn.x, spawn.y, 'gallina-run');
                    enemy.health = 30 + (this.gameState.level * 5);
                    enemy.damage = 15 + (this.gameState.level * 2);
                    enemy.enemyType = 'gallina';
                    enemy.scoreValue = 100;
                    
                    if (this.anims.exists('gallina-run')) {
                        enemy.anims.play('gallina-run', true);
                    }
                } else {
                    enemy = this.enemies.create(spawn.x, spawn.y, 'pig-idle');
                    enemy.health = 50 + (this.gameState.level * 8);
                    enemy.damage = 20 + (this.gameState.level * 3);
                    enemy.enemyType = 'pig';
                    enemy.scoreValue = 150;
                    
                    if (this.anims.exists('pig-idle')) {
                        enemy.anims.play('pig-idle', true);
                    }
                }
                
                enemy.setBounce(1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-100, 100), 20);
                enemy.setScale(1.5);
                enemy.maxHealth = enemy.health;
                
                // Efecto de spawn
                this.createSpawnEffect(spawn.x, spawn.y);
            }
        });
    }

    levelComplete() {
        console.log('🏆 Nivel completado!');
        
        this.physics.pause();
        
        const { width, height } = this.sys.game.config;
        
        // Overlay
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9)
            .setScrollFactor(0).setDepth(2000);
        
        // Título
        const title = this.add.text(width/2, height/2 - 120, '🎉 ¡NIVEL COMPLETADO!', {
            fontSize: '36px',
            color: '#2ecc71',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        // Stats
        const stats = this.add.text(width/2, height/2 - 40, 
            `🏆 Puntuación Final: ${this.gameState.score}\n` +
            `💰 Monedas Recogidas: ${this.gameState.coinsCollected}/${this.gameState.totalCoins}\n` +
            `⚔️ Enemigos Eliminados: ${this.gameState.enemiesKilled}\n` +
            `❤️ Vida Restante: ${this.player.health}/${this.gameState.maxHealth}`, {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
            lineSpacing: 8
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        // Bonus por vida restante
        const bonus = this.player.health * 10;
        this.gameState.score += bonus;
        
        const bonusText = this.add.text(width/2, height/2 + 60, `🎁 Bonus por Vida: +${bonus}`, {
            fontSize: '20px',
            color: '#f1c40f',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        // Botones
        const nextBtn = this.add.rectangle(width/2 - 120, height/2 + 120, 180, 50, 0x2ecc71);
        nextBtn.setStrokeStyle(3, 0xffffff);
        const nextText = this.add.text(width/2 - 120, height/2 + 120, '➡️ SIGUIENTE', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        const menuBtn = this.add.rectangle(width/2 + 120, height/2 + 120, 180, 50, 0xe74c3c);
        menuBtn.setStrokeStyle(3, 0xffffff);
        const menuText = this.add.text(width/2 + 120, height/2 + 120, '🏠 MENÚ', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        // Hacer botones interactivos
        nextBtn.setInteractive();
        menuBtn.setInteractive();
        
        nextBtn.on('pointerdown', () => {
            this.gameState.level++;
            this.scene.restart();
        });
        
        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        // Efectos de celebración
        this.createVictoryEffects();
    }

    gameOver() {
        console.log('💀 Game Over');
        
        this.physics.pause();
        
        const { width, height } = this.sys.game.config;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.95)
            .setScrollFactor(0).setDepth(2000);
        
        const title = this.add.text(width/2, height/2 - 80, '💀 GAME OVER', {
            fontSize: '48px',
            color: '#e74c3c',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        const stats = this.add.text(width/2, height/2, 
            `Puntuación Final: ${this.gameState.score}\n` +
            `Nivel Alcanzado: ${this.gameState.level}\n` +
            `Monedas Recogidas: ${this.gameState.coinsCollected}`, {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        const restartBtn = this.add.rectangle(width/2, height/2 + 80, 200, 50, 0xf39c12);
        restartBtn.setStrokeStyle(3, 0xffffff);
        const restartText = this.add.text(width/2, height/2 + 80, '🔄 REINTENTAR', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        restartBtn.setInteractive();
        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    // === EFECTOS VISUALES ===
    createAttackEffect() {
        const direction = this.player.flipX ? -60 : 60;
        
        // Efecto principal
        const effect = this.add.circle(this.player.x + direction, this.player.y, 40, 0xff6b6b, 0.7);
        this.tweens.add({
            targets: effect,
            scaleX: 2.5,
            scaleY: 2.5,
            alpha: 0,
            duration: 300,
            onComplete: () => effect.destroy()
        });
        
        // Partículas
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                this.player.x + direction + Phaser.Math.Between(-20, 20),
                this.player.y + Phaser.Math.Between(-20, 20),
                5, 0xffffff, 0.8
            );
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-30, 30),
                y: particle.y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: 400,
                onComplete: () => particle.destroy()
            });
        }
    }

    createCollectEffect(x, y, text, color) {
        const effect = this.add.text(x, y, text, {
            fontSize: '18px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: effect,
            y: effect.y - 50,
            alpha: 0,
            scale: 1.2,
            duration: 1200,
            onComplete: () => effect.destroy()
        });
    }

    createDamageEffect(x, y, text, color) {
        const effect = this.add.text(x, y, text, {
            fontSize: '20px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: effect,
            y: effect.y - 40,
            x: effect.x + Phaser.Math.Between(-20, 20),
            alpha: 0,
            scale: 1.3,
            duration: 1000,
            onComplete: () => effect.destroy()
        });
    }

    createDeathEffect(x, y) {
        // Explosión principal
        const explosion = this.add.circle(x, y, 30, 0xff4400, 0.8);
        this.tweens.add({
            targets: explosion,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 600,
            onComplete: () => explosion.destroy()
        });
        
        // Partículas
        for (let i = 0; i < 12; i++) {
            const particle = this.add.circle(x, y, 6, 0xff6600, 0.9);
            const angle = (i / 12) * Math.PI * 2;
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 60,
                y: particle.y + Math.sin(angle) * 60,
                alpha: 0,
                duration: 800,
                onComplete: () => particle.destroy()
            });
        }
    }

    createSpawnEffect(x, y) {
        // Efecto de aparición
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(x, y, 4, 0x00ff88, 0.8);
            const angle = (i / 10) * Math.PI * 2;
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 40,
                y: particle.y + Math.sin(angle) * 40,
                alpha: 0,
                duration: 700,
                onComplete: () => particle.destroy()
            });
        }
    }

    createVictoryEffects() {
        // Fuegos artificiales
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 400, () => {
                const x = Phaser.Math.Between(100, 700);
                const y = Phaser.Math.Between(100, 400);
                
                for (let j = 0; j < 15; j++) {
                    const firework = this.add.circle(x, y, 5, Phaser.Math.Between(0xff0000, 0xffffff), 0.9);
                    const angle = (j / 15) * Math.PI * 2;
                    
                    this.tweens.add({
                        targets: firework,
                        x: firework.x + Math.cos(angle) * 80,
                        y: firework.y + Math.sin(angle) * 80,
                        alpha: 0,
                        duration: 1500,
                        onComplete: () => firework.destroy()
                    });
                }
            });
        }
    }

    updateUI() {
        this.scoreText.setText(`Puntuación: ${this.gameState.score}`);
        this.healthText.setText(`Vida: ${this.player.health}/${this.gameState.maxHealth}`);
        this.coinsText.setText(`Monedas: ${this.gameState.coinsCollected}/${this.gameState.totalCoins}`);
        this.levelText.setText(`Nivel: ${this.gameState.level}`);
        
        this.updateHealthBar();
    }

    // === UPDATE LOOP ===
    update() {
        if (this.isGamePaused) return;

        this.handlePlayerMovement();
        this.handlePlayerAnimation();
        this.updateCompanion();
        this.updateEnemies();
        this.checkGameConditions();


        
        // Dentro del update()
let velocityX = 0;

if (this.keys.A.isDown || this.cursors.left.isDown) {
    velocityX = -160;
    this.moto.setFlipX(true);
    this.moto.play('moto-run', true);
} else if (this.keys.D.isDown || this.cursors.right.isDown) {
    velocityX = 160;
    this.moto.setFlipX(false);
    this.moto.play('moto-run', true);
} else {
    this.moto.play('moto-idle', true); // se queda quieta
}

this.moto.setVelocityX(velocityX);

    }

    handlePlayerMovement() {
        if (!this.player) return;

        let velocityX = 0;
        let isMoving = false;

        // Movimiento horizontal
        if (this.keys.A.isDown || this.cursors.left.isDown) {
            velocityX = -200;
            this.player.setFlipX(true);
            isMoving = true;
        } else if (this.keys.D.isDown || this.cursors.right.isDown) {
            velocityX = 200;
            this.player.setFlipX(false);
            isMoving = true;
        }

        // Correr
        if (this.keys.SHIFT.isDown && isMoving) {
            velocityX *= 1.7;
        }

        // Saltar
        if ((this.keys.SPACE.isDown || this.keys.W.isDown || this.cursors.up.isDown) && 
            this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }

        // Dash
        if (Phaser.Input.Keyboard.JustDown(this.keys.Q) && this.canDash) {
            this.performDash();
        }

        this.player.setVelocityX(velocityX);

        // Ataque
        if (Phaser.Input.Keyboard.JustDown(this.keys.J)) {
            this.performAttack();
        }

        // Menú
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.scene.start('MenuScene');
        }
    }

    performDash() {
        if (!this.canDash) return;
        
        this.canDash = false;
        this.player.isDashing = true;
        
        const dashDistance = this.player.flipX ? -300 : 300;
        this.player.setVelocityX(dashDistance);
        this.player.setTint(0x00ffff);
        
        // Efecto de dash
        for (let i = 0; i < 8; i++) {
            const trail = this.add.circle(
                this.player.x + Phaser.Math.Between(-10, 10),
                this.player.y + Phaser.Math.Between(-10, 10),
                5, 0x00ffff, 0.6
            );
            
            this.tweens.add({
                targets: trail,
                alpha: 0,
                duration: 300,
                onComplete: () => trail.destroy()
            });
        }
        
        this.time.delayedCall(200, () => {
            this.player.isDashing = false;
            this.player.clearTint();
        });
        
        this.time.delayedCall(2000, () => {
            this.canDash = true;
        });
    }

    handlePlayerAnimation() {
        if (!this.player) return;

        if (this.player.isDashing) {
            return; // No cambiar animación durante dash
        }

        if (!this.player.body.touching.down) {
            if (this.anims.exists('ninja-jump')) {
                this.player.anims.play('ninja-jump', true);
            }
        } else if (this.player.body.velocity.x !== 0) {
            if (this.anims.exists('ninja-run')) {
                this.player.anims.play('ninja-run', true);
            }
        } else {
            if (this.anims.exists('ninja-idle')) {
                this.player.anims.play('ninja-idle', true);
            }
        }
    }

    updateCompanion() {
        if (!this.companion || !this.player) return;

        const distance = Phaser.Math.Distance.Between(
            this.companion.x, this.companion.y, this.player.x, this.player.y
        );

        if (distance > 150) {
            const direction = this.player.x > this.companion.x ? 1 : -1;
            this.companion.setVelocityX(direction * 180);
            this.companion.setFlipX(direction < 0);

            if (this.anims.exists('amigo-run')) {
                this.companion.anims.play('amigo-run', true);
            }

            if (this.companion.body.touching.down && this.player.y < this.companion.y - 50) {
                this.companion.setVelocityY(-350);
            }
        } else {
            this.companion.setVelocityX(0);
            if (this.anims.exists('amigo-idle')) {
                this.companion.anims.play('amigo-idle', true);
            }
        }
    }

    updateEnemies() {
        this.enemies.children.entries.forEach(enemy => {
            // IA básica de enemigos
            if (Math.random() < 0.02) {
                const newVelX = Phaser.Math.Between(-120, 120);
                enemy.setVelocityX(newVelX);
                enemy.setFlipX(newVelX < 0);
            }
            
            // Perseguir al jugador si está cerca
            if (this.player) {
                const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                if (distance < 200) {
                    const direction = this.player.x > enemy.x ? 1 : -1;
                    enemy.setVelocityX(direction * 60);
                    enemy.setFlipX(direction < 0);
                }
            }
        });
    }

    checkGameConditions() {
        // Verificar si el jugador se cayó del mundo
        if (this.player && this.player.y > this.sys.game.config.height + 100) {
            this.gameOver();
        }
    }
}

// =============================
//  CONFIGURACIÓN DEL JUEGO
// =============================
console.log("🚀 Iniciando Ninja Rescue...");

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MenuScene, IntroScene, GameScene], // ← MenuScene PRIMERO
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 600
    },
    backgroundColor: '#2c3e50'
};

document.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
    
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    document.body.appendChild(gameContainer);
    
    const game = new Phaser.Game(config);
    
    console.log("🎉 Ninja Rescue iniciado correctamente!");
    
    window.addEventListener('resize', () => {
        game.scale.refresh();
    });
    
    window.game = game;
});