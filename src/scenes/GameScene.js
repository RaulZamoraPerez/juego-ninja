import AssetManager from '../managers/AssetManager.js';
import PlayerManager from '../managers/PlayerManager.js';
import EnemyManager from '../managers/EnemyManager.js';
import UIManager from '../managers/UIManager.js';
import { createFireEffect } from '../utils/fireEffect.js';



/**
 * GameScene.js
 * - Escena principal donde ocurre todo el juego
 * - Inicializa y conecta todos los managers
 * - Coordina la lógica general del juego
 */

class GameScene extends Phaser.Scene {
    showMotocleDialog() {
        // No hacer nada: se elimina el globo de texto de Motocle
    }

    destroyMotocleDialog() {
        if (this.motocleDialogBubble) {
            if (this.motocleDialogBubble.bg && this.motocleDialogBubble.bg.destroy) this.motocleDialogBubble.bg.destroy();
            if (this.motocleDialogBubble.text && this.motocleDialogBubble.text.destroy) this.motocleDialogBubble.text.destroy();
            this.motocleDialogBubble = null;
        }
    }

    cancelMotocleTimers() {
        if (this.motocleEntryTimer) {
            this.motocleEntryTimer.remove();
            this.motocleEntryTimer = null;
        }
        if (this.motocleEntryTween) {
            this.tweens.remove(this.motocleEntryTween);
            this.motocleEntryTween = null;
        }
    }

    // Inicializar mensajes de Motocle (historia + peticiones)
    initMotocleMessages() {
        // Mensajes por defecto: puedes editarlos aquí
        this.motocleMessages = [
            { text: '¡Hola chavos! Me secuestraron los Bandidos Sombríos. ¡Por favor, ayúdenme!', duration: 3500 },
            { text: 'Mi familia está en la colina del faro. Recolecten monedas para abrir el portal.', duration: 4200 },
            { text: 'Cuidado con los lobos: ataca cuando brillen en rojo. ¡Buena suerte!', duration: 3500 }
        ];
    }

    // Muestra la secuencia de mensajes de Motocle uno tras otro
showMotocleSequence() {
    if (!this.motocle || !this.motocle.active) return;
    if (!this.motocleMessages || !this.motocleMessages.length) this.initMotocleMessages();
    let idx = 0;
    const showNext = () => {
        if (!this.scene.isActive()) return;
        if (idx >= this.motocleMessages.length) return;
        const msg = this.motocleMessages[idx];
        
        // Destruir el cuadro de diálogo anterior
        if (this.motocleDialogBubble) {
            if (this.motocleDialogBubble.floatTween) {
                this.motocleDialogBubble.floatTween.stop();
                this.motocleDialogBubble.floatTween.remove();
            }
            if (this.motocleDialogBubble.container) {
                this.motocleDialogBubble.container.destroy();
            }
            if (this.motocleDialogBubble.pointer) {
                this.motocleDialogBubble.pointer.destroy();
            }
            this.motocleDialogBubble = null;
        }
        
        const mx = this.motocle.x;
        const my = this.motocle.y - this.motocle.displayHeight;
        
        // Configuración
        const padding = 18;
        const maxWidth = 300;
        
        // Crear texto temporal COMPLETO para medir correctamente
        const tempText = this.add.text(0, 0, msg.text, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '15px',
            color: '#2c3e50',
            align: 'center',
            wordWrap: { width: maxWidth - padding * 2 },
            lineSpacing: 4,
        }).setOrigin(0.5, 0.5);
        
        // Obtener dimensiones reales del texto renderizado
        const bounds = tempText.getBounds();
        const textWidth = bounds.width;
        const textHeight = bounds.height;
        tempText.destroy();
        
        // Calcular dimensiones del cuadro con padding
        const boxWidth = Math.min(textWidth + padding * 2, maxWidth);
        const boxHeight = textHeight + padding * 2;
        
        // Posición Y del cuadro (arriba del personaje)
        const boxY = my - boxHeight - 15;
        
        // Crear contenedor para el cuadro
        const container = this.add.container(mx, boxY).setDepth(2000);
        
        // Crear fondo del cuadro de diálogo
        const bg = this.add.graphics();
        // Sombra
        bg.fillStyle(0x000000, 0.15);
        bg.fillRoundedRect(-boxWidth/2 + 2, -boxHeight/2 + 2, boxWidth, boxHeight, 12);
        // Fondo blanco
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 12);
        
