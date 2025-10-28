import AssetManager from '../managers/AssetManager.js';
import PlayerManager from '../managers/PlayerManager.js';
import EnemyManager from '../managers/EnemyManager.js';
import UIManager from '../managers/UIManager.js';
import { createFireEffect } from '../utils/fireEffect.js';

/**
 * Level2Scene.js
 * - Segundo nivel del juego con fondo diferente
 * - Enemigos más difíciles y plataformas más complejas
 */

class Level2Scene extends Phaser.Scene {
    constructor() {
        super('Level2Scene');
        this.gameState = {
            score: 0,
            health: 200,
            maxHealth: 200,
            coinsCollected: 0,
            totalCoins: 0,
            enemiesKilled: 0,
            level: 2
        };
        this.isGamePaused = false;
    }

    init(data) {
        // Recibir datos del nivel anterior
        if (data) {
            this.gameState.score = data.score || 0;
            this.gameState.health = data.health || 200;
            this.gameState.coinsCollected = data.coinsCollected || 0;
            this.gameState.enemiesKilled = data.enemiesKilled || 0;
        }
        console.log("🎮 Iniciando Nivel 2 con datos:", this.gameState);
    }

    preload() {
        this.assetManager = new AssetManager(this);
        this.assetManager.preloadAssets();
        
        // Cargar fondo específico del nivel 2 (opcional)
        this.load.image('level2-bg', 'assets/image.png');
        
        // Asegurar que tenemos el fondo del nivel 1 como fallback
        if (!this.textures.exists('sky')) {
            this.load.image('sky', 'assets/fondo.png');
        }
        
        console.log("📥 Cargando assets para Nivel 2...");
    }

    create() {
        console.log('🎮 Creando Nivel 2...');
        
        // Configurar controles
        this.setupControls();

        // Inicializar managers
        this.playerManager = new PlayerManager(this);
        this.enemyManager = new EnemyManager(this);
        this.uiManager = new UIManager(this);

        // ✅ CONFIGURAR MUNDO MÁS GRANDE PARA 1000x600
        const { width, height } = this.sys.game.config;
        const worldWidth = 4000; // Más grande para pantalla de 1000px
        this.physics.world.setBounds(0, 0, worldWidth, height);

        console.log(`🌍 Mundo configurado: ${worldWidth}x${height}`);

        // Crear mundo
        this.assetManager.createFallbackTextures();
        this.createLevel2Background(); // ✅ ESTO DEBERÍA MOSTRAR LOGS
        this.createLevel2Platforms();
        this.assetManager.createAnimations();

        // Crear entidades
        this.playerManager.createPlayer();
        this.playerManager.createCompanion();
        this.companionMaxHealth = 200;
        this.companionHealth = 200;
        
        this.createLevel2Coins();
        this.createLevel2Enemies();
        this.createLevel2Items();

        // Setup final
        this.setupPhysics();
        
        // Crear cámara fija para la UI
        this.uiCamera = this.cameras.add(0, 0, width, height, false, 'UICam');
        this.uiCamera.setScroll(0, 0);
        this.uiCamera.setZoom(1);
        this.uiCamera.ignore([]);

        this.uiManager.createUI();
        this.setupCamera();

        // Efectos de fuego más intensos para nivel 2
        this.createLevel2FireEffects();

        // Mostrar mensaje de nivel 2
        this.showLevelMessage();

        console.log("✅ Nivel 2 creado exitosamente");
    }

