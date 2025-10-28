class DialogSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogueBubble = null;
    }

    showDialogue(text, duration = 3000) {
        this.destroyDialogue();

        const { width } = this.scene.sys.game.config;
        const padding = 10;
        const maxWidth = width - padding * 2;

        // Create a container for the dialogue bubble
        const container = this.scene.add.container(width / 2, this.scene.cameras.main.height - 100).setDepth(2000);

        // Create background graphics
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.7);
        bg.fillRoundedRect(-maxWidth / 2, -50, maxWidth, 100, 10);

        // Create text
        const textObject = this.scene.add.text(0, 0, text, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: maxWidth - padding * 2 },
        }).setOrigin(0.5, 0.5);

        // Add background and text to the container
        container.add([bg, textObject]);

        // Set the dialogue bubble to the container
        this.dialogueBubble = container;

        // Automatically destroy the dialogue after the specified duration
        this.scene.time.delayedCall(duration, () => {
            this.destroyDialogue();
        });
    }

    destroyDialogue() {
        if (this.dialogueBubble) {
            this.dialogueBubble.destroy();
            this.dialogueBubble = null;
        }
    }
}

export default DialogSystem;