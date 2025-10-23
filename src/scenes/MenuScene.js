class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        console.log("📥 Cargando assets del menú...");
        
        // Crear texturas de respaldo
        this.createMenuAssets();
        
        // Intentar cargar assets reales
        try {
            this.load.image('menuBg', 'assets/menu/background.png');
            this.load.image('playButton', 'assets/menu/buttons/play.png');
            this.load.spritesheet('ninja-idle', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
        } catch (error) {
            console.log("⚠️ Algunos assets del menú no se encontraron, usando respaldo");
        }
    }

    createMenuAssets() {
        const graphics = this.add.graphics();
        
        // Fondo del menú
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460);
        graphics.fillRect(0, 0, 1000, 600);
        graphics.generateTexture('menuBgFallback', 1000, 600);
        
        // Botón de jugar
        graphics.clear();
        graphics.fillStyle(0x4ecdc4);
        graphics.fillRoundedRect(0, 0, 200, 60, 15);
        graphics.lineStyle(3, 0xffffff);
        graphics.strokeRoundedRect(0, 0, 200, 60, 15);
        graphics.generateTexture('playButtonFallback', 200, 60);
        
        graphics.destroy();
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        // Fondo
        const bgTexture = this.textures.exists('menuBg') ? 'menuBg' : 'menuBgFallback';
        this.add.image(width/2, height/2, bgTexture);
        
        // Título principal
        const title = this.add.text(width/2, 120, '🥷 NINJA RESCUE 🥷', {
            fontSize: '48px',
            color: '#ff6b6b',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Subtítulo
        const subtitle = this.add.text(width/2, 180, 'La Aventura de Motocle', {
            fontSize: '24px',
            color: '#ffd93d',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Botón jugar
        const playButtonTexture = this.textures.exists('playButton') ? 'playButton' : 'playButtonFallback';
        const playButton = this.add.image(width/2, 320, playButtonTexture).setInteractive();
        
        const playText = this.add.text(width/2, 320, '🎮 JUGAR', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // === NUEVO: BOTÓN HISTORIA ===
        const storyButton = this.add.image(width/2, 400, playButtonTexture).setInteractive();
        const storyText = this.add.text(width/2, 400, '📖 HISTORIA', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Efectos del botón jugar
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
            playButton.setTint(0xdddddd);
            playText.setScale(1.1);
        });
        
        playButton.on('pointerout', () => {
            playButton.setScale(1);
            playButton.clearTint();
            playText.setScale(1);
        });
        
        playButton.on('pointerdown', () => {
            playButton.setScale(0.95);
            this.time.delayedCall(100, () => {
                this.scene.start('GameScene');
            });
        });
        
        // === EFECTOS DEL BOTÓN HISTORIA ===
        storyButton.on('pointerover', () => {
            storyButton.setScale(1.1);
            storyButton.setTint(0xdddddd);
            storyText.setScale(1.1);
        });
        
        storyButton.on('pointerout', () => {
            storyButton.setScale(1);
            storyButton.clearTint();
            storyText.setScale(1);
        });
        
        storyButton.on('pointerdown', () => {
            storyButton.setScale(0.95);
            this.time.delayedCall(100, () => {
                this.scene.start('IntroScene');
            });
        });
        
        // Ninja decorativo (si existe)
        if (this.textures.exists('ninja-idle')) {
            const ninja = this.add.sprite(150, 400, 'ninja-idle').setScale(4);
            
            this.anims.create({
                key: 'ninja-menu-idle',
                frames: this.anims.generateFrameNumbers('ninja-idle', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
            
            ninja.anims.play('ninja-menu-idle');
        } else {
            // Ninja simple de respaldo
            const ninja = this.add.rectangle(150, 400, 64, 64, 0x3498DB);
            this.tweens.add({
                targets: ninja,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // Información de controles
        this.add.text(width/2, height - 80, 
            '🎮 Controles: WASD/Flechas para mover • SPACE para saltar • J para atacar', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Créditos
        this.add.text(width/2, height - 30, 'Creado con ❤️ por Hector', {
            fontSize: '12px',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);
        
        // Controles de teclado
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('GameScene'));
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('GameScene'));
        
        console.log("✅ MenuScene creado exitosamente");
    }
}