    createLevel2Background() {
        const { width, height } = this.sys.game.config;
        const worldWidth = 4000;
        
        console.log(`🔍 Dimensiones del juego: ${width}x${height}`);
        console.log(`🌍 Ancho del mundo: ${worldWidth}`);
        console.log(`📂 level2-bg existe: ${this.textures.exists('level2-bg')}`);
        console.log(`📂 sky existe: ${this.textures.exists('sky')}`);
        
        if (this.textures.exists('level2-bg')) {
            console.log(`✅ Usando textura level2-bg`);
            
            // ✅ DIMENSIONES CORRECTAS DE LA IMAGEN: 1024x490
            const bgOriginalWidth = 1024;
            const bgOriginalHeight = 490;
            
            // ⚠️ PROBLEMA: La imagen es 490px alta pero el juego es 600px alto
            // Vamos a escalar para que quepa bien sin deformarse demasiado
            
            // Opción 1: Escalar basado en altura (recomendado)
            const scaleY = height / bgOriginalHeight; // 600/490 = 1.22
            
            // Opción 2: Escalar basado en ancho si prefieres
            // const scaleX = width / bgOriginalWidth; // 1000/1024 = 0.98
            
            // Usar la escala Y para mantener proporción vertical
            const scale = scaleY;
            const scaledWidth = bgOriginalWidth * scale; // 1024 * 1.22 = 1249
            
            // Calcular repeticiones para cubrir 4000px de ancho
            const numBackgrounds = Math.ceil(worldWidth / scaledWidth) + 1; // 4000/1249 = 4 imágenes
            
            console.log(`📐 Imagen original: ${bgOriginalWidth}x${bgOriginalHeight}`);
            console.log(`📐 Escala aplicada: ${scale.toFixed(2)}`);
            console.log(`📐 Ancho tras escalar: ${scaledWidth.toFixed(2)}`);
            console.log(`📐 Repeticiones necesarias: ${numBackgrounds}`);
            
            for (let i = 0; i < numBackgrounds; i++) {
                const x = i * scaledWidth;
                const bg = this.add.image(x + scaledWidth/2, height/2, 'level2-bg');
                bg.setScale(scale);
                bg.setDepth(-1);
                console.log(`🖼️ Fondo ${i + 1} colocado en x: ${(x + scaledWidth/2).toFixed(2)}`);
            }
            
            console.log(`✅ Fondo Level 2 completado con ${numBackgrounds} imágenes`);
            
        } else if (this.textures.exists('sky')) {
            console.log(`⚠️ level2-bg no encontrado, usando fallback 'sky'`);
            
            // Usar dimensiones reales de 'sky'
            const skyTexture = this.textures.get('sky');
            const bgOriginalWidth = skyTexture.source[0].width;
            const bgOriginalHeight = skyTexture.source[0].height;
            
            const scale = height / bgOriginalHeight;
            const scaledWidth = bgOriginalWidth * scale;
            const numBackgrounds = Math.ceil(worldWidth / scaledWidth) + 1;
            
            console.log(`📐 Sky original: ${bgOriginalWidth}x${bgOriginalHeight}`);
            console.log(`📐 Sky escala: ${scale.toFixed(2)}, repeticiones: ${numBackgrounds}`);
            
            for (let i = 0; i < numBackgrounds; i++) {
                const x = i * scaledWidth;
                const bg = this.add.image(x + scaledWidth/2, height/2, 'sky');
                bg.setScale(scale);
                bg.setTint(0x9999CC);
                bg.setDepth(-1);
                console.log(`🖼️ Sky ${i + 1} colocado en x: ${(x + scaledWidth/2).toFixed(2)}`);
            }
            
            console.log(`✅ Fallback sky aplicado con tinte azul`);
            
        } else {
            console.log(`❌ Sin texturas disponibles, creando fondo de color`);
            
            const sectionWidth = 1000;
            const numSections = Math.ceil(worldWidth / sectionWidth) + 1;
            
            for (let i = 0; i < numSections; i++) {
                const x = i * sectionWidth;
                const rect = this.add.rectangle(x + sectionWidth/2, height/2, sectionWidth, height, 0x1a237e);
                rect.setDepth(-1);
                console.log(`📦 Sección ${i + 1} creada en x: ${x + sectionWidth/2}`);
            }
            
            console.log(`✅ Fondo de color creado con ${numSections} secciones`);
        }
    }

    createLevel2Platforms() {
        this.platforms = this.physics.add.staticGroup();
        const groundTexture = this.textures.exists('ground') ? 'ground' : null;
        
        const tileWidth = 32;
        const tileHeight = 8;
        
        if (groundTexture) {
            // Plataformas más complejas para nivel 2
            const platformConfigs = [
                { x: 400, y: 568, tilesX: 25, tilesY: 4 },   // Plataforma base
                { x: 600, y: 450, tilesX: 3, tilesY: 2 },    // Plataforma pequeña
                { x: 900, y: 380, tilesX: 4, tilesY: 3 },    // Plataforma media
                { x: 1300, y: 320, tilesX: 5, tilesY: 3 },   // Plataforma alta
                { x: 1700, y: 480, tilesX: 3, tilesY: 2 },   // Plataforma flotante
                { x: 2000, y: 250, tilesX: 6, tilesY: 3 },   // Plataforma muy alta
                { x: 2400, y: 400, tilesX: 4, tilesY: 3 },   // Plataforma intermedia
                { x: 2800, y: 350, tilesX: 8, tilesY: 4 },   // Plataforma final
                    // Extensiones hacia la derecha para permitir scroll y más juego
                { x: 3200, y: 420, tilesX: 6, tilesY: 3 },   // Nueva sección derecha
                { x: 3600, y: 360, tilesX: 6, tilesY: 3 },   // Plataforma derecha adicional
                { x: 3800, y: 300, tilesX: 5, tilesY: 3 }    // Remate final cerca del borde
            ];
            
            platformConfigs.forEach(config => {
                for (let row = 0; row < config.tilesY; row++) {
                    for (let col = 0; col < config.tilesX; col++) {
                        const tileX = config.x - (config.tilesX * tileWidth / 2) + (col * tileWidth) + (tileWidth / 2);
                        const tileY = config.y + (row * tileHeight);
                        
                        const tile = this.platforms.create(tileX, tileY, groundTexture);
                        tile.setScale(1, 2);
                        tile.setTint(0x8B4513); // Tinte más oscuro para nivel 2
                        tile.refreshBody();
                    }
                }
            });
        }
        
        console.log("✅ Plataformas Nivel 2 creadas");
    }

    createLevel2Coins() {
        this.coins = this.physics.add.group();
        const coinTexture = this.textures.exists('coin') ? 'coin' : 'coinFallback';
        
        // Más monedas en posiciones más difíciles
        const coinPositions = [
            { x: 600, y: 400 }, { x: 900, y: 330 }, { x: 1300, y: 270 },
            { x: 1700, y: 430 }, { x: 2000, y: 200 }, { x: 2400, y: 350 },
            { x: 2600, y: 150 }, { x: 2800, y: 300 },
            // Monedas a la derecha para explorar
            { x: 3200, y: 380 }, { x: 3400, y: 320 }, { x: 3600, y: 280 }, { x: 3800, y: 260 }
        ];
        
        coinPositions.forEach(pos => {
            const coin = this.coins.create(pos.x, pos.y, coinTexture);
            coin.setBounce(0.4);
            coin.setScale(2);
            coin.setTint(0xFFD700); // Monedas doradas para nivel 2
            if (this.anims.exists('coin-spin')) {
                coin.anims.play('coin-spin');
            }
        });
        
        this.gameState.totalCoins = coinPositions.length;
        console.log(`✅ ${coinPositions.length} monedas creadas en Nivel 2`);
    }

