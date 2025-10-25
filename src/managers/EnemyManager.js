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
                enemy.setBounce(1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-100, 100), 20);
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
                    enemy.setFlipX(enemy.body.velocity.x < 0);
                    
                    if (this.scene.anims.exists('gallina-run')) {
                        enemy.anims.play('gallina-run', true);
                    }
                }
            }
        });
    }

    updateRino(rino) {
        if (!rino || !rino.active || !this.scene.player) return;

        const distance = Phaser.Math.Distance.Between(
            rino.x, rino.y, this.scene.player.x, this.scene.player.y
        );

        if (distance < 200) {
            const playerIsToTheLeft = this.scene.player.x < rino.x;
            
            // Corregir la lógica: flipX = true significa mirando a la IZQUIERDA
            // flipX = false significa mirando a la DERECHA
            const rinoFacingLeft = rino.flipX === true;
            const rinoFacingRight = rino.flipX === false;
            
            // Solo perseguir si está mirando hacia el jugador
            const canAttack = (playerIsToTheLeft && rinoFacingLeft) || (!playerIsToTheLeft && rinoFacingRight);
            
            if (canAttack) {
                // Perseguir al jugador
                const speed = 80;
                if (playerIsToTheLeft) {
                    rino.setVelocityX(-speed);
                    rino.setFlipX(true);  // Mirar izquierda
                } else {
                    rino.setVelocityX(speed);
                    rino.setFlipX(false); // Mirar derecha
                }

                // Salto si el jugador está arriba
                if (rino.body.touching.down && this.scene.player.y < rino.y - 50) {
                    rino.setVelocityY(-250);
                }

                if (this.scene.anims.exists('rino-run')) {
                    rino.anims.play('rino-run', true);
                }
            } else {
                // El jugador está detrás - detener y girar después de un tiempo
                rino.setVelocityX(0);
                
                // Inicializar timer si no existe
                if (!rino.turnTimer) {
                    rino.turnTimer = this.scene.time.now;
                    console.log("🦏 Rino detectó jugador por detrás - iniciando giro");
                }
                
                // Girar después de 1.5 segundos
                if (this.scene.time.now - rino.turnTimer > 1500) {
                    console.log("🔄 Rino girando hacia el jugador");
                    rino.setFlipX(playerIsToTheLeft);
                    rino.turnTimer = null;
                    
                    // Reproducir animación hit-wall al girar
                    if (this.scene.anims.exists('rino-hit-wall')) {
                        rino.anims.play('rino-hit-wall');
                        
                        // Volver a idle después de la animación
                        this.scene.time.delayedCall(600, () => {
                            if (rino && rino.active && this.scene.anims.exists('rino-idle')) {
                                rino.anims.play('rino-idle', true);
                            }
                        });
                    }
                } else {
                    // Mientras decide girar, mostrar idle
                    if (this.scene.anims.exists('rino-idle')) {
                        rino.anims.play('rino-idle', true);
                    }
                }
            }
        } else {
            // Fuera del rango de detección - patrullaje lento
            if (!rino.patrolTimer) {
                rino.patrolTimer = this.scene.time.now;
                rino.patrolDirection = Math.random() > 0.5 ? 1 : -1;
            }
            
            // Cambiar dirección de patrullaje cada 3 segundos
            if (this.scene.time.now - rino.patrolTimer > 3000) {
                rino.patrolDirection *= -1;
                rino.setFlipX(rino.patrolDirection < 0);
                rino.patrolTimer = this.scene.time.now;
            }
            
            rino.setVelocityX(rino.patrolDirection * 30); // Patrullaje lento
            rino.turnTimer = null; // Reset timer de giro
            
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
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-120, 120), 20);
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
        if (!player.isInvulnerable) {
            console.log(`💔 NINJA HERIDO por ${enemy.enemyType}! Vida: ${player.health} → ${player.health - enemy.damage}`);
            
            player.health -= enemy.damage;
            this.scene.gameState.health = player.health;
            this.scene.uiManager.updateHealth();
            
            player.isInvulnerable = true;
            player.setTint(0xff0000);
            
            const pushForce = player.x < enemy.x ? -300 : 300;
            player.setVelocityX(pushForce);
            player.setVelocityY(-200);
            
            this.scene.cameras.main.shake(300, 0.02);
            
            this.scene.time.delayedCall(3000, () => {
                if (player && player.active) {
                    player.clearTint();
                    player.isInvulnerable = false;
                    console.log("✅ Ninja ya no es invulnerable");
                }
            });

            if (player.health <= 0) {
                console.log("💀 GAME OVER - Vida agotada!");
                this.scene.gameOver();
            }
        } else {
            console.log("🛡️ Ninja invulnerable - sin daño");
        }
    }
}