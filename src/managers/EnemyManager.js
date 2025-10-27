/**
 *  EnemyManager.js
 * - Crea y controla todos los enemigos (gallinas, rinocerontes)
 * - Maneja su IA, movimiento, ataques y comportamiento
 * - Gestiona el daño a enemigos y colisiones con el jugador
 */

export default class EnemyManager {
    constructor(scene) {
        this.scene = scene;
    }

    createEnemies() {
        this.scene.enemies = this.scene.physics.add.group();
        
        const gallinaTexture = this.scene.textures.exists('gallina-run') ? 'gallina-run' : 'gallinaFallback';
        const rinoTexture = this.scene.textures.exists('rino-idle') ? 'rino-idle' : 'gallinaFallback';
        
        const enemyPositions = [
            { x: 800, y: 400, type: 'gallina' },
            { x: 1200, y: 350, type: 'rino' },
            { x: 1600, y: 250, type: 'gallina' },
            { x: 2000, y: 300, type: 'rino' },
        ];

        enemyPositions.forEach((pos, index) => {
            let enemy;
            
            if (pos.type === 'gallina') {
                enemy = this.scene.enemies.create(pos.x, pos.y, gallinaTexture);
                enemy.setBounce(0.1); // Rebote muy bajo para que no brinque
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-100, 100), 0); // Sin impulso vertical
                enemy.health = 30;
                enemy.damage = 10;
                enemy.enemyType = 'gallina';
                
                if (this.scene.anims.exists('gallina-run')) {
                    enemy.anims.play('gallina-run', true);
                }
                
            } else if (pos.type === 'rino') {
                enemy = this.scene.enemies.create(pos.x, pos.y, rinoTexture);
                enemy.setBounce(0.3);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-60, 60), 20);
                enemy.health = 80;
                enemy.damage = 20;
                enemy.enemyType = 'rino';
                enemy.setScale(1.3);
                enemy.setTint(0x8B4513);
                
