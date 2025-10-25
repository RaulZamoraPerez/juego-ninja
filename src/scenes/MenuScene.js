//Menu de inicio 

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.on('loaderror', () => {
            console.log('🔄 Creando assets de respaldo...');
        });

        this.load.image('menuBg', 'assets/menu/background.png');
        this.load.image('playButton', 'assets/menu/buttons/play.png');
        this.load.image('sky', 'assets/fondo.png');
        this.load.spritesheet('ninja-idle', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        console.log('🎮 MenuScene iniciado');
        
        const { width, height } = this.sys.game.config;

        // Fondo degradado dinámico
        this.createAnimatedBackground(width, height);

        // Partículas flotantes
        this.createFloatingParticles();

        // Panel principal con efecto glassmorphism
        this.createMainPanel(width, height);

        // Logo con efecto neón
        this.createNeonTitle(width);

        // Botones modernos
        this.createModernButtons(width);

        // Ninja animado de fondo
        this.createNinjaCharacter(width, height);

        // Footer con info
        this.createFooter(width, height);

        // Controles
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    }

    createAnimatedBackground(width, height) {
        // Fondo base oscuro
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0e27, 0x0a0e27, 0x1a1f3a, 0x2d3561, 1);
        bg.fillRect(0, 0, width, height);

        // Círculos de luz pulsante
        const circle1 = this.add.circle(width * 0.2, height * 0.3, 150, 0x6366f1, 0.1);
        const circle2 = this.add.circle(width * 0.8, height * 0.7, 200, 0x8b5cf6, 0.1);

        this.tweens.add({
            targets: circle1,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0.05,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: circle2,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.08,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createFloatingParticles() {
        // Crear partículas sutiles flotantes
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const particle = this.add.circle(x, y, 2, 0xffffff, 0.3);
            
            this.tweens.add({
                targets: particle,
                y: y - Phaser.Math.Between(50, 150),
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    createMainPanel(width, height) {
        // Panel principal con efecto glass
        const panel = this.add.graphics();
        panel.fillStyle(0x1e293b, 0.4);
        panel.lineStyle(2, 0x64748b, 0.5);
        panel.fillRoundedRect(width/2 - 250, 80, 500, 420, 20);
        panel.strokeRoundedRect(width/2 - 250, 80, 500, 420, 20);

        // Bordes brillantes
        const glow = this.add.graphics();
        glow.lineStyle(1, 0x8b5cf6, 0.3);
        glow.strokeRoundedRect(width/2 - 250, 80, 500, 420, 20);
    }

    createNeonTitle(width) {
        // Título con efecto neón
        const titleConfig = {
            fontSize: '56px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#ffffff',
            stroke: '#6366f1',
            strokeThickness: 4
        };

        const title = this.add.text(width/2, 140, 'NINJA', titleConfig).setOrigin(0.5);
        const title2 = this.add.text(width/2, 190, 'RESCUE', {
            ...titleConfig,
            stroke: '#8b5cf6'
        }).setOrigin(0.5);

        // Sombra de neón
        const shadow = this.add.text(width/2, 142, 'NINJA', {
            ...titleConfig,
            color: '#6366f1',
            alpha: 0.5
        }).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);

        const shadow2 = this.add.text(width/2, 192, 'RESCUE', {
            ...titleConfig,
            color: '#8b5cf6',
            alpha: 0.5
        }).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);

        // Animación de pulso
        this.tweens.add({
            targets: [shadow, shadow2],
            alpha: 0.3,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtítulo elegante
        const subtitle = this.add.text(width/2, 230, 'LA AVENTURA DE MOTOCLE', {
            fontSize: '16px',
            color: '#94a3b8',
            fontStyle: 'italic',
            letterSpacing: '2px'
        }).setOrigin(0.5);
    }

    createModernButtons(width) {
        const buttons = [
            { y: 300, text: 'INICIAR JUEGO', color: 0x6366f1, glowColor: 0x818cf8, action: 'start' },
            { y: 380, text: 'HISTORIA', color: 0x8b5cf6, glowColor: 0xa78bfa, action: 'story' },
            { y: 460, text: 'SALIR', color: 0x64748b, glowColor: 0x94a3b8, action: 'exit' }
        ];

        buttons.forEach(btn => {
            this.createButton(width/2, btn.y, btn.text, btn.color, btn.glowColor, btn.action);
        });

        // Instrucciones modernas
        this.add.text(width/2, 540, 'WASD o FLECHAS para mover  •  J para atacar  •  SPACE para saltar', {
            fontSize: '12px',
            color: '#64748b',
            alpha: 0.8
        }).setOrigin(0.5);
    }

    createButton(x, y, text, color, glowColor, action) {
        // Botón con efecto hover moderno
        const btn = this.add.graphics();
        const btnWidth = 280;
        const btnHeight = 55;

        btn.fillStyle(color, 0.9);
        btn.fillRoundedRect(x - btnWidth/2, y - btnHeight/2, btnWidth, btnHeight, 10);
        btn.lineStyle(2, glowColor, 0.5);
        btn.strokeRoundedRect(x - btnWidth/2, y - btnHeight/2, btnWidth, btnHeight, 10);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Zona interactiva
        const hitArea = this.add.rectangle(x, y, btnWidth, btnHeight).setInteractive();
        hitArea.on('pointerover', () => {
            btn.clear();
            btn.fillStyle(glowColor, 1);
            btn.fillRoundedRect(x - btnWidth/2, y - btnHeight/2, btnWidth, btnHeight, 10);
            btn.lineStyle(3, 0xffffff, 0.8);
            btn.strokeRoundedRect(x - btnWidth/2, y - btnHeight/2, btnWidth, btnHeight, 10);
            
            this.tweens.add({
                targets: [btn, buttonText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150
            });
        });

        hitArea.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(color, 0.9);
            btn.fillRoundedRect(x - btnWidth/2, y - btnHeight/2, btnWidth, btnHeight, 10);
            btn.lineStyle(2, glowColor, 0.5);
            btn.strokeRoundedRect(x - btnWidth/2, y - btnHeight/2, btnWidth, btnHeight, 10);
            
            this.tweens.add({
                targets: [btn, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 150
            });
        });

        hitArea.on('pointerdown', () => {
            this.tweens.add({
                targets: [btn, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    if (action === 'start') this.startGame();
                    if (action === 'story') this.showStory();
                    if (action === 'exit') this.exitGame();
                }
            });
        });
    }

    createNinjaCharacter(width, height) {
        // Silueta del ninja en el fondo
        if (this.textures.exists('ninja-idle')) {
            const ninja = this.add.sprite(width - 100, height - 80, 'ninja-idle')
                .setScale(3)
                .setAlpha(0.15)
                .setTint(0x6366f1);

            // Animación idle si existe
            if (!this.anims.exists('idle-menu')) {
                this.anims.create({
                    key: 'idle-menu',
                    frames: this.anims.generateFrameNumbers('ninja-idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }
            ninja.play('idle-menu');
        }
    }

    createFooter(width, height) {
        // Versión y créditos
        this.add.text(20, height - 25, 'v1.0.0', {
            fontSize: '12px',
            color: '#475569',
            alpha: 0.6
        });

        this.add.text(width - 20, height - 25, '© 2025 Motocle Games', {
            fontSize: '12px',
            color: '#475569',
            alpha: 0.6
        }).setOrigin(1, 0);
    }

    startGame() {
        console.log('🚀 Iniciando juego...');
        
        // Efecto de transición elegante
        const fadeRect = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
        fadeRect.setDepth(1000);
        
        this.tweens.add({
            targets: fadeRect,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.scene.start('GameScene');
            }
        });
    }

    showStory() {
        this.scene.start('IntroScene');
    }

    exitGame() {
        const exitText = this.add.text(400, 300, 'Gracias por jugar!', {
            fontSize: '32px',
            color: '#8b5cf6',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: exitText,
            alpha: 1,
            y: 280,
            duration: 500
        });
    }
}