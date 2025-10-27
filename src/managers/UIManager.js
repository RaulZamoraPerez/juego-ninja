/**
 *  UIManager.js
 * - Muestra la interfaz del juego (vida, puntuación, tiempo)
 * - Actualiza barras de salud y contadores
 * - Maneja elementos visuales de la pantalla
 */

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.healthText = null;
        this.coinsText = null;
        this.invulnerableText = null;
        this.healthBar = null;
        this.healthBarBg = null;
        this.uiContainer = null;
    }

    createUI() {
        // Contenedor principal del UI
        this.uiContainer = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(1000);
        // Forzar posición Y a 0 en cada frame para que nunca se mueva con el zoom/cámara
        this.scene.events.on('postupdate', () => {
            if (this.uiContainer) {
                this.uiContainer.y = 0;
            }
        });

        // Panel superior elegante
        this.createTopPanel();

        // Barra de vida moderna del jugador principal
        this.createModernHealthBar();
        // Barra de vida del compañero
        this.createCompanionHealthBar();
    }

    // --- NUEVO: Barra de vida del compañero ---
    createCompanionHealthBar() {
        const x = 25;
        const y = 55;
        const barWidth = 200;
        const barHeight = 18;

        // Etiqueta
        const label = this.scene.add.text(x, y, 'COMPAÑERO', {
            fontSize: '12px',
            color: '#a7f3d0',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            letterSpacing: '1px'
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(1001);

        // Fondo de la barra
        const barBg = this.scene.add.graphics();
        barBg.fillStyle(0x1e293b, 0.8);
        barBg.fillRoundedRect(x, y + 16, barWidth, barHeight, 8);
        barBg.lineStyle(2, 0x059669, 0.5);
        barBg.strokeRoundedRect(x, y + 16, barWidth, barHeight, 8);

        // Barra de vida
        this.companionHealthBar = this.scene.add.graphics();
        this.updateCompanionHealthBarGraphics(barWidth - 4, barHeight - 4, 1);

        // Texto de vida
        this.companionHealthText = this.scene.add.text(x + barWidth/2, y + 16 + barHeight/2,
            `${this.scene.companionHealth}/${this.scene.companionMaxHealth}`, {
            fontSize: '13px',
            color: '#a7f3d0',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

        this.uiContainer.add([label, barBg, this.companionHealthBar, this.companionHealthText]);
    }

    updateCompanionHealthBarGraphics(maxWidth, height, healthPercent) {
        this.companionHealthBar.clear();
        const currentWidth = maxWidth * healthPercent;
        // Color según la vida
        let color1, color2;
        if (healthPercent < 0.3) {
            color1 = 0x22d3ee; // Azul claro
            color2 = 0x06b6d4;
        } else if (healthPercent < 0.6) {
            color1 = 0xfbbf24; // Amarillo
            color2 = 0xf59e0b;
        } else {
            color1 = 0x10b981; // Verde
            color2 = 0x059669;
        }
        this.companionHealthBar.fillGradientStyle(color1, color1, color2, color2, 1);
        this.companionHealthBar.fillRoundedRect(27, 71, currentWidth, height, 6);
        // Brillo superior
        this.companionHealthBar.fillStyle(0xffffff, 0.18);
        this.companionHealthBar.fillRoundedRect(27, 71, currentWidth, height/3, 6);
    }

    updateCompanionHealth() {
        if (this.companionHealthBar && this.companionHealthText) {
            const health = this.scene.companionHealth !== undefined ? this.scene.companionHealth : 0;
            const maxHealth = this.scene.companionMaxHealth || 200;
            const healthPercent = Math.max(0, health / maxHealth);
            this.updateCompanionHealthBarGraphics(196, 14, healthPercent);
            this.companionHealthText.setText(`${health}/${maxHealth}`);
            // Efecto de shake al recibir daño
            this.scene.tweens.add({
                targets: this.companionHealthText,
                x: this.companionHealthText.x + 4,
                duration: 50,
                yoyo: true,
                repeat: 2
            });
        }
    }

    createTopPanel() {
        // Panel translúcido en la parte superior
        const panel = this.scene.add.graphics();
        panel.fillStyle(0x0f172a, 0.85);
        panel.fillRoundedRect(10, 10, 380, 100, 12);
        panel.lineStyle(2, 0x475569, 0.5);
        panel.strokeRoundedRect(10, 10, 380, 100, 12);
        
        this.uiContainer.add(panel);
    }

    createModernHealthBar() {
        const x = 25;
        const y = 25;
        const barWidth = 200;
        const barHeight = 24;

        // Etiqueta
        const label = this.scene.add.text(x, y, 'VIDA', {
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            letterSpacing: '1px'
        }).setOrigin(0, 0);

        // Fondo de la barra con efecto glass
        const barBg = this.scene.add.graphics();
        barBg.fillStyle(0x1e293b, 0.9);
        barBg.fillRoundedRect(x, y + 18, barWidth, barHeight, 8);
        barBg.lineStyle(2, 0x334155, 0.6);
        barBg.strokeRoundedRect(x, y + 18, barWidth, barHeight, 8);

        // Barra de vida con gradiente
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBarGraphics(barWidth - 4, barHeight - 4, 1);
        
        // Texto de vida centrado
        this.healthText = this.scene.add.text(x + barWidth/2, y + 18 + barHeight/2, 
            `${this.scene.gameState.health}/${this.scene.gameState.maxHealth}`, {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.uiContainer.add([label, barBg, this.healthBar, this.healthText]);

        // Efecto de pulso sutil cuando hay poca vida
        this.healthPulse = this.scene.tweens.add({
            targets: this.healthText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            paused: true
        });
    }

    updateHealthBarGraphics(maxWidth, height, healthPercent) {
        this.healthBar.clear();
        
        const currentWidth = maxWidth * healthPercent;
        
        // Color según la vida
        let color1, color2;
        if (healthPercent < 0.3) {
            color1 = 0xef4444; // Rojo
            color2 = 0xdc2626;
        } else if (healthPercent < 0.6) {
            color1 = 0xfbbf24; // Amarillo
            color2 = 0xf59e0b;
        } else {
            color1 = 0x10b981; // Verde
            color2 = 0x059669;
        }

        // Gradiente de vida
        this.healthBar.fillGradientStyle(color1, color1, color2, color2, 1);
        this.healthBar.fillRoundedRect(27, 45, currentWidth, height, 6);

        // Brillo superior
        this.healthBar.fillStyle(0xffffff, 0.2);
        this.healthBar.fillRoundedRect(27, 45, currentWidth, height/3, 6);
    }

    createScorePanel() {
        const x = 25;
        const y = 70;

        // Icono y texto en una línea elegante
        const scoreContainer = this.scene.add.container(x, y);

        // Fondo del score
        const scoreBg = this.scene.add.graphics();
        scoreBg.fillStyle(0x6366f1, 0.2);
        scoreBg.fillRoundedRect(0, 0, 100, 28, 8);
        scoreBg.lineStyle(2, 0x6366f1, 0.4);
        scoreBg.strokeRoundedRect(0, 0, 100, 28, 8);

        const scoreIcon = this.scene.add.text(8, 14, '★', {
            fontSize: '16px',
            color: '#fbbf24'
        }).setOrigin(0, 0.5);

        this.scoreText = this.scene.add.text(28, 14, '0', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        scoreContainer.add([scoreBg, scoreIcon, this.scoreText]);
        this.uiContainer.add(scoreContainer);
    }

    createCoinsPanel() {
        const x = 240;
        const y = 25;

        // Panel de monedas moderno
        const coinsContainer = this.scene.add.container(x, y);

        const label = this.scene.add.text(0, 0, 'MONEDAS', {
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            letterSpacing: '1px'
        }).setOrigin(0, 0);

        // Fondo
        const coinsBg = this.scene.add.graphics();
        coinsBg.fillStyle(0x1e293b, 0.9);
        coinsBg.fillRoundedRect(0, 18, 140, 50, 10);
        coinsBg.lineStyle(2, 0xfbbf24, 0.3);
        coinsBg.strokeRoundedRect(0, 18, 140, 50, 10);

        // Icono grande de moneda
        const coinIcon = this.scene.add.text(15, 43, '●', {
            fontSize: '28px',
            color: '#fbbf24'
        }).setOrigin(0.5);

        // Animación de brillo de moneda
        this.scene.tweens.add({
            targets: coinIcon,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.coinsText = this.scene.add.text(45, 43, 
            `${this.scene.gameState.coinsCollected}/${this.scene.gameState.totalCoins}`, {
            fontSize: '20px',
            color: '#fbbf24',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        coinsContainer.add([label, coinsBg, coinIcon, this.coinsText]);
        this.uiContainer.add(coinsContainer);
    }

    createInvulnerableIndicator() {
        // Indicador moderno de invulnerabilidad
        this.invulnerableContainer = this.scene.add.container(410, 20);
        this.invulnerableContainer.setAlpha(0);

        const shield = this.scene.add.graphics();
        shield.fillStyle(0xfbbf24, 0.3);
        shield.fillRoundedRect(0, 0, 150, 40, 10);
        shield.lineStyle(2, 0xfbbf24, 0.8);
        shield.strokeRoundedRect(0, 0, 150, 40, 10);

        this.invulnerableText = this.scene.add.text(75, 20, 'INVULNERABLE', {
            fontSize: '14px',
            color: '#fbbf24',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.invulnerableContainer.add([shield, this.invulnerableText]);
        this.uiContainer.add(this.invulnerableContainer);

        // Animación de pulso
        this.invulnerablePulse = this.scene.tweens.add({
            targets: this.invulnerableContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 400,
            yoyo: true,
            repeat: -1,
            paused: true
        });
    }

    createControlsHint() {
        const { width, height } = this.scene.sys.game.config;

        // Hints minimalistas en la esquina inferior derecha
        const controlsContainer = this.scene.add.container(width - 190, height - 15);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0f172a, 0.75);
        bg.fillRoundedRect(0, 0, 370, 22, 8);

        const controls = this.scene.add.text(185, 11, 
            'WASD/Flechas: Mover  •  I/ENTER: Atacar  •  ESC: Menú', {
            fontSize: '10px',
            color: '#94a3b8',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        controlsContainer.add([bg, controls]);
        controlsContainer.setScrollFactor(0).setDepth(999);
        controlsContainer.setAlpha(0.7);

        // Fade in/out al pasar el mouse (opcional)
        this.scene.input.on('pointermove', () => {
            this.scene.tweens.add({
                targets: controlsContainer,
                alpha: 0.9,
                duration: 200
            });
        });

        // Volver a fade después de 2 segundos sin movimiento
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                if (controlsContainer.alpha > 0.7) {
                    this.scene.tweens.add({
                        targets: controlsContainer,
                        alpha: 0.7,
                        duration: 500
                    });
                }
            },
            loop: true
        });
    }

    createMenuButton() {
        const { width } = this.scene.sys.game.config;

        // Botón de menú moderno en la esquina superior derecha
        const menuBtn = this.scene.add.container(width - 80, 20);

        const btnBg = this.scene.add.graphics();
        btnBg.fillStyle(0x1e293b, 0.9);
        btnBg.fillRoundedRect(0, 0, 70, 35, 8);
        btnBg.lineStyle(2, 0x475569, 0.5);
        btnBg.strokeRoundedRect(0, 0, 70, 35, 8);

        const btnText = this.scene.add.text(35, 17.5, 'MENÚ', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        menuBtn.add([btnBg, btnText]);
        menuBtn.setScrollFactor(0).setDepth(1001);
        menuBtn.setSize(70, 35);
        menuBtn.setInteractive(new Phaser.Geom.Rectangle(0, 0, 70, 35), Phaser.Geom.Rectangle.Contains);

        menuBtn.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x475569, 0.9);
            btnBg.fillRoundedRect(0, 0, 70, 35, 8);
            btnBg.lineStyle(2, 0x8b5cf6, 0.8);
            btnBg.strokeRoundedRect(0, 0, 70, 35, 8);
        });

        menuBtn.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0x1e293b, 0.9);
            btnBg.fillRoundedRect(0, 0, 70, 35, 8);
            btnBg.lineStyle(2, 0x475569, 0.5);
            btnBg.strokeRoundedRect(0, 0, 70, 35, 8);
        });

        menuBtn.on('pointerdown', () => {
            this.scene.scene.start('MenuScene');
        });
    }

    updateScore() {
        if (this.scoreText) {
            this.scoreText.setText(this.scene.gameState.score.toString());
            
            // Efecto de bounce al actualizar
            this.scene.tweens.add({
                targets: this.scoreText,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 150,
                yoyo: true,
                ease: 'Back.easeOut'
            });
        }
    }

    updateHealth() {
        if (this.healthBar && this.healthText) {
            const healthPercent = this.scene.gameState.health / this.scene.gameState.maxHealth;
            
            // Actualizar barra
            this.updateHealthBarGraphics(196, 20, healthPercent);
            
            // Actualizar texto
            this.healthText.setText(`${this.scene.gameState.health}/${this.scene.gameState.maxHealth}`);
            
            // Activar pulso si vida baja
            if (healthPercent < 0.3) {
                this.healthPulse.resume();
            } else {
                this.healthPulse.pause();
                this.healthText.setScale(1);
            }

            // Efecto de shake al recibir daño
            this.scene.tweens.add({
                targets: this.healthText,
                x: this.healthText.x + 5,
                duration: 50,
                yoyo: true,
                repeat: 2
            });
        }
    }

    updateCoins() {
        if (this.coinsText) {
            this.coinsText.setText(`${this.scene.gameState.coinsCollected}/${this.scene.gameState.totalCoins}`);
            
            // Efecto de brillo al recolectar
            this.scene.tweens.add({
                targets: this.coinsText,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 1,
                duration: 200,
                yoyo: true,
                ease: 'Back.easeOut'
            });
        }
    }

    showInvulnerable() {
        if (this.invulnerableContainer) {
            this.scene.tweens.add({
                targets: this.invulnerableContainer,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
            this.invulnerablePulse.resume();
        }
    }

    hideInvulnerable() {
        if (this.invulnerableContainer) {
            this.scene.tweens.add({
                targets: this.invulnerableContainer,
                alpha: 0,
                duration: 300,
                ease: 'Power2'
            });
            this.invulnerablePulse.pause();
        }
    }

    showVictoryMessage() {
        const { width, height } = this.scene.sys.game.config;
        
        // Panel de victoria elegante
        const victoryContainer = this.scene.add.container(width/2, height/2);
        victoryContainer.setScrollFactor(0).setDepth(2001);

        const panel = this.scene.add.graphics();
        panel.fillStyle(0x0f172a, 0.95);
        panel.fillRoundedRect(-250, -80, 500, 160, 20);
        panel.lineStyle(3, 0xfbbf24, 0.8);
        panel.strokeRoundedRect(-250, -80, 500, 160, 20);

        const title = this.scene.add.text(0, -40, '¡VICTORIA!', {
            fontSize: '40px',
            color: '#fbbf24',
            fontFamily: 'Arial Black',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const message = this.scene.add.text(0, 10, 'Todas las monedas recolectadas', {
            fontSize: '18px',
            color: '#94a3b8',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const continueText = this.scene.add.text(0, 45, 'Generando más desafíos...', {
            fontSize: '14px',
            color: '#64748b',
            fontFamily: 'Arial',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        victoryContainer.add([panel, title, message, continueText]);
        victoryContainer.setScale(0.5).setAlpha(0);

        // Animación de entrada
        this.scene.tweens.add({
            targets: victoryContainer,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Desaparecer y generar más contenido
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: victoryContainer,
                alpha: 0,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 400,
                onComplete: () => {
                    victoryContainer.destroy();
                    this.scene.enemyManager.spawnMoreEnemies();
                    this.spawnMoreCoins();
                }
            });
        });
    }

    spawnMoreCoins() {
        const coinTexture = this.scene.textures.exists('coin') ? 'coin' : 'coinFallback';
        
        const newCoinPositions = [
            { x: 300, y: 200 }, { x: 700, y: 150 }, { x: 1100, y: 180 },
            { x: 1400, y: 120 }, { x: 1700, y: 220 }, { x: 2000, y: 160 }
        ];
        
        newCoinPositions.forEach(pos => {
            const coin = this.scene.coins.create(pos.x, pos.y, coinTexture);
            coin.setBounce(0.4);
            coin.setScale(2);
            
            if (this.scene.anims.exists('coin-spin')) {
                coin.anims.play('coin-spin');
            }
        });
        
        this.scene.gameState.totalCoins += newCoinPositions.length;
        this.updateCoins();
        
        console.log(`✅ ${newCoinPositions.length} monedas nuevas generadas`);
    }

    showMessage(text, color = '#ffffff', duration = 2000) {
        const { width, height } = this.scene.sys.game.config;
        
        const messageContainer = this.scene.add.container(width/2, height/2 + 100);
        messageContainer.setScrollFactor(0).setDepth(2000);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0f172a, 0.95);
        bg.fillRoundedRect(-150, -25, 300, 50, 12);
        bg.lineStyle(2, parseInt(color.replace('#', '0x')), 0.6);
        bg.strokeRoundedRect(-150, -25, 300, 50, 12);

        const messageText = this.scene.add.text(0, 0, text, {
            fontSize: '18px',
            color: color,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        messageContainer.add([bg, messageText]);
        messageContainer.setAlpha(0).setScale(0.8);
        
        // Animación de entrada
        this.scene.tweens.add({
            targets: messageContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Desaparecer
        this.scene.time.delayedCall(duration, () => {
            this.scene.tweens.add({
                targets: messageContainer,
                alpha: 0,
                scaleY: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => messageContainer.destroy()
            });
        });
    }
}