                if (this.scene.anims.exists('rino-idle')) {
                    enemy.anims.play('rino-idle', true);
                }
            }
        });
        
        console.log(`✅ ${enemyPositions.length} enemigos creados`);
    }

    updateEnemies() {
        if (!this.scene.enemies || !this.scene.enemies.children) return;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy || !enemy.active) return;
            
            if (enemy.enemyType === 'rino') {
                this.updateRino(enemy);
            } else if (enemy.enemyType === 'gallina') {
                if (Math.random() < 0.005) {
                    enemy.setVelocityX(Phaser.Math.Between(-100, 100));
                    // No modificar velocidad Y para evitar saltos
                }
                // flipX = false (derecha), flipX = true (izquierda)
                enemy.setFlipX(enemy.body.velocity.x > 0);
                if (this.scene.anims.exists('gallina-run')) {
                    enemy.anims.play('gallina-run', true);
                }
            }
        });
    }

    updateRino(rino) {
        if (!rino || !rino.active) return;

        // Elegir objetivo: jugador si está vivo, si no el compañero
        let target = null;
        if (this.scene.player && this.scene.player.active) {
            target = this.scene.player;
        } else if (this.scene.companion && this.scene.companion.active) {
            target = this.scene.companion;
        } else {
            // Sin objetivo, patrullaje
            if (!rino.patrolTimer) {
                rino.patrolTimer = this.scene.time.now;
                rino.patrolDirection = Math.random() > 0.5 ? 1 : -1;
            }
            if (this.scene.time.now - rino.patrolTimer > 3000) {
                rino.patrolDirection *= -1;
                rino.setFlipX(rino.patrolDirection < 0 ? false : true);
                rino.patrolTimer = this.scene.time.now;
            }
            rino.setVelocityX(rino.patrolDirection * 30);
            rino.turnTimer = null;
            if (this.scene.anims.exists('rino-idle')) {
                rino.anims.play('rino-idle', true);
            }
            return;
        }

        const distance = Phaser.Math.Distance.Between(
            rino.x, rino.y, target.x, target.y
        );

        if (distance < 200) {
            const targetIsToTheLeft = target.x < rino.x;
            // El rino siempre debe mirar hacia donde camina
            const speed = 80;
            if (targetIsToTheLeft) {
                rino.setVelocityX(-speed);
                rino.setFlipX(false);  // Mirar izquierda (flipX=false)
            } else {
                rino.setVelocityX(speed);
                rino.setFlipX(true); // Mirar derecha (flipX=true)
            }
            // Salto si el objetivo está arriba
            if (rino.body.touching.down && target.y < rino.y - 50) {
                rino.setVelocityY(-250);
            }
            // Animación de correr
            if (this.scene.anims.exists('rino-run')) {
                rino.anims.play('rino-run', true);
            }
            // Si el objetivo está detrás, detener y girar después de un tiempo
            const rinoMiraObjetivo = (targetIsToTheLeft && !rino.flipX) || (!targetIsToTheLeft && rino.flipX);
            if (!rinoMiraObjetivo) {
                rino.setVelocityX(0);
                if (!rino.turnTimer) {
                    rino.turnTimer = this.scene.time.now;
                }
                if (this.scene.time.now - rino.turnTimer > 1500) {
                    rino.setFlipX(!targetIsToTheLeft);
                    rino.turnTimer = null;
                    // Animación de topar (hit wall)
                    if (this.scene.anims.exists('rino-hit-wall')) {
                        rino.anims.play('rino-hit-wall');
                        this.scene.time.delayedCall(600, () => {
                            if (rino && rino.active && this.scene.anims.exists('rino-idle')) {
                                rino.anims.play('rino-idle', true);
                            }
                        });
                    }
                } else {
                    if (this.scene.anims.exists('rino-idle')) {
                        rino.anims.play('rino-idle', true);
                    }
                }
            } else {
                rino.turnTimer = null;
            }
        } else {
            // Patrullaje lento fuera de rango
            if (!rino.patrolTimer) {
                rino.patrolTimer = this.scene.time.now;
                rino.patrolDirection = Math.random() > 0.5 ? 1 : -1;
            }
            if (this.scene.time.now - rino.patrolTimer > 3000) {
                rino.patrolDirection *= -1;
                rino.setFlipX(rino.patrolDirection < 0 ? false : true);
                rino.patrolTimer = this.scene.time.now;
            }
            rino.setVelocityX(rino.patrolDirection * 30);
            rino.turnTimer = null;
            if (this.scene.anims.exists('rino-idle')) {
                rino.anims.play('rino-idle', true);
            }
        }
    }

    damageEnemy(enemy, damage) {
        if (!enemy || !enemy.active || !enemy.setTint) {
            console.log("❌ Enemigo inválido, no se puede dañar");
            return;
        }
        
        enemy.health -= damage;
        enemy.setTint(0xffffff);
        
        this.scene.time.delayedCall(200, () => {
            if (enemy && enemy.active && enemy.clearTint) {
                enemy.clearTint();
            }
        });

        if (enemy.enemyType === 'rino' && this.scene.anims.exists('rino-hit')) {
            enemy.anims.play('rino-hit');
            this.scene.time.delayedCall(400, () => {
                if (enemy && enemy.active && this.scene.anims.exists('rino-idle')) {
                    enemy.anims.play('rino-idle');
                }
            });
        }

        if (enemy.health <= 0) {
            const points = enemy.enemyType === 'rino' ? 100 : 50;
            // Animación de muerte suave
            enemy.setTint(0xff0000);
            this.scene.tweens.add({
                targets: enemy,
                scale: 1.5,
                alpha: 0,
                duration: 500,
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    if (enemy && enemy.destroy) {
                        enemy.destroy();
                    }
                    this.scene.gameState.score += points;
                    this.scene.gameState.enemiesKilled++;
                    this.scene.uiManager.updateScore();
                    console.log(`💀 ${enemy.enemyType} eliminado (+${points} puntos)`);
                    if (this.scene.enemies && this.scene.enemies.children && this.scene.enemies.children.size === 0) {
                        this.spawnMoreEnemies();
                    }
                }
            });
        }
    }

    spawnMoreEnemies() {
        if (!this.scene.enemies) {
            this.scene.enemies = this.scene.physics.add.group();
        }
        
        const gallinaTexture = this.scene.textures.exists('gallina-run') ? 'gallina-run' : 'gallinaFallback';
        
        const spawnPoints = [
            { x: 1500, y: 300 }, { x: 1800, y: 250 }, { x: 2000, y: 200 }
        ];
        
        spawnPoints.forEach(pos => {
            const enemy = this.scene.enemies.create(pos.x, pos.y, gallinaTexture);
            enemy.setBounce(0.1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-120, 120), 0);
            enemy.health = 35;
            enemy.damage = 18;
            enemy.enemyType = 'gallina';
            
            if (this.scene.anims.exists('gallina-run')) {
                enemy.anims.play('gallina-run', true);
            }
        });
        
        console.log(`✅ ${spawnPoints.length} enemigos nuevos generados`);
    }

    hitEnemy(player, enemy) {
        // Sin animación de golpe, solo resta vida y actualiza UI
        console.log(`💔 NINJA HERIDO por ${enemy.enemyType}! Vida: ${player.health} → ${player.health - enemy.damage}`);
        player.health -= enemy.damage;
        this.scene.gameState.health = player.health;
        this.scene.uiManager.updateHealth();
        if (player.health <= 0) {
            console.log("💀 NINJA MUERTO!");
            player.setActive(false).setVisible(false);
            // Solo terminar el juego si el compañero también está muerto o inactivo
            if (!this.scene.companion || !this.scene.companion.active) {
                this.scene.gameOver();
            }
        }
    }
}