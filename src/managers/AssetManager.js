/**
 *  AssetManager.js
 * - Carga todas las imágenes y sprites del juego
 * - Crea las animaciones de personajes y enemigos
 * - Genera texturas de respaldo si faltan archivos
 */

export default class AssetManager {
    constructor(scene) {
        this.scene = scene;
    }

    preloadAssets() {
        console.log("📥 Cargando todos los assets...");
        git
        // === JUGADOR ===
        this.scene.load.spritesheet('ninja-idle', 'assets/player/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('ninja-run', 'assets/player/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('ninja-jump', 'assets/player/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('ninja-fall', 'assets/player/Fall (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('ninja-hit', 'assets/player/Hit (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('ninja-double-jump', 'assets/player/Double Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
        
        // === COMPAÑERO ===
        this.scene.load.spritesheet('amigo-idle', 'assets/amigo/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('amigo-run', 'assets/amigo/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.spritesheet('amigo-attack', 'assets/amigo/Double Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
        
        // === ENEMIGOS ===
        this.scene.load.spritesheet('gallina-run', 'assets/animales/gallina/Run (32x34).png', { frameWidth: 32, frameHeight: 34 });
        this.scene.load.spritesheet('rino-idle', 'assets/animales/Rino/Idle (52x34).png', { frameWidth: 52, frameHeight: 34 });
        this.scene.load.spritesheet('rino-run', 'assets/animales/Rino/Run (52x34).png', { frameWidth: 52, frameHeight: 34 });
        this.scene.load.spritesheet('rino-hit', 'assets/animales/Rino/Hit (52x34).png', { frameWidth: 52, frameHeight: 34 });
        this.scene.load.spritesheet('rino-hit-wall', 'assets/animales/Rino/Hit Wall (52x34).png', { frameWidth: 52, frameHeight: 34 });
        
        // === ITEMS Y MUNDO ===
        this.scene.load.spritesheet('coin', 'assets/dinero/coin.png', { frameWidth: 16, frameHeight: 16 });
        this.scene.load.image('sky', 'assets/fondo.png');
        this.scene.load.image('ground', 'assets/Brown On (32x8).png');
        this.scene.load.image('health-potion', 'assets/dinero/coin.png'); // Temporal
    }

    createFallbackTextures() {
        // Crear texturas de respaldo si faltan assets
        this.scene.add.graphics()
            .fillStyle(0x0099ff)
            .fillRect(0, 0, 32, 32)
            .generateTexture('ninjaFallback', 32, 32);

        this.scene.add.graphics()
            .fillStyle(0xff9900)
            .fillRect(0, 0, 32, 32)
            .generateTexture('companionFallback', 32, 32);

        this.scene.add.graphics()
            .fillStyle(0xffffff)
            .fillCircle(16, 16, 8)
            .generateTexture('gallinaFallback', 32, 32);

        console.log("✅ Texturas de respaldo creadas");
    }

    createAnimations() {
        const anims = this.scene.anims;
        
        try {
            // === NINJA ANIMATIONS ===
            if (this.scene.textures.exists('ninja-idle')) {
                anims.create({
                    key: 'ninja-idle',
                    frames: anims.generateFrameNumbers('ninja-idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('ninja-run')) {
                anims.create({
                    key: 'ninja-run',
                    frames: anims.generateFrameNumbers('ninja-run', { start: 0, end: 7 }),
                    frameRate: 12,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('ninja-jump')) {
                anims.create({
                    key: 'ninja-jump',
                    frames: anims.generateFrameNumbers('ninja-jump', { start: 0, end: 0 }),
                    frameRate: 8,
                    repeat: 0
                });
            }

            if (this.scene.textures.exists('ninja-fall')) {
                anims.create({
                    key: 'ninja-fall',
                    frames: anims.generateFrameNumbers('ninja-fall', { start: 0, end: 0 }),
                    frameRate: 8,
                    repeat: 0
                });
            }

            if (this.scene.textures.exists('ninja-hit')) {
                anims.create({
                    key: 'ninja-hit',
                    frames: anims.generateFrameNumbers('ninja-hit', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: 0
                });
            }

            if (this.scene.textures.exists('ninja-double-jump')) {
                anims.create({
                    key: 'ninja-attack',
                    frames: anims.generateFrameNumbers('ninja-double-jump', { start: 0, end: 5 }),
                    frameRate: 15,
                    repeat: 0
                });
            }
            
            // === COMPAÑERO ANIMATIONS ===
            if (this.scene.textures.exists('amigo-idle')) {
                anims.create({
                    key: 'amigo-idle',
                    frames: anims.generateFrameNumbers('amigo-idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('amigo-run')) {
                anims.create({
                    key: 'amigo-run',
                    frames: anims.generateFrameNumbers('amigo-run', { start: 0, end: 7 }),
                    frameRate: 12,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('amigo-attack')) {
                anims.create({
                    key: 'amigo-attack',
                    frames: anims.generateFrameNumbers('amigo-attack', { start: 0, end: 5 }),
                    frameRate: 16,
                    repeat: 0
                });
            }
            
            // === ENEMY ANIMATIONS ===
            if (this.scene.textures.exists('gallina-run')) {
                anims.create({
                    key: 'gallina-run',
                    frames: anims.generateFrameNumbers('gallina-run', { start: 0, end: 7 }),
                    frameRate: 12,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('rino-idle')) {
                anims.create({
                    key: 'rino-idle',
                    frames: anims.generateFrameNumbers('rino-idle', { start: 0, end: 3 }),
                    frameRate: 6,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('rino-run')) {
                anims.create({
                    key: 'rino-run',
                    frames: anims.generateFrameNumbers('rino-run', { start: 0, end: 5 }),
                    frameRate: 10,
                    repeat: -1
                });
            }

            if (this.scene.textures.exists('rino-hit')) {
                anims.create({
                    key: 'rino-hit',
                    frames: anims.generateFrameNumbers('rino-hit', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: 0
                });
            }

            // Nueva animación Hit Wall para el Rino
            if (this.scene.textures.exists('rino-hit-wall')) {
                anims.create({
                    key: 'rino-hit-wall',
                    frames: anims.generateFrameNumbers('rino-hit-wall', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: 0
                });
            }
            
            // === COIN ANIMATION ===
            if (this.scene.textures.exists('coin')) {
                anims.create({
                    key: 'coin-spin',
                    frames: anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
                    frameRate: 10,
                    repeat: -1
                });
            }
            
            console.log("✅ Todas las animaciones creadas exitosamente");
            
        } catch (error) {
            console.log("❌ Error creando animaciones:", error);
        }
    }
}