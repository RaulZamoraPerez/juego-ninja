// Efecto de fuego simple para Phaser 3
// Llama a createFireEffect(scene, x, y) para crear fuego en la posición deseada

export function createFireEffect(scene, x, y, options = {}) {
    const color = options.color || 0xff6600;
    const numParticles = options.numParticles || 18;
    const radius = options.radius || 10;
    const duration = options.duration || 600;
    for (let i = 0; i < numParticles; i++) {
        const angle = Phaser.Math.FloatBetween(-Math.PI/2 - 0.5, -Math.PI/2 + 0.5);
        const speed = Phaser.Math.Between(60, 120);
        const px = x + Phaser.Math.Between(-6, 6);
        const py = y + Phaser.Math.Between(-2, 2);
        const particle = scene.add.circle(px, py, Phaser.Math.Between(3, radius), color, Phaser.Math.FloatBetween(0.5, 0.9));
        particle.setDepth(100);
        scene.tweens.add({
            targets: particle,
            x: px + Math.cos(angle) * speed,
            y: py + Math.sin(angle) * speed,
            scale: 0.2,
            alpha: 0,
            duration: Phaser.Math.Between(duration * 0.7, duration * 1.2),
            ease: 'Cubic.easeOut',
            onComplete: () => particle.destroy()
        });
    }
}
