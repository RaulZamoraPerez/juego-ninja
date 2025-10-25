class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Estado del juego
        this.gameState = {
            score: 0,
            health: 100,
            maxHealth: 100,
            coinsCollected: 0,
            totalCoins: 0,
            enemiesKilled: 0,
            level: 1
        };
        
        // Estados de habilidades
        this.canAttack = true;
        this.isGamePaused = false;
    }

    preload() {
        console.log("📥 Cargando assets del juego...");
        
        // Crear texturas de respaldo primero
        this.createFallbackTextures();
        
        // === VERIFICAR CARGA DE ARCHIVOS ===
        this.load.on('filecomplete', (key, type, data) => {
            if (key.includes('rino')) {
                console.log(`✅ RINO CARGADO: ${key} (${type})`);
            }
            console.log(`✅ Archivo cargado: ${key} (${type})`);
        });
        
        this.load.on('loaderror', (file) => {
            console.log(`❌ Error cargando: ${file.key} desde ${file.src}`);
        });
        
        try {

            //motocle 
            this.load.spritesheet('moto-run', 'assets/motocle/motocle.jpg', { frameWidth: 341, frameHeight: 1024 });

            // === JUGADOR ===
            this.load.spritesheet('ninja-idle', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('ninja-run', 'assets/player/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('ninja-jump', 'assets/player/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
            
            // === COMPAÑERO ===
            this.load.spritesheet('amigo-run', 'assets/amigo/Run (32x32).png', {frameWidth: 32, frameHeight: 30});
            this.load.spritesheet('amigo-idle', 'assets/amigo/Idle (32x32).png', {frameWidth: 32, frameHeight: 30});
            
            // === ITEMS ===
            this.load.spritesheet('coin', 'assets/dinero/coin.png', { frameWidth: 16, frameHeight: 16 });
            
            // === ENEMIGOS - SOLO RINO Y GALLINA ===
            console.log("🦏 Cargando archivos del RINO...");
            this.load.spritesheet('rino-idle', 'assets/animales/Rino/Idle (52x34).png', { frameWidth: 52, frameHeight: 34 });
            this.load.spritesheet('rino-run', 'assets/animales/Rino/Run (52x34).png', { frameWidth: 52, frameHeight: 34 });
            this.load.spritesheet('rino-hit', 'assets/animales/Rino/Hit (52x34).png', { frameWidth: 52, frameHeight: 34 });
            this.load.spritesheet('rino-hit-wall', 'assets/animales/Rino/Hit Wall (52x34).png', { frameWidth: 52, frameHeight: 34 });
            
            console.log("🐔 Cargando archivos de GALLINA...");
            this.load.spritesheet('gallina-run', 'assets/animales/gallina/Run (32x34).png', { frameWidth: 32, frameHeight: 34 });
            
            // === FONDO ===
            this.load.image('sky', 'assets/fondo.png');
            this.load.image('ground', 'assets/Brown On (32x8).png');
            
            console.log("✅ Preload configurado SIN archivos de cerdo");
            
        } catch (error) {
            console.log("⚠️ Error en preload:", error);
        }
    }

    createFallbackTextures() {
        const graphics = this.add.graphics();
        
        // Ninja
        graphics.fillStyle(0x3498DB);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('ninjaFallback', 32, 32);
        
        // Compañero
        graphics.clear();
        graphics.fillStyle(0x2ECC71);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('companionFallback', 32, 32);
        
        // Moneda
        graphics.clear();
        graphics.fillStyle(0xF1C40F);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('coinFallback', 16, 16);
        
        // Enemigo gallina
        graphics.clear();
        graphics.fillStyle(0xE74C3C);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('gallinaFallback', 32, 32);
        
        // Enemigo cerdo
        graphics.clear();
        graphics.fillStyle(0xFF69B4);
        graphics.fillRect(0, 0, 36, 30);
        graphics.generateTexture('pigFallback', 36, 30);
        
        // Fondo
        graphics.clear();
        graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98);
        graphics.fillRect(0, 0, 2400, 600);
        graphics.generateTexture('skyFallback', 2400, 600);
        
        // Suelo
        graphics.clear();
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 64, 32);
        graphics.generateTexture('groundFallback', 64, 32);
        
        // Manzana
        graphics.clear();
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('appleFallback', 16, 16);
        
        // Enemigo rino (en lugar de cerdo)
        graphics.clear();
        graphics.fillStyle(0x8B4513); // Color marrón para el rino
        graphics.fillRect(0, 0, 52, 34);
        graphics.generateTexture('rinoFallback', 52, 34);
        
        graphics.destroy();
        
        console.log("✅ Texturas de respaldo creadas");
    }

    create() {
        console.log("🎮 Iniciando GameScene...");
        
        const { width, height } = this.sys.game.config;
        
        // === CONFIGURAR MUNDO ===
        const worldWidth = 2400;
        this.physics.world.setBounds(0, 0, worldWidth, height);
        
        // === CREAR ELEMENTOS ===
        this.createBackground();
        this.createPlatforms();
        this.createAnimations();
        this.createPlayer();
        this.createCompanion();
        this.createCoins();
        this.createEnemies();
        this.createItems();
        this.setupControls();
        this.setupPhysics();
        this.createUI();
        this.setupCamera();
        
        console.log("✅ GameScene creado exitosamente");


          // Crear animación de correr
        // Animación de idle
this.anims.create({
    key: 'moto-idle',
    frames: this.anims.generateFrameNumbers('moto-run', { start: 0, end: 0 }),
    frameRate: 1,
    repeat: -1
});

// Animación de run
this.anims.create({
    key: 'moto-run',
    frames: this.anims.generateFrameNumbers('moto-run', { start: 1, end: 2 }),
    frameRate: 6,
    repeat: -1
});
const motoTexture = this.textures.exists('moto-run') ? 'moto-run' : 'ninjaFallback';
this.moto = this.physics.add.sprite(100, 450, motoTexture);
this.moto.setCollideWorldBounds(true);
this.moto.setBounce(0.2);
this.moto.setScale(0.2); // ajustar tamaño para el mundo
this.moto.play('moto-idle');


        // Agregar el sprite a la escena
        this.moto = this.physics.add.sprite(400, 300, 'moto-run');

        // Reproducir la animación
        this.moto.play('moto-run');

        // Hacer que se mueva automáticamente hacia la derecha (opcional)
        this.moto.setVelocityX(150); // cambia la velocidad según quieras
    }

    createBackground() {
        const { width, height } = this.sys.game.config;
        const worldWidth = 2400;
        
        // Fondo que cubre todo el mundo
        const bgTexture = this.textures.exists('sky') ? 'sky' : 'skyFallback';
        const bg = this.add.image(0, 0, bgTexture);
        bg.setOrigin(0, 0);
        bg.setDisplaySize(worldWidth, height);
        
        console.log(`✅ Fondo creado: ${worldWidth}x${height}`);
    }

    createPlatforms() {
        const { width, height } = this.sys.game.config;
        const worldWidth = 2400;
        const groundTexture = this.textures.exists('ground') ? 'ground' : 'groundFallback';
        
        this.platforms = this.physics.add.staticGroup();
        
        // Suelo principal
        const groundY = height - 16;
        for (let i = 0; i < Math.ceil(worldWidth / 64); i++) {
            this.platforms.create(i * 64, groundY, groundTexture);
        }
        
        // Plataformas distribuidas
        const platformData = [
            { x: 200, y: height - 150 }, { x: 350, y: height - 250 }, { x: 500, y: height - 180 },
            { x: 750, y: height - 200 }, { x: 900, y: height - 300 }, { x: 1050, y: height - 150 },
            { x: 1300, y: height - 220 }, { x: 1500, y: height - 120 }, { x: 1650, y: height - 280 },
            { x: 1900, y: height - 160 }, { x: 2100, y: height - 240 }, { x: 2300, y: height - 180 }
        ];
        
        platformData.forEach(platform => {
            this.platforms.create(platform.x, platform.y, groundTexture);
        });
        
        console.log(`✅ Plataformas creadas`);
    }

    createAnimations() {
        // === JUGADOR ===
        if (this.textures.exists('ninja-idle')) {
            this.anims.create({
                key: 'ninja-idle',
                frames: this.anims.generateFrameNumbers('ninja-idle', { start: 0, end: 3 }),
                frameRate: 8, repeat: -1
            });
        }

        if (this.textures.exists('ninja-run')) {
            this.anims.create({
                key: 'ninja-run',
                frames: this.anims.generateFrameNumbers('ninja-run', { start: 0, end: 7 }),
                frameRate: 12, repeat: -1
            });
        }

        // === COMPAÑERO ===
        if (this.textures.exists('amigo-idle')) {
            this.anims.create({
                key: 'amigo-idle',
                frames: this.anims.generateFrameNumbers('amigo-idle', { start: 0, end: 3 }),
                frameRate: 6, repeat: -1
            });
        }

        if (this.textures.exists('amigo-run')) {
            this.anims.create({
                key: 'amigo-run',
                frames: this.anims.generateFrameNumbers('amigo-run', { start: 0, end: 7 }),
                frameRate: 10, repeat: -1
            });
        }

        // === MONEDA ===
        if (this.textures.exists('coin')) {
            this.anims.create({
                key: 'coin-spin',
                frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
                frameRate: 10, repeat: -1
            });
        }

        // === GALLINA ===
        if (this.textures.exists('gallina-run')) {
            this.anims.create({
                key: 'gallina-run',
                frames: this.anims.generateFrameNumbers('gallina-run', { start: 0, end: 7 }),
                frameRate: 12, repeat: -1
            });
            console.log("✅ Animación gallina-run creada");
        }

        // === RINO - TODAS LAS ANIMACIONES ===
        if (this.textures.exists('rino-idle')) {
            this.anims.create({
                key: 'rino-idle',
                frames: this.anims.generateFrameNumbers('rino-idle', { start: 0, end: 3 }),
                frameRate: 6, repeat: -1
            });
            console.log("✅ Animación rino-idle creada 🦏");
        }

        if (this.textures.exists('rino-run')) {
            this.anims.create({
                key: 'rino-run',
                frames: this.anims.generateFrameNumbers('rino-run', { start: 0, end: 5 }),
                frameRate: 10, repeat: -1
            });
            console.log("✅ Animación rino-run creada 🦏");
        }

        if (this.textures.exists('rino-hit')) {
            this.anims.create({
                key: 'rino-hit',
                frames: this.anims.generateFrameNumbers('rino-hit', { start: 0, end: 4 }),
                frameRate: 12, repeat: 0
            });
            console.log("✅ Animación rino-hit creada 🦏");
        }

        if (this.textures.exists('rino-hit-wall')) {
            this.anims.create({
                key: 'rino-hit-wall',
                frames: this.anims.generateFrameNumbers('rino-hit-wall', { start: 0, end: 4 }),
                frameRate: 8, repeat: 0
            });
            console.log("✅ Animación rino-hit-wall creada 🦏");
        }

        console.log("✅ Todas las animaciones creadas");
    }

    createPlayer() {
        const playerTexture = this.textures.exists('ninja-idle') ? 'ninja-idle' : 'ninjaFallback';
        this.player = this.physics.add.sprite(100, 450, playerTexture);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.health = this.gameState.health;
        this.player.isInvulnerable = false;
        
        if (this.anims.exists('ninja-idle')) {
            this.player.anims.play('ninja-idle');
        }
        
        console.log("✅ Jugador creado");
    }

    createCompanion() {
        const companionTexture = this.textures.exists('amigo-idle') ? 'amigo-idle' : 'companionFallback';
        this.companion = this.physics.add.sprite(50, 450, companionTexture);
        this.companion.setBounce(0.2);
        this.companion.setCollideWorldBounds(true);
        
        if (this.anims.exists('amigo-idle')) {
            this.companion.anims.play('amigo-idle');
        }
        
        console.log("✅ Compañero creado");
    }

    createCoins() {
        const coinTexture = this.textures.exists('coin') ? 'coin' : 'coinFallback';
        this.coins = this.physics.add.group();
        
        const coinPositions = [
            { x: 200, y: 400 }, { x: 400, y: 300 }, { x: 600, y: 200 },
            { x: 800, y: 350 }, { x: 1000, y: 250 }, { x: 1300, y: 250 },
            { x: 1600, y: 150 }, { x: 1900, y: 300 }, { x: 2200, y: 200 }
        ];
        
        coinPositions.forEach(pos => {
            const coin = this.coins.create(pos.x, pos.y, coinTexture);
            coin.setBounce(0.4);
            coin.setScale(2);
            
            if (this.anims.exists('coin-spin')) {
                coin.anims.play('coin-spin');
            } else {
                this.tweens.add({
                    targets: coin,
                    rotation: Math.PI * 2,
                    duration: 2000,
                    repeat: -1
                });
            }
        });
        
        this.gameState.totalCoins = coinPositions.length;
        console.log(`✅ ${coinPositions.length} monedas creadas`);
    }

    createEnemies() {
        this.enemies = this.physics.add.group();
        
        console.log("🎮 Creando enemigos (SOLO RINO Y GALLINA)...");
        
        const gallinaTexture = this.textures.exists('gallina-run') ? 'gallina-run' : 'gallinaFallback';
        const rinoTexture = this.textures.exists('rino-idle') ? 'rino-idle' : 'rinoFallback';
        
        console.log(`📊 Texturas disponibles:`);
        console.log(`  - Gallina: ${gallinaTexture} (existe: ${this.textures.exists('gallina-run')})`);
        console.log(`  - Rino: ${rinoTexture} (existe: ${this.textures.exists('rino-idle')})`);
        
        // === SOLO RINO Y GALLINA ===
        const enemyPositions = [
            { x: 500, y: 400, type: 'gallina' },
            { x: 800, y: 350, type: 'rino' },     // ← RINO AQUÍ
            { x: 1200, y: 250, type: 'gallina' },
            { x: 1500, y: 300, type: 'rino' },    // ← OTRO RINO
            { x: 1800, y: 400, type: 'gallina' }
        ];
        
        enemyPositions.forEach((pos, index) => {
            console.log(`🎯 Creando enemigo ${index + 1}: ${pos.type} en (${pos.x}, ${pos.y})`);
            
            let enemy;
            
            if (pos.type === 'gallina') {
                enemy = this.enemies.create(pos.x, pos.y, gallinaTexture);
                enemy.setBounce(1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-100, 100), 20);
                enemy.health = 30;
                enemy.damage = 15;
                enemy.enemyType = 'gallina';
                
                if (this.anims.exists('gallina-run')) {
                    enemy.anims.play('gallina-run');
                }
                
                console.log("✅ Gallina creada");
                
            } else if (pos.type === 'rino') {
                console.log(`🦏 Creando RINO con textura: ${rinoTexture}`);
                
                enemy = this.enemies.create(pos.x, pos.y, rinoTexture);
                
                if (!enemy) {
                    console.log("❌ ERROR: No se pudo crear el rino");
                    return;
                }
                
                enemy.setBounce(0.3);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-60, 60), 20);
                enemy.health = 80;
                enemy.damage = 30;
                enemy.enemyType = 'rino';
                enemy.setScale(1.3); // MÁS GRANDE
                
                // Color distintivo MARRÓN
                enemy.setTint(0x8B4513);
                
                // Estados del rino
                enemy.isCharging = false;
                enemy.stunned = false;
                
                // Animación del rino
                if (this.anims.exists('rino-idle')) {
                    enemy.anims.play('rino-idle');
                    console.log("✅ RINO animado con rino-idle");
                } else {
                    console.log("⚠️ RINO sin animación, usando efecto visual");
                    // Efecto de respiración
                    this.tweens.add({
                        targets: enemy,
                        scaleX: 1.4,
                        scaleY: 1.4,
                        duration: 800,
                        yoyo: true,
                        repeat: -1
                    });
                }
                
                console.log("✅ RINO CREADO EXITOSAMENTE 🦏");
            }
        });
        
        console.log(`✅ Total enemigos: ${this.enemies.children.size}`);
        console.log(`📝 Tipos: ${this.enemies.children.entries.map(e => e.enemyType).join(', ')}`);
    }

    createItems() {
        // COMENTAR O ELIMINAR HASTA QUE TENGAS EL ARCHIVO apple.png
        /*
        const appleTexture = this.textures.exists('apple') ? 'apple' : 'appleFallback';
        this.items = this.physics.add.group();
        
        const itemPositions = [
            { x: 350, y: 200 },
            { x: 1400, y: 150 }
        ];
        
        itemPositions.forEach(pos => {
            const apple = this.items.create(pos.x, pos.y, appleTexture);
            apple.setBounce(0.6);
            apple.itemType = 'health';
            apple.healAmount = 25;
            apple.setScale(2);
        });
        */
        
        // Crear grupo vacío por ahora
        this.items = this.physics.add.group();
        
        console.log("✅ Items deshabilitados temporalmente");
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.keys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D'),
            J: this.input.keyboard.addKey('J'),
            SPACE: this.input.keyboard.addKey('SPACE'),
            SHIFT: this.input.keyboard.addKey('SHIFT'),
            ESC: this.input.keyboard.addKey('ESC')
        };

        this.input.on('pointerdown', () => this.performAttack());
        
        console.log("✅ Controles configurados");
    }

    setupPhysics() {
        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.companion, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.items, this.platforms);

        // Interacciones
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        
        console.log("✅ Físicas configuradas");
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Puntuación: 0', {
            fontSize: '18px', color: '#ffffff', stroke: '#000', strokeThickness: 2,
            backgroundColor: '#000000', padding: 4
        }).setScrollFactor(0).setDepth(1000);

        this.healthText = this.add.text(16, 50, 'Vida: 100/100', {
            fontSize: '18px', color: '#2ecc71', stroke: '#000', strokeThickness: 2,
            backgroundColor: '#000000', padding: 4
        }).setScrollFactor(0).setDepth(1000);

        this.coinsText = this.add.text(16, 84, `Monedas: 0/${this.gameState.totalCoins}`, {
            fontSize: '18px', color: '#f1c40f', stroke: '#000', strokeThickness: 2,
            backgroundColor: '#000000', padding: 4
        }).setScrollFactor(0).setDepth(1000);

        // Botón menú
        this.add.text(16, 118, '📋 MENÚ (ESC)', {
            fontSize: '14px', color: '#ffffff', backgroundColor: '#000000', padding: 5
        }).setScrollFactor(0).setDepth(1000).setInteractive().on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        console.log("✅ UI creada");
    }

    setupCamera() {
        const { width, height } = this.sys.game.config;
        this.cameras.main.setBounds(0, 0, 2400, height);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        
        console.log("✅ Cámara configurada");
    }

    // ===== MÉTODOS DE INTERACCIÓN =====
    collectCoin(player, coin) {
        coin.destroy();
        this.gameState.score += 100;
        this.gameState.coinsCollected++;
        
        this.scoreText.setText('Puntuación: ' + this.gameState.score);
        this.coinsText.setText(`Monedas: ${this.gameState.coinsCollected}/${this.gameState.totalCoins}`);
        
        if (this.gameState.coinsCollected >= this.gameState.totalCoins) {
            this.levelComplete();
        }
    }

    collectItem(player, item) {
        if (item.itemType === 'health' && player.health < this.gameState.maxHealth) {
            const healAmount = Math.min(item.healAmount, this.gameState.maxHealth - player.health);
            player.health += healAmount;
            this.gameState.health = player.health;
            
            this.healthText.setText(`Vida: ${player.health}/${this.gameState.maxHealth}`);
            item.destroy();
        }
    }

    hitEnemy(player, enemy) {
        if (!player.isInvulnerable) {
            player.health -= enemy.damage;
            this.gameState.health = player.health;
            this.healthText.setText(`Vida: ${player.health}/${this.gameState.maxHealth}`);
            
            player.isInvulnerable = true;
            player.setTint(0xff0000);
            
            const pushForce = player.x < enemy.x ? -200 : 200;
            player.setVelocityX(pushForce);
            
            this.cameras.main.shake(200, 0.01);
            
            this.time.delayedCall(1000, () => {
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
        
        this.canAttack = false;
        this.player.setTint(0xff0000);
        this.time.delayedCall(100, () => this.player.clearTint());

        const attackRange = 80;
        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );
            if (distance < attackRange) {
                this.damageEnemy(enemy, 25);
            }
        });

        this.time.delayedCall(500, () => {
            this.canAttack = true;
        });
    }

    damageEnemy(enemy, damage) {
        enemy.health -= damage;
        enemy.setTint(0xffffff);
        this.time.delayedCall(200, () => enemy.clearTint());

        // Animación especial si es un rino
        if (enemy.enemyType === 'rino' && this.anims.exists('rino-hit')) {
            enemy.anims.play('rino-hit');
            // Volver a idle después de la animación de golpe
            this.time.delayedCall(400, () => {
                if (enemy.active && this.anims.exists('rino-idle')) {
                    enemy.anims.play('rino-idle');
                }
            });
        }

        if (enemy.health <= 0) {
            // Más puntos por matar un rino
            const points = enemy.enemyType === 'rino' ? 100 : 50;
            
            enemy.destroy();
            this.gameState.score += points;
            this.gameState.enemiesKilled++;
            this.scoreText.setText('Puntuación: ' + this.gameState.score);
            
            console.log(`💀 ${enemy.enemyType} eliminado (+${points} puntos)`);
            
            if (this.enemies.children.size === 0) {
                this.spawnMoreEnemies();
            }
        }
    }

    spawnMoreEnemies() {
        const gallinaTexture = this.textures.exists('gallina-run') ? 'gallina-run' : 'gallinaFallback';
        
        const spawnPoints = [
            { x: 1500, y: 300 }, { x: 1800, y: 250 }, { x: 2000, y: 200 }
        ];
        
        spawnPoints.forEach(pos => {
            const enemy = this.enemies.create(pos.x, pos.y, gallinaTexture);
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-120, 120), 20);
            enemy.health = 35;
            enemy.damage = 18;
            enemy.enemyType = 'gallina';
            
            if (this.anims.exists('gallina-run')) {
                enemy.anims.play('gallina-run');
            }
        });
    }

    levelComplete() {
        this.physics.pause();
        
        const { width, height } = this.sys.game.config;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8)
            .setScrollFactor(0).setDepth(2000);
        
        const title = this.add.text(width/2, height/2 - 100, '🎉 ¡NIVEL COMPLETADO!', {
            fontSize: '32px', color: '#2ecc71', fontStyle: 'bold', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        const nextBtn = this.add.text(width/2 - 100, height/2 + 80, '➡️ SIGUIENTE', {
            fontSize: '18px', color: '#2ecc71', backgroundColor: '#000000', padding: 10
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setInteractive();
        
        const menuBtn = this.add.text(width/2 + 100, height/2 + 80, '🏠 MENÚ', {
            fontSize: '18px', color: '#e74c3c', backgroundColor: '#000000', padding: 10
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setInteractive();
        
        nextBtn.on('pointerdown', () => {
            this.gameState.level++;
            this.scene.restart();
        });
        
        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    gameOver() {
        this.physics.pause();
        
        const { width, height } = this.sys.game.config;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9)
            .setScrollFactor(0).setDepth(2000);
        
        const title = this.add.text(width/2, height/2 - 50, '💀 GAME OVER', {
            fontSize: '48px', color: '#e74c3c', fontStyle: 'bold', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
        
        const restartBtn = this.add.text(width/2, height/2 + 50, '🔄 REINTENTAR', {
            fontSize: '18px', color: '#f39c12', backgroundColor: '#000000', padding: 10
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setInteractive();
        
        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    // ===== UPDATE LOOP =====
    update() {
        if (this.isGamePaused) return;

        this.handlePlayerMovement();
        this.handlePlayerAnimation();
        this.updateCompanion();
        this.updateEnemies();
        
        // ESC para menú
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.scene.start('MenuScene');
        }


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
    this.moto.play('moto-idle', true);
}

this.moto.setVelocityX(velocityX);

// Salto si quieres
if ((this.keys.SPACE.isDown || this.keys.W.isDown || this.cursors.up.isDown) && 
    this.moto.body.touching.down) {
    this.moto.setVelocityY(-330);
}

    }

    handlePlayerMovement() {
        if (!this.player) return;

        let velocityX = 0;
        let isMoving = false;

        if (this.keys.A.isDown || this.cursors.left.isDown) {
            velocityX = -160;
            this.player.setFlipX(true);
            isMoving = true;
        } else if (this.keys.D.isDown || this.cursors.right.isDown) {
            velocityX = 160;
            this.player.setFlipX(false);
            isMoving = true;
        }

        if (this.keys.SHIFT.isDown && isMoving) {
            velocityX *= 1.8;
        }

        if ((this.keys.SPACE.isDown || this.keys.W.isDown || this.cursors.up.isDown) && 
            this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        this.player.setVelocityX(velocityX);

        if (Phaser.Input.Keyboard.JustDown(this.keys.J)) {
            this.performAttack();
        }
    }

    handlePlayerAnimation() {
        if (!this.player) return;

        if (!this.player.body.touching.down) {
            // En el aire
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

        if (distance > 120) {
            const direction = this.player.x > this.companion.x ? 1 : -1;
            this.companion.setVelocityX(direction * 140);
            this.companion.setFlipX(direction < 0);

            if (this.anims.exists('amigo-run')) {
                this.companion.anims.play('amigo-run', true);
            }

            if (this.companion.body.touching.down && this.player.y < this.companion.y - 40) {
                this.companion.setVelocityY(-300);
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
            if (enemy.enemyType === 'rino') {
                this.updateRino(enemy);
            } else if (enemy.enemyType === 'gallina') {
                // Comportamiento normal de gallina
                if (Math.random() < 0.005) {
                    enemy.setVelocityX(Phaser.Math.Between(-100, 100));
                    enemy.setFlipX(enemy.body.velocity.x < 0);
                    
                    if (this.anims.exists('gallina-run')) {
                        enemy.anims.play('gallina-run', true);
                    }
                }
            }
        });
    }

    updateRino(rino) {
        // Si está aturdido, no hace nada por un tiempo
        if (rino.stunned) return;
        
        // Detectar si el jugador está cerca para cargar
        const distanceToPlayer = Phaser.Math.Distance.Between(
            rino.x, rino.y, this.player.x, this.player.y
        );
        
        if (!rino.isCharging && distanceToPlayer < 150 && Math.abs(rino.y - this.player.y) < 50) {
            // ¡INICIAR CARGA!
            rino.isCharging = true;
            rino.chargeDirection = this.player.x > rino.x ? 1 : -1;
            rino.setVelocityX(rino.chargeDirection * 200); // Velocidad de carga rápida
            rino.setFlipX(rino.chargeDirection < 0);
            
            if (this.anims.exists('rino-run')) {
                rino.anims.play('rino-run');
            }
            
            console.log("🦏 ¡Rino cargando!");
            
        } else if (rino.isCharging) {
            // Continuar carga hasta golpear algo
            if (rino.body.blocked.left || rino.body.blocked.right) {
                // ¡Golpeó una pared!
                this.rinoHitWall(rino);
            }
            
        } else {
            // Comportamiento normal (patrulla lenta)
            if (Math.random() < 0.003) {
                const newVelocity = Phaser.Math.Between(-40, 40);
                rino.setVelocityX(newVelocity);
                rino.setFlipX(newVelocity < 0);
                
                if (Math.abs(newVelocity) > 20) {
                    if (this.anims.exists('rino-run')) {
                        rino.anims.play('rino-run', true);
                    }
                } else {
                    if (this.anims.exists('rino-idle')) {
                        rino.anims.play('rino-idle', true);
                    }
                }
            }
        }
    }

    rinoHitWall(rino) {
        // El rino golpeó una pared, se aturde
        rino.isCharging = false;
        rino.stunned = true;
        rino.setVelocityX(0);
        
        if (this.anims.exists('rino-hit-wall')) {
            rino.anims.play('rino-hit-wall');
        }
        
        // Efecto visual
        this.cameras.main.shake(300, 0.02);
        
        // Recuperarse después de 2 segundos
        this.time.delayedCall(2000, () => {
            rino.stunned = false;
            if (this.anims.exists('rino-idle')) {
                rino.anims.play('rino-idle');
            }
        });
        
        console.log("💥 ¡Rino golpeó la pared y se aturdió!");
    }
}