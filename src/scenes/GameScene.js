import AssetManager from '../managers/AssetManager.js';
import PlayerManager from '../managers/PlayerManager.js';
import EnemyManager from '../managers/EnemyManager.js';
import UIManager from '../managers/UIManager.js';



/**
 * GameScene.js
 * - Escena principal donde ocurre todo el juego
 * - Inicializa y conecta todos los managers
 * - Coordina la lógica general del juego
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.gameState = {
            score: 0,
            health: 200,
            maxHealth: 200,
            coinsCollected: 0,
            totalCoins: 0,
            enemiesKilled: 0,
            level: 1
        };
        this.isGamePaused = false;
    }

    preload() {
        this.assetManager = new AssetManager(this);
        this.assetManager.preloadAssets();
    }

    create() {
        console.log("🎮 Iniciando GameScene...");
        
        // Inicializar managers
        this.playerManager = new PlayerManager(this);
        this.enemyManager = new EnemyManager(this);
        this.uiManager = new UIManager(this);

        // Configurar mundo
        const { width, height } = this.sys.game.config;
        const worldWidth = 2400;
        this.physics.world.setBounds(0, 0, worldWidth, height);

        // Crear mundo
        this.assetManager.createFallbackTextures();
        this.createBackground();
        this.createPlatforms();
        this.assetManager.createAnimations();
        
        // Crear entidades
        this.playerManager.createPlayer();
        this.playerManager.createCompanion();
        this.createCoins();
        this.enemyManager.createEnemies();
        this.createItems();
        
        // Setup final
        this.setupControls();
        this.setupPhysics();
        this.uiManager.createUI();
        this.setupCamera();
        
        console.log("✅ GameScene creado exitosamente");
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.jKey = this.input.keyboard.addKey('I');
        this.enterKey = this.input.keyboard.addKey('ENTER');
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,I,ENTER,ESC');
        
        console.log("✅ Controles configurados");
    }

    update() {
        if (this.isGamePaused) return;

        this.playerManager.handleMovement();
        this.playerManager.handleAnimations();
        this.enemyManager.updateEnemies();
        this.autoHeal();
        
        // Ataques
        if (this.jKey && Phaser.Input.Keyboard.JustDown(this.jKey)) {
            this.playerManager.performAttack();
        }

        if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.playerManager.performCompanionAttack();
        }
        
        // ESC para menú
        if (this.keys.ESC && Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.scene.start('MenuScene');
        }
    }

    autoHeal() {
        if (!this.lastHeal) this.lastHeal = 0;
        
        const currentTime = this.time.now;
        if (currentTime - this.lastHeal > 2000 && 
            this.player.health < this.gameState.maxHealth) {
            
            this.player.health += 1;
            this.gameState.health = this.player.health;
            this.uiManager.updateHealth();
            this.lastHeal = currentTime;
        }
    }

    // Métodos simples que permanecen en GameScene
    // Si el fondo debe repetirse en lugar de escalarse:
    // VERSIÓN AUTOMÁTICA que se adapta al tamaño de pantalla:
    // RECOMENDADO - Fondo que se adapta pero sin zoom excesivo
    // ALTERNATIVA MÁS SIMPLE - Escalado controlado
    // VERSIÓN CON CAPAS - Más bonito y profesional
    // VERSIÓN SIMPLE - Perfecta para 800x450
    createBackground() {
        const { width, height } = this.sys.game.config;
        const worldWidth = 2400;
        
        if (this.textures.exists('sky')) {
            // ✅ CON LAS DIMENSIONES EXACTAS (800x450)
            const bgOriginalWidth = 800;
            const scale = height / 450; // Escala basada en la altura
            const scaledWidth = bgOriginalWidth * scale;
            
            // ✅ CALCULAR POSICIONES SIN HUECOS
            const numBackgrounds = Math.ceil(worldWidth / scaledWidth) + 1;
            
            for (let i = 0; i < numBackgrounds; i++) {
                const x = i * scaledWidth;
                this.add.image(x + scaledWidth/2, height/2, 'sky').setScale(scale);
            }
            
            console.log(`✅ Fondo 800x450 repetido ${numBackgrounds} veces con escala ${scale.toFixed(2)}`);
            
        } else {
            this.add.rectangle(worldWidth/2, height/2, worldWidth, height, 0x87CEEB);
        }
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        const groundTexture = this.textures.exists('ground') ? 'ground' : null;
        
        // ✅ DIMENSIONES CORRECTAS: 32x8 píxeles
        const tileWidth = 32;
        const tileHeight = 8;
        
        if (groundTexture) {
            // ✅ PLATAFORMAS CON ESCALADO CORRECTO
            const platformConfigs = [
                { x: 400, y: 568, tilesX: 25, tilesY: 4 },  // Plataforma base larga
                { x: 750, y: 400, tilesX: 4, tilesY: 3 },   // Plataforma media
                { x: 1200, y: 480, tilesX: 6, tilesY: 3 },  // Plataforma alta
                { x: 1600, y: 350, tilesX: 4, tilesY: 3 },  // Plataforma derecha
                { x: 2000, y: 420, tilesX: 8, tilesY: 3 }   // Plataforma final
            ];
            
            platformConfigs.forEach(config => {
                // ✅ CREAR CADA PLATAFORMA CON TILES INDIVIDUALES
                for (let row = 0; row < config.tilesY; row++) {
                    for (let col = 0; col < config.tilesX; col++) {
                        const tileX = config.x - (config.tilesX * tileWidth / 2) + (col * tileWidth) + (tileWidth / 2);
                        const tileY = config.y + (row * tileHeight);
                        
                        const tile = this.platforms.create(tileX, tileY, groundTexture);
                        tile.setScale(1, 2); // Escala normal horizontal, x2 vertical para grosor
                        tile.refreshBody();
                    }
                }
            });
            
        } else {
            // ✅ FALLBACK CON RECTÁNGULOS
            const platformPositions = [
                { x: 400, y: 568, width: 800, height: 32 },
                { x: 750, y: 400, width: 128, height: 24 },
                { x: 1200, y: 480, width: 192, height: 24 },
                { x: 1600, y: 350, width: 128, height: 24 },
                { x: 2000, y: 420, width: 256, height: 24 }
            ];

            platformPositions.forEach(pos => {
                const platform = this.add.rectangle(pos.x, pos.y, pos.width, pos.height, 0x8B4513);
                this.physics.add.existing(platform, true);
                this.platforms.add(platform);
            });
        }
        
        console.log("✅ Plataformas creadas con dimensiones correctas 32x8");
    }

    createCoins() {
        this.coins = this.physics.add.group();
        const coinTexture = this.textures.exists('coin') ? 'coin' : 'coinFallback';
        
        const coinPositions = [
            { x: 750, y: 350 }, { x: 1200, y: 430 }, { x: 1600, y: 300 }, { x: 2000, y: 370 }
        ];
        
        coinPositions.forEach(pos => {
            const coin = this.coins.create(pos.x, pos.y, coinTexture);
            coin.setBounce(0.4);
            coin.setScale(2);
            if (this.anims.exists('coin-spin')) {
                coin.anims.play('coin-spin');
            }
        });
        
        this.gameState.totalCoins = coinPositions.length;
    }

    createItems() {
        this.items = this.physics.add.group();
        const potionTexture = this.textures.exists('health-potion') ? 'health-potion' : 'coinFallback';
        
        const itemPositions = [
            { x: 1000, y: 200 }, { x: 1800, y: 150 }
        ];
        
        itemPositions.forEach(pos => {
            const item = this.items.create(pos.x, pos.y, potionTexture);
            item.setBounce(0.2);
            item.setScale(1.5);
            item.setTint(0xff6b6b);
            item.itemType = 'health';
        });
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
        this.physics.add.overlap(this.companion, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.enemyManager.hitEnemy.bind(this.enemyManager), null, this);
        
        console.log("✅ Físicas configuradas");
    }

    setupCamera() {
        const worldWidth = 2400;
        this.cameras.main.setBounds(0, 0, worldWidth, this.sys.game.config.height);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.1, 0.1);
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.gameState.score += 100;
        this.gameState.coinsCollected++;
        
        this.uiManager.updateScore();
        this.uiManager.updateCoins();
        
        if (this.gameState.coinsCollected >= this.gameState.totalCoins) {
            this.uiManager.showVictoryMessage();
        }
    }

    collectItem(player, item) {
        if (item.itemType === 'health') {
            item.destroy();
            player.health = Math.min(player.health + 50, this.gameState.maxHealth);
            this.gameState.health = player.health;
            this.uiManager.updateHealth();
            console.log("💚 Vida restaurada!");
        }
    }

    gameOver() {
        console.log("💀 GAME OVER - Iniciando escena final");
        
        this.physics.pause();
        
        // ✅ PASAR DATOS CORRECTOS A GAME OVER
        const gameData = {
            score: this.gameState.score,
            coins: this.gameState.coinsCollected,
            enemies: this.gameState.enemiesKilled || 0,
            health: this.gameState.health
        };
        
        console.log("📊 Datos finales:", gameData);
        
        this.scene.start('GameOverScene', gameData);
    }
}

export default GameScene;