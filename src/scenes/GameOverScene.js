class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        // Recibir datos del juego (puntuación, etc.)
        this.finalScore = data.score || 0;
        this.coinsCollected = data.coins || 0;
        this.enemiesKilled = data.enemies || 0;
    }

    create() {
        const { width, height } = this.sys.game.config;

        // ✅ FONDO OSCURO
        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);

        // ✅ TÍTULO GAME OVER
        this.add.text(width/2, height/4, '💀 GAME OVER 💀', {
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // ✅ ESTADÍSTICAS FINALES
        const statsY = height/2 - 50;
        this.add.text(width/2, statsY, `🏆 Puntuación Final: ${this.finalScore}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(width/2, statsY + 40, `🪙 Monedas: ${this.coinsCollected}`, {
            fontSize: '20px',
            color: '#f1c40f',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(width/2, statsY + 80, `👹 Enemigos Eliminados: ${this.enemiesKilled}`, {
            fontSize: '20px',
            color: '#ff6b6b',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // ✅ BOTONES DE ACCIÓN
        const buttonsY = height * 0.75;

        // Botón Reintentar
        const retryButton = this.add.text(width/2 - 120, buttonsY, '🔄 REINTENTAR', {
            fontSize: '20px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive();

        retryButton.on('pointerdown', () => {
            console.log("🔄 Reiniciando juego...");
            const gameScene = this.scene.manager.getScene('GameScene');
            if (gameScene) {
                this.scene.manager.remove('GameScene');
            }
            this.scene.start('GameScene');
        });

        retryButton.on('pointerover', () => {
            retryButton.setStyle({ backgroundColor: '#555555' });
        });

        retryButton.on('pointerout', () => {
            retryButton.setStyle({ backgroundColor: '#333333' });
        });

        // Botón Menú
        const menuButton = this.add.text(width/2 + 120, buttonsY, '📋 MENÚ', {
            fontSize: '20px',
            color: '#ffff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive();

        menuButton.on('pointerdown', () => {
            console.log("📋 Volviendo al menú...");
            // Si no tienes MenuScene, ir a GameScene
            if (this.scene.manager.scenes.find(scene => scene.scene.key === 'MenuScene')) {
                this.scene.start('MenuScene');
            } else {
                const gameScene = this.scene.manager.getScene('GameScene');
                if (gameScene) {
                    this.scene.manager.remove('GameScene');
                }
                this.scene.start('GameScene');
            }
        });

        menuButton.on('pointerover', () => {
            menuButton.setStyle({ backgroundColor: '#555555' });
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ backgroundColor: '#333333' });
        });

        // ✅ CONTROLES DE TECLADO
        this.input.keyboard.on('keydown-SPACE', () => {
            const gameScene = this.scene.manager.getScene('GameScene');
            if (gameScene) {
                this.scene.manager.remove('GameScene');
            }
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            const gameScene = this.scene.manager.getScene('GameScene');
            if (gameScene) {
                this.scene.manager.remove('GameScene');
            }
            this.scene.start('GameScene');
        });

        // ✅ INSTRUCCIONES
        this.add.text(width/2, height - 50, '🎮 ESPACIO o ESC para reiniciar', {
            fontSize: '16px',
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        console.log("💀 GameOverScene creado exitosamente");
    }
}

export default GameOverScene;