        // Borde del cuadro
        const border = this.add.graphics();
        border.lineStyle(3, 0x4a90e2, 1);
        border.strokeRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 12);
        
        // Crear texto final centrado
        const text = this.add.text(0, 0, msg.text, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '15px',
            color: '#2c3e50',
            align: 'center',
            wordWrap: { width: maxWidth - padding * 2 },
            lineSpacing: 4,
        }).setOrigin(0.5, 0.5);
        
        // Agregar elementos al contenedor
        container.add([bg, border, text]);
        
        // Triángulo apuntador (fuera del contenedor)
        const pointer = this.add.graphics();
        pointer.setPosition(mx, boxY + boxHeight/2);
        // Sombra del triángulo
        pointer.fillStyle(0x000000, 0.15);
        pointer.fillTriangle(-10, 2, 10, 2, 0, 14);
        // Triángulo blanco
        pointer.fillStyle(0xffffff, 1);
        pointer.fillTriangle(-10, 0, 10, 0, 0, 12);
        // Borde del triángulo
        pointer.lineStyle(3, 0x4a90e2, 1);
        pointer.beginPath();
        pointer.moveTo(-10, 0);
        pointer.lineTo(0, 12);
        pointer.lineTo(10, 0);
        pointer.strokePath();
        pointer.setDepth(2000);
        
        // Guardar posiciones originales para la flotación
        const containerStartY = container.y;
        const pointerStartY = pointer.y;
        
        // Animación de entrada
        container.setAlpha(0).setScale(0.85);
        pointer.setAlpha(0).setScale(0.85);
        
        this.tweens.add({
            targets: [container, pointer],
            alpha: 1,
            scale: 1,
            duration: 350,
            ease: 'Back.easeOut',
        });
        
        // Animación de flotación
        const floatTween = this.tweens.add({
            targets: [container, pointer],
            y: '+=2',
            duration: 1800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
        
        this.motocleDialogBubble = { container, pointer, floatTween };
        
        // Configurar scroll
        try {
            container.setScrollFactor(1);
            pointer.setScrollFactor(1);
            if (this.uiCamera && this.uiCamera.ignore) {
                this.uiCamera.ignore([container, pointer]);
            }
        } catch (e) {}
        
        idx++;
        
        // Programar el siguiente mensaje
        this.time.delayedCall(msg.duration, () => {
            if (!this.scene.isActive()) return;
            
            // Detener flotación
            if (floatTween) {
                floatTween.stop();
                floatTween.remove();
            }
            
            // Animación de salida
            this.tweens.add({
                targets: [container, pointer],
                alpha: 0,
                scale: 0.85,
                duration: 250,
                ease: 'Power2',
                onComplete: () => {
                    container.destroy();
                    pointer.destroy();
                    this.motocleDialogBubble = null;
                    
                    // Mostrar el siguiente mensaje
                    if (idx < this.motocleMessages.length) {
                        showNext();
                    }
                },
            });
        });
    };
    showNext();
}
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
    // Cargar sprites de Motocle (solo una vez, aquí)
    this.load.spritesheet('motocle_run', 'assets/motocle/Motocle.png', { frameWidth: 290, frameHeight: 262 }); // 870/290=3 frames
    this.load.spritesheet('motocle_quieto2', 'assets/motocle/motocle_quieto2.png', { frameWidth: 255, frameHeight: 270 });
    }

    create() {
    console.log('GameScene create called');
    // Limpiar cualquier residuo de Motocle anterior
    this.destroyMotocleDialog();
    if (this.motocle && this.motocle.destroy) {
        this.motocle.destroy();
        this.motocle = null;
    }
    // Bandera para evitar múltiples entradas de Motocle
    this.motocleHasEntered = false;
    // Bandera para evitar múltiples saludos de Motocle
    this.motocleGreetingShown = false;
    // Bandera para evitar múltiples completaciones de tween
    this.motocleTweenCompleted = false;
    // Referencias para cancelar timers y tweens
    this.motocleEntryTimer = null;
    this.motocleEntryTween = null;
        // Animación de entrada de Motocle
        // Ajustar escala y posición para que Motocle sea del tamaño de los demás y pise el suelo
    const MOTOCLE_SCALE = 0.16;
    const MOTOCLE_QUIETO2_SCALE = 0.16; // Igual que correr
    // Usar físicas igual que el jugador y compañero
    // Usar la misma Y que el jugador y compañero
    const PLAYER_BASE_Y = 450;
    // Eliminar cualquier Motocle existente (de escenas anteriores)
    this.children.list.filter(child => child.texture && (child.texture.key === 'motocle_run' || child.texture.key === 'motocle_quieto2')).forEach(motocle => {
        console.log('Destruyendo Motocle existente:', motocle);
        motocle.destroy();
    });
    // Crear Motocle
    this.motocle = this.physics.add.sprite(-200, PLAYER_BASE_Y, 'motocle_run', 0).setDepth(100);
    this.motocle.setScale(MOTOCLE_SCALE);
    this.motocle.setBounce(0.2);
    this.motocle.setCollideWorldBounds(true);
    this.motocle.setOrigin(0.5, 1);
    this.motocle.body.setOffset(0, this.motocle.height * (1 - this.motocle.originY));
    this.motocle.setVisible(false);
    this.motocle.setActive(false);
    console.log('Motocle texture exists:', this.textures.exists('motocle_run'));
    console.log('Motocle created at:', this.motocle.x, this.motocle.y, 'visible:', this.motocle.visible, 'active:', this.motocle.active);
    // Eliminar cualquier Motocle extra (personajes bugueados)
    this.children.list.filter(child => child !== this.motocle && child.texture && (child.texture.key === 'motocle_run' || child.texture.key === 'motocle_quieto2')).forEach(extra => {
        console.log('Destruyendo Motocle extra:', extra);
        extra.destroy();
    });
    // Eliminar cualquier texto extra con '¡Hola chavos!'
    this.children.list.filter(child => child.type === 'Text' && child.text === '¡Hola chavos!').forEach(text => {
        console.log('Destruyendo texto existente:', text);
        text.destroy();
    });
    this.motocleDialogBubble = null;

    // Animaciones Motocle
    this.anims.create({
        key: 'motocle_run_anim',
        frames: this.anims.generateFrameNumbers('motocle_run', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'motocle_quieto2_anim',
        frames: [ { key: 'motocle_quieto2', frame: 0 } ],
        frameRate: 1,
        repeat: -1
    });

    // Evitar ejecutar la entrada de Motocle más de una vez (guard global)
    if (!window.motocleEntryExecuted) {
        // Esperar unos segundos antes de que Motocle entre corriendo
        this.motocleEntryTimer = this.time.delayedCall(3000, () => {
            if (!this.scene.isActive()) return; // No ejecutar si la escena no está activa
            console.log('DelayedCall ejecutado, motocleHasEntered:', this.motocleHasEntered);
            if (!this.motocleHasEntered) {
                console.log('Entrando Motocle');
                this.motocleHasEntered = true;
                this.motocle.setVisible(true);
                this.motocle.setActive(true);
                this.motocle.x = -200;
                this.motocle.play('motocle_run_anim');
                console.log('Motocle activated at:', this.motocle.x, this.motocle.y);
                // Asegurar que sólo haya un tween activo para Motocle
                    if (!this.motocleEntryTween) {
                    // Tween más lento para que la entrada no sea tan rápida
                    this.motocleEntryTween = this.tweens.add({
                        targets: this.motocle,
                        x: 320,
                        duration: 4200,
                        ease: 'Power1',
                        onComplete: () => {
                            if (!this.scene.isActive()) return; // No ejecutar si la escena no está activa
                            if (!this.motocleTweenCompleted) {
                                this.motocleTweenCompleted = true;
                                console.log('Tween completado, motocleGreetingShown:', this.motocleGreetingShown);
                                this.motocle.play('motocle_quieto2_anim');
                                this.motocle.setScale(MOTOCLE_QUIETO2_SCALE);
                                // Mostrar la secuencia de mensajes de Motocle (historia + petición de ayuda)
                                if (!this.motocleGreetingShown) {
                                    this.motocleGreetingShown = true;
                                    try { this.showMotocleSequence(); } catch (e) { console.log('Error mostrando secuencia de Motocle:', e); }
                                }
                            }
                        }
                    });
                }
            }
        });
        window.motocleEntryExecuted = true;
    } else {
        console.log('Saltando entrada de Motocle porque window.motocleEntryExecuted ya está en true');
    }
        // Asegurar colisión de Motocle con plataformas después de crear plataformas
        if (this.platforms) {
            this.physics.add.collider(this.motocle, this.platforms);
        }
    // (Líneas duplicadas eliminadas)

        console.log("🎮 Iniciando GameScene...");
        
        // Configurar controles primero para que this.keys esté disponible
        this.setupControls();

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
        // Vida del compañero (solo en la UI)
        this.companionMaxHealth = 200;
        this.companionHealth = 200;
        this.createCoins();
        this.enemyManager.createEnemies();
        this.createItems();

        // Crear AngryPigs adicionales para Nivel 1
        this.addAngryPigsLevel1();

        // Setup final
        this.setupPhysics();
        // Crear cámara fija para la UI
        this.uiCamera = this.cameras.add(0, 0, width, height, false, 'UICam');
        this.uiCamera.setScroll(0, 0);
        this.uiCamera.setZoom(1);
        this.uiCamera.ignore([]); // Inicialmente no ignora nada

        this.uiManager.createUI();
        // Asegurar que todos los elementos de la UI estén en la cámara de UI
        if (this.uiManager.uiContainer) {
            this.uiCamera.ignore(this.children.list.filter(obj => !this.uiManager.uiContainer.list.includes(obj)));
        }

        // Mostrar instrucciones de zoom
        if (!this.zoomText) {
            this.zoomText = this.add.text(10, 10, 'Zoom: + / -', {
                font: '16px Arial',
                fill: '#fff',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: { x: 8, y: 4 },
                fixedWidth: 120
            }).setScrollFactor(0).setDepth(2000);
            this.uiCamera.ignore(this.zoomText);
        }
        this.setupCamera();


    // EJEMPLO: Crear fuego visual en el escenario (cerca del inicio del jugador)
    // Flamas ambientales en varias posiciones para dar ambiente
    createFireEffect(this, 200, 520, { color: 0xff6600, numParticles: 22, radius: 12 });
    createFireEffect(this, 400, 500, { color: 0xffcc00, numParticles: 16, radius: 10 });
    createFireEffect(this, 700, 540, { color: 0xff3300, numParticles: 18, radius: 14 });
    createFireEffect(this, 1200, 520, { color: 0xff6600, numParticles: 20, radius: 13 });
    createFireEffect(this, 1800, 530, { color: 0xffcc00, numParticles: 15, radius: 11 });

        // Destruir el globo de Motocle al salir de la escena
        this.events.on('shutdown', () => {
            this.destroyMotocleDialog();
            this.cancelMotocleTimers();
            if (this.motocle) {
                this.motocle.destroy();
                this.motocle = null;
            }
            // Reset guard global para permitir re-entrada en futuras escenas
            try { window.motocleEntryExecuted = false; } catch(e) {}
        }, this);
        this.events.on('destroy', () => {
            this.destroyMotocleDialog();
            this.cancelMotocleTimers();
            if (this.motocle) {
                this.motocle.destroy();
                this.motocle = null;
            }
            // Reset guard global para permitir re-entrada en futuras escenas
            try { window.motocleEntryExecuted = false; } catch(e) {}
        }, this);
        // Limpiar si se reanuda la escena (por si acaso)
        this.events.on('resume', () => {
            this.destroyMotocleDialog();
            this.cancelMotocleTimers();
            if (this.motocle) {
                this.motocle.destroy();
                this.motocle = null;
            }
            this.motocleHasEntered = false;
            this.motocleGreetingShown = false;
            this.motocleTweenCompleted = false;
            try { window.motocleEntryExecuted = false; } catch(e) {}
        }, this);

        console.log("✅ GameScene creado exitosamente");;
    }

    setupControls() {
        // Unificar todas las teclas en this.keys
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,I,ENTER,ESC,LEFT,RIGHT,UP,DOWN,Z,X');
        // Para compatibilidad con PlayerManager:
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomStep = 0.1;
        this.minZoom = 0.5;
        this.maxZoom = 2.5;
        // Mostrar instrucciones en pantalla
        if (!this.zoomText) {
            this.zoomText = this.add.text(10, 10, 'Zoom: Z (acerca) / X (aleja)', {
                font: '16px Arial',
                fill: '#fff',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: { x: 8, y: 4 },
                fixedWidth: 220
            }).setScrollFactor(0).setDepth(1000);
        }
        
        console.log("✅ Controles configurados");
    }

    update() {
        // Si el texto existe, actualizar su posición para que siga a Motocle
        if (this.motocleDialogBubble && this.motocleDialogBubble.text) {
            const mx = this.motocle.x;
            const my = this.motocle.y - this.motocle.displayHeight;
            this.motocleDialogBubble.text.x = mx;
            this.motocleDialogBubble.text.y = my - 30;
        }
        // Ya no se dibuja barra de vida flotante del compañero (solo en la UI superior)
        if (this.isGamePaused) return;

        // Si el jugador está muerto pero el compañero sigue vivo, la cámara sigue al compañero
        if (this.player && !this.player.active && this.companion && this.companion.active) {
            if (this.cameras.main._follow !== this.companion) {
                this.cameras.main.startFollow(this.companion);
            }
        }
        // Si ambos están muertos, no seguir a nadie
        if ((!this.player || !this.player.active) && (!this.companion || !this.companion.active)) {
            this.cameras.main.stopFollow();
        }

        // Solo permitir controles si el jugador está activo
        if (this.player && this.player.active) {
            this.playerManager.handleMovement(this.keys);
        }
        // El compañero siempre puede moverse si está activo
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
        // Zoom dinámico con teclas Z (acercar) y X (alejar) SOLO en la cámara principal (no la de UI)
        let cam = this.cameras.main;
        if (this.keys.Z && Phaser.Input.Keyboard.JustDown(this.keys.Z)) {
            cam.setZoom(Math.min(this.maxZoom, cam.zoom + this.zoomStep));
            if (this.zoomText) this.zoomText.setText('Zoom: ' + cam.zoom.toFixed(2));
            console.log('Zoom +', cam.zoom);
        }
        if (this.keys.X && Phaser.Input.Keyboard.JustDown(this.keys.X)) {
            cam.setZoom(Math.max(this.minZoom, cam.zoom - this.zoomStep));
            if (this.zoomText) this.zoomText.setText('Zoom: ' + cam.zoom.toFixed(2));
            console.log('Zoom -', cam.zoom);
        }
    }

    // Permite que el compañero reciba daño de enemigos
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
            // Si muere, desaparecer
            if (companion.health <= 0) {
                companion.setActive(false).setVisible(false);
                this.uiManager.updateCompanionHealth && this.uiManager.updateCompanionHealth();
                console.log('💀 Compañero eliminado');
                // Si ambos están muertos, game over
                if ((!this.player || !this.player.active) && (!this.companion || !this.companion.active)) {
                    this.gameOver();
                }
            }
        } else {
            console.log("🛡️ Compañero invulnerable - sin daño");
        }
        // Asegurar que la UI siempre esté fija y visible
        if (this.uiManager.uiContainer) {
            this.uiManager.uiContainer.setScrollFactor(0);
            this.uiManager.uiContainer.setDepth(1000);
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

    addAngryPigsLevel1() {
        const angryPigTexture = this.textures.exists('angrypig-idle') ? 'angrypig-idle' : 'gallinaFallback';
        
        const pigPositions = [
            { x: 500, y: 400 },
            { x: 1000, y: 380 },
            { x: 1500, y: 300 }
        ];
        
        pigPositions.forEach(pos => {
            const pig = this.enemies.create(pos.x, pos.y, angryPigTexture);
            pig.setBounce(0.1);
            pig.setCollideWorldBounds(true);
            pig.setVelocity(Phaser.Math.Between(-60, 60), 0);
            pig.health = 50; // Vida media para nivel 1
            pig.damage = 15; // Daño moderado
            pig.enemyType = 'angrypig';
            pig.setScale(1.2);
            pig.isLevel2 = false; // Marcar como nivel 1
            
            // Propiedades específicas del AngryPig
            pig.isAngry = false;
            pig.hasAngryTint = false;
            pig.patrolTimer = 0;
            pig.randomMoveTimer = 0;
            pig.angryStartTime = 0;
            
            if (this.anims.exists('angrypig-idle')) {
                pig.anims.play('angrypig-idle', true);
            }
            
            console.log(`🐷 AngryPig Nivel 1 creado en (${pos.x}, ${pos.y})`);
        });
        
        console.log(`✅ ${pigPositions.length} AngryPigs agregados al Nivel 1`);
    }

    setupPhysics() {
        // Colisiones
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.companion, this.platforms);
    this.physics.add.collider(this.motocle, this.platforms); // Motocle pisa igual que los demás
    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.items, this.platforms);

    // Interacciones
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.companion, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.enemyManager.hitEnemy.bind(this.enemyManager), null, this);
    // Daño al compañero
    this.physics.add.overlap(this.companion, this.enemies, this.hitCompanion, null, this);
    console.log("✅ Físicas configuradas");
    }

    setupCamera() {
        const worldWidth = 2400;
        this.cameras.main.setBounds(0, 0, worldWidth, this.sys.game.config.height);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setZoom(1.5); // Zoom inicial
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.gameState.score += 100;
        this.gameState.coinsCollected++;
        
        this.uiManager.updateScore();
        this.uiManager.updateCoins();
        
        if (this.gameState.coinsCollected >= this.gameState.totalCoins) {
            this.showVictoryMessage();
        }
    }

    showVictoryMessage() {
        console.log("🏆 NIVEL 1 COMPLETADO!");
        
        const victoryText = this.add.text(400, 200, '¡NIVEL COMPLETADO!', {
            font: '36px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);
        
        const continueText = this.add.text(400, 250, 'Presiona ESPACIO para el Nivel 2', {
            font: '18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);
        
        // Permitir avanzar al nivel 2
        const advanceToLevel2 = () => {
            if (this.keys.SPACE && Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
                this.scene.start('Level2Scene', {
                    score: this.gameState.score,
                    health: this.gameState.health,
                    coinsCollected: 0, // Resetear monedas para el nuevo nivel
                    enemiesKilled: this.gameState.enemiesKilled
                });
            }
        };
        
        // Agregar listener para avanzar
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('Level2Scene', {
                score: this.gameState.score,
                health: this.gameState.health,
                coinsCollected: 0,
                enemiesKilled: this.gameState.enemiesKilled
            });
        });
        
        // Auto-avanzar después de 5 segundos si no presiona nada
        this.time.delayedCall(5000, () => {
            this.scene.start('Level2Scene', {
                score: this.gameState.score,
                health: this.gameState.health,
                coinsCollected: 0,
                enemiesKilled: this.gameState.enemiesKilled
            });
        });
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