    createLevel2Enemies() {
        this.enemies = this.physics.add.group();
        
        // ✅ CORREGIR: Usar this.textures en lugar de this.scene.textures
        const rinoTexture = this.textures.exists('rino-idle') ? 'rino-idle' : 'gallinaFallback';
        const bluebirdTexture = this.textures.exists('bluebird-flying') ? 'bluebird-flying' : 'gallinaFallback';
        const skullTexture = this.textures.exists('skull-idle1') ? 'skull-idle1' : 'gallinaFallback';
        const angryPigTexture = this.textures.exists('angrypig-idle') ? 'angrypig-idle' : 'gallinaFallback';
        
        // ✅ INCLUIR ANGRY PIGS EN NIVEL 2 - MÁS AGRESIVOS
        const enemyPositions = [
            { x: 700, y: 400, type: 'angrypig' },   // AngryPig inicial
            { x: 800, y: 400, type: 'skull' },     
            { x: 1100, y: 150, type: 'bluebird' },
            { x: 1300, y: 350, type: 'angrypig' }, // AngryPig medio
            { x: 1400, y: 350, type: 'rino' },
            { x: 1600, y: 120, type: 'bluebird' },
            { x: 1900, y: 300, type: 'skull' },    
            { x: 2100, y: 450, type: 'angrypig' }, // AngryPig avanzado
            { x: 2200, y: 180, type: 'bluebird' },
            { x: 2500, y: 420, type: 'rino' },
            { x: 2700, y: 100, type: 'bluebird' },
            { x: 2900, y: 380, type: 'angrypig' }, // AngryPig final
            { x: 3000, y: 450, type: 'skull' },    
            // Enemigos extra en la parte derecha para dar más juego
            { x: 3200, y: 400, type: 'angrypig' },
            { x: 3400, y: 200, type: 'bluebird' },
            { x: 3600, y: 380, type: 'rino' },
            { x: 3800, y: 300, type: 'skull' }
        ];

        enemyPositions.forEach((pos, index) => {
            let enemy;
            
            if (pos.type === 'angrypig') {
                enemy = this.enemies.create(pos.x, pos.y, angryPigTexture);
                enemy.setBounce(0.1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-80, 80), 0);
                enemy.health = 75; // Más vida en nivel 2
                enemy.damage = 25; // Más daño en nivel 2
                enemy.enemyType = 'angrypig';
                enemy.setScale(1.3); // Más grande en nivel 2
                enemy.setTint(0xFF6B6B); // Tinte rojizo para nivel 2
                enemy.isLevel2 = true; // Marcar como nivel 2
                
                // Propiedades específicas del AngryPig Nivel 2
                enemy.isAngry = false;
                enemy.hasAngryTint = false;
                enemy.patrolTimer = 0;
                enemy.randomMoveTimer = 0;
                enemy.angryStartTime = 0;
                
                if (this.anims.exists('angrypig-idle')) {
                    enemy.anims.play('angrypig-idle', true);
                }
                
                console.log(`🐷💪 AngryPig Nivel 2 creado en (${pos.x}, ${pos.y})`);
                
            } else if (pos.type === 'skull') {
                enemy = this.enemies.create(pos.x, pos.y, skullTexture);
                enemy.setBounce(0);
                enemy.setCollideWorldBounds(false); // Puede atravesar límites como fantasma
                enemy.body.setGravityY(-200); // Gravedad reducida (flotante)
                enemy.setVelocity(Phaser.Math.Between(-80, 80), Phaser.Math.Between(-60, 60));
                enemy.health = 70; // Más vida que gallina pero menos que rino
                enemy.damage = 25; // Daño considerable
                enemy.enemyType = 'skull';
                enemy.setScale(1.1); // Ligeramente más grande
                enemy.setTint(0x9A4444); // Tinte rojo oscuro para aspecto siniestro
                
                // Propiedades específicas del skull
                enemy.attackCooldown = 0;
                enemy.isAttacking = false;
                enemy.patrolTimer = 0;
                enemy.ghostMoveTimer = 0;
                
                if (this.anims.exists('skull-idle1')) {
                    enemy.anims.play('skull-idle1', true);
                }
                
                console.log(`💀 Skull creado en (${pos.x}, ${pos.y})`);
                
            } else if (pos.type === 'rino') {
                enemy = this.enemies.create(pos.x, pos.y, rinoTexture);
                enemy.setBounce(0.1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(0, 0);
                enemy.health = 80;
                enemy.damage = 30;
                enemy.enemyType = 'rino';
                enemy.setScale(1.2);
                enemy.setTint(0x8B4513);
                
                if (this.anims.exists('rino-idle')) {
                    enemy.anims.play('rino-idle', true);
                }
                
            } else if (pos.type === 'bluebird') {
                enemy = this.enemies.create(pos.x, pos.y, bluebirdTexture);
                enemy.setBounce(0);
                enemy.setCollideWorldBounds(false);
                enemy.body.setGravityY(-300);
                enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-60, 60));
                enemy.health = 60;
                enemy.damage = 30;
                enemy.enemyType = 'bluebird';
                enemy.setScale(1.3);
                enemy.setTint(0x1E90FF);
                
                enemy.flightPattern = 'circle';
                enemy.centerX = pos.x;
                enemy.centerY = pos.y;
                enemy.angle = 0;
                enemy.attackCooldown = 0;
                enemy.isAttacking = false;
                
                if (this.anims.exists('bluebird-flying')) {
                    enemy.anims.play('bluebird-flying', true);
                }
            }
        });
        
        console.log(`✅ ${enemyPositions.length} enemigos creados en Nivel 2 (incluyendo AngryPigs mejorados)`);
    }

    createLevel2Items() {
        this.items = this.physics.add.group();
        const potionTexture = this.textures.exists('health-potion') ? 'health-potion' : 'coinFallback';
        
        // Más pociones debido a la mayor dificultad
        const itemPositions = [
            { x: 1000, y: 200 }, { x: 1500, y: 150 }, 
            { x: 2100, y: 100 }, { x: 2600, y: 250 },
            // Pocas pociones hacia el final para riesgo/recompensa
            { x: 3200, y: 220 }, { x: 3600, y: 180 }, { x: 3850, y: 260 }
        ];
        
        itemPositions.forEach(pos => {
            const item = this.items.create(pos.x, pos.y, potionTexture);
            item.setBounce(0.2);
            item.setScale(2); // Más grandes
            item.setTint(0x00FF00); // Verde brillante
            item.itemType = 'health';
        });
        
        console.log(`✅ ${itemPositions.length} pociones creadas en Nivel 2`);
    }

    createLevel2FireEffects() {
        // Efectos de fuego más intensos y numerosos
        const firePositions = [
            { x: 300, y: 520, color: 0xff3300, particles: 25 },
            { x: 700, y: 500, color: 0xff6600, particles: 20 },
            { x: 1100, y: 540, color: 0xffcc00, particles: 22 },
            { x: 1500, y: 520, color: 0xff3300, particles: 28 },
            { x: 1900, y: 530, color: 0xff6600, particles: 24 },
            { x: 2300, y: 510, color: 0xffcc00, particles: 26 },
            { x: 2700, y: 540, color: 0xff3300, particles: 30 }
        ];
        
        firePositions.forEach(fire => {
            createFireEffect(this, fire.x, fire.y, { 
                color: fire.color, 
                numParticles: fire.particles, 
                radius: 15 
            });
        });
    }

    showLevelMessage() {
        const levelText = this.add.text(400, 200, 'NIVEL 2', {
            font: '48px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);
        
        const subText = this.add.text(400, 250, '¡Mayor Dificultad!', {
            font: '24px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);
        
        // Animación de entrada
        this.tweens.add({
            targets: [levelText, subText],
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Desaparecer después de 3 segundos
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: [levelText, subText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    levelText.destroy();
                    subText.destroy();
                }
            });
        });
    }

    setupControls() {
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,I,ENTER,ESC,LEFT,RIGHT,UP,DOWN,Z,X');
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        console.log("✅ Controles Nivel 2 configurados");
    }

    update() {
        if (this.isGamePaused) return;

        // Control de cámara para personajes muertos
        if (this.player && !this.player.active && this.companion && this.companion.active) {
            if (this.cameras.main._follow !== this.companion) {
                this.cameras.main.startFollow(this.companion);
            }
        }
        
        if ((!this.player || !this.player.active) && (!this.companion || !this.companion.active)) {
            this.cameras.main.stopFollow();
        }

        // Controles de jugadores
        if (this.player && this.player.active) {
            this.playerManager.handleMovement(this.keys);
        }
        
        if (this.companion && this.companion.active) {
            this.playerManager.handleCompanionMovement && this.playerManager.handleCompanionMovement();
        }
        
        this.playerManager.handleAnimations();
        this.enemyManager.updateEnemies();
        this.autoHeal();
        
        // Ataques
        if (this.player && this.player.active && this.keys.I && Phaser.Input.Keyboard.JustDown(this.keys.I)) {
            this.playerManager.performAttack();
        }
        
        if (this.companion && this.companion.active && this.keys.ENTER && Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
            this.playerManager.performCompanionAttack();
        }
        
        // ESC para menú
        if (this.keys.ESC && Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.scene.start('MenuScene');
        }
        
        // Zoom
        let cam = this.cameras.main;
        if (this.keys.Z && Phaser.Input.Keyboard.JustDown(this.keys.Z)) {
            cam.setZoom(Math.min(2.5, cam.zoom + 0.1));
        }
        if (this.keys.X && Phaser.Input.Keyboard.JustDown(this.keys.X)) {
            cam.setZoom(Math.max(0.5, cam.zoom - 0.1));
        }
    }

    // Métodos idénticos al GameScene original
    hitCompanion(companion, enemy) {
        if (!companion.isInvulnerable) {
            console.log(`💔 COMPAÑERO HERIDO por ${enemy.enemyType}!`);
            if (companion.health === undefined) companion.health = 200;
            companion.health -= enemy.damage || 10;
            this.companionHealth = companion.health;
            this.uiManager.updateCompanionHealth && this.uiManager.updateCompanionHealth();
            companion.isInvulnerable = true;
            companion.setTint(0xff0000);
            const pushForce = companion.x < enemy.x ? -200 : 200;
            companion.setVelocityX(pushForce);
            companion.setVelocityY(-100);
            this.cameras.main.shake(200, 0.01);
            this.time.delayedCall(2000, () => {
                if (companion && companion.active) {
                    companion.clearTint();
                    companion.isInvulnerable = false;
                }
            });
            
            if (companion.health <= 0) {
                companion.setActive(false).setVisible(false);
                this.uiManager.updateCompanionHealth && this.uiManager.updateCompanionHealth();
                console.log('💀 Compañero eliminado');
                if ((!this.player || !this.player.active) && (!this.companion || !this.companion.active)) {
                    this.gameOver();
                }
            }
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

    setupPhysics() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.companion, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.items, this.platforms);

        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.companion, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.enemyManager.hitEnemy.bind(this.enemyManager), null, this);
        this.physics.add.overlap(this.companion, this.enemies, this.hitCompanion, null, this);
        
        console.log("✅ Físicas Nivel 2 configuradas");
    }

    setupCamera() {
        const worldWidth = 4000;
        this.cameras.main.setBounds(0, 0, worldWidth, this.sys.game.config.height);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setZoom(1.3); // Zoom ligeramente menor para ver más área
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.gameState.score += 150; // Más puntos en nivel 2
        this.gameState.coinsCollected++;
        
        this.uiManager.updateScore();
        this.uiManager.updateCoins();
        
        if (this.gameState.coinsCollected >= this.gameState.totalCoins) {
            this.showVictoryLevel2();
        }
    }

    collectItem(player, item) {
        if (item.itemType === 'health') {
            item.destroy();
            player.health = Math.min(player.health + 60, this.gameState.maxHealth); // Más curación
            this.gameState.health = player.health;
            this.uiManager.updateHealth();
            console.log("💚 Vida restaurada en Nivel 2!");
        }
    }

    showVictoryLevel2() {
        console.log("🏆 NIVEL 2 COMPLETADO!");
        
        const victoryText = this.add.text(400, 200, '¡NIVEL 2 COMPLETADO!', {
            font: '36px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);
        
        const continueText = this.add.text(400, 250, 'Felicidades, eres un verdadero ninja!', {
            font: '18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);
        
        this.time.delayedCall(3000, () => {
            this.scene.start('MenuScene');
        });
    }

    gameOver() {
        console.log("💀 GAME OVER - Nivel 2");
        
        this.physics.pause();
        
        const gameData = {
            score: this.gameState.score,
            coins: this.gameState.coinsCollected,
            enemies: this.gameState.enemiesKilled || 0,
            health: this.gameState.health,
            level: 2
        };
        
        this.scene.start('GameOverScene', gameData);
    }
}

export default Level2Scene;