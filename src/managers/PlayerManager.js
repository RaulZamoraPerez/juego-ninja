/**
 *  PlayerManager.js
 * - Controla el movimiento y físicas del ninja
 * - Maneja los controles del jugador (salto, correr, atacar)
 * - Gestiona las animaciones del personaje principal
 */

export default class PlayerManager {
    constructor(scene) {
        this.scene = scene;
        this.canAttack = true;
        this.companionCanAttack = true;
    }

    createPlayer() {
        const playerTexture = this.scene.textures.exists('ninja-idle') ? 'ninja-idle' : 'ninjaFallback';
        this.scene.player = this.scene.physics.add.sprite(100, 450, playerTexture);
        
        if (!this.scene.player) {
            console.log("❌ Error creando jugador");
            return;
        }
        
        this.scene.player.setBounce(0.2);
        this.scene.player.setCollideWorldBounds(true);
        this.scene.player.health = this.scene.gameState.health;
        this.scene.player.isInvulnerable = false;
        
        if (this.scene.player.anims && this.scene.anims.exists('ninja-idle')) {
            this.scene.player.anims.play('ninja-idle');
        }
        
        console.log("✅ Ninja azul creado");
    }

    createCompanion() {
        const companionTexture = this.scene.textures.exists('amigo-idle') ? 'amigo-idle' : 'companionFallback';
        this.scene.companion = this.scene.physics.add.sprite(50, 450, companionTexture);
        
        if (!this.scene.companion) {
            console.log("❌ Error creando compañero");
            return;
        }
        
        this.scene.companion.setBounce(0.2);
        this.scene.companion.setCollideWorldBounds(true);
        
        if (this.scene.companion.anims && this.scene.anims.exists('amigo-idle')) {
            this.scene.companion.anims.play('amigo-idle');
        }
        
        console.log("✅ Compañero verde creado");
    }

    handleMovement() {
        if (!this.scene.player || !this.scene.companion || 
            !this.scene.player.active || !this.scene.companion.active ||
            !this.scene.player.body || !this.scene.companion.body) return;

        // === CONTROLES DEL NINJA (WASD) ===
        const leftPressed = this.scene.aKey && this.scene.aKey.isDown;
        const rightPressed = this.scene.dKey && this.scene.dKey.isDown;
        const upPressed = (this.scene.wKey && this.scene.wKey.isDown) || (this.scene.spaceKey && this.scene.spaceKey.isDown);

        if (leftPressed && this.scene.player.setVelocityX) {
            this.scene.player.setVelocityX(-160);
            if (this.scene.player.setFlipX) this.scene.player.setFlipX(true);
        } else if (rightPressed && this.scene.player.setVelocityX) {
            this.scene.player.setVelocityX(160);
            if (this.scene.player.setFlipX) this.scene.player.setFlipX(false);
        } else if (this.scene.player.setVelocityX) {
            this.scene.player.setVelocityX(0);
        }

        // ✅ MEJORAR DETECCIÓN DE SALTO
        if (upPressed && this.scene.player.setVelocityY) {
            // Verificar si está tocando suelo O si su velocidad vertical es casi 0
            if (this.scene.player.body.touching.down || 
                (this.scene.player.body.velocity.y > -10 && this.scene.player.body.velocity.y < 10)) {
                this.scene.player.setVelocityY(-330);
                console.log("🦘 Ninja saltando!");
            }
        }

        // === CONTROLES DEL COMPAÑERO (FLECHAS) ===
        const arrowLeftPressed = this.scene.cursors.left && this.scene.cursors.left.isDown;
        const arrowRightPressed = this.scene.cursors.right && this.scene.cursors.right.isDown;
        const arrowUpPressed = this.scene.cursors.up && this.scene.cursors.up.isDown;

        if (arrowLeftPressed && this.scene.companion.setVelocityX) {
            this.scene.companion.setVelocityX(-160);
            if (this.scene.companion.setFlipX) this.scene.companion.setFlipX(true);
        } else if (arrowRightPressed && this.scene.companion.setVelocityX) {
            this.scene.companion.setVelocityX(160);
            if (this.scene.companion.setFlipX) this.scene.companion.setFlipX(false);
        } else if (this.scene.companion.setVelocityX) {
            this.scene.companion.setVelocityX(0);
        }

        // ✅ MEJORAR DETECCIÓN DE SALTO DEL COMPAÑERO
        if (arrowUpPressed && this.scene.companion.setVelocityY) {
            if (this.scene.companion.body.touching.down || 
                (this.scene.companion.body.velocity.y > -10 && this.scene.companion.body.velocity.y < 10)) {
                this.scene.companion.setVelocityY(-330);
                console.log("🦘 Compañero saltando!");
            }
        }
    }

    handleAnimations() {
        if (!this.scene.player || !this.scene.companion || 
            !this.scene.player.active || !this.scene.companion.active ||
            !this.scene.player.body || !this.scene.companion.body ||
            !this.scene.player.anims || !this.scene.companion.anims) return;

        // No cambiar animación si está atacando
        if (this.scene.player.anims.isPlaying && 
            this.scene.player.anims.currentAnim && 
            (this.scene.player.anims.currentAnim.key === 'ninja-attack' || 
             this.scene.player.anims.currentAnim.key === 'ninja-hit')) {
            return;
        }

        if (this.scene.companion.anims.isPlaying && 
            this.scene.companion.anims.currentAnim && 
            this.scene.companion.anims.currentAnim.key === 'amigo-attack') {
            return;
        }

        try {
            // NINJA ANIMATIONS
            if (this.scene.player.body.velocity.y < -50) {
                if (this.scene.anims.exists('ninja-jump')) {
                    this.scene.player.anims.play('ninja-jump', true);
                }
            } else if (this.scene.player.body.velocity.y > 50) {
                if (this.scene.anims.exists('ninja-fall')) {
                    this.scene.player.anims.play('ninja-fall', true);
                }
            } else if (this.scene.player.body.touching.down) {
                if (this.scene.player.body.velocity.x !== 0) {
                    if (this.scene.anims.exists('ninja-run')) {
                        this.scene.player.anims.play('ninja-run', true);
                    }
                } else {
                    if (this.scene.anims.exists('ninja-idle')) {
                        this.scene.player.anims.play('ninja-idle', true);
                    }
                }
            }

            // COMPANION ANIMATIONS
            if (this.scene.companion.body.velocity.y < -50) {
                if (this.scene.anims.exists('amigo-run')) {
                    this.scene.companion.anims.play('amigo-run', true);
                }
            } else if (this.scene.companion.body.velocity.y > 50) {
                if (this.scene.anims.exists('amigo-idle')) {
                    this.scene.companion.anims.play('amigo-idle', true);
                }
            } else if (this.scene.companion.body.touching.down) {
                if (this.scene.companion.body.velocity.x !== 0) {
                    if (this.scene.anims.exists('amigo-run')) {
                        this.scene.companion.anims.play('amigo-run', true);
                    }
                } else {
                    if (this.scene.anims.exists('amigo-idle')) {
                        this.scene.companion.anims.play('amigo-idle', true);
                    }
                }
            }
        } catch (error) {
            console.log("❌ Error en animaciones:", error);
        }
    }

    performAttack() {
        if (!this.canAttack || !this.scene.player || !this.scene.player.active || !this.scene.player.anims) return;
        
        this.canAttack = false;
        console.log("⚔️ Ninja ejecutando ataque épico!");
        
        try {
            if (this.scene.anims.exists('ninja-attack')) {
                this.scene.player.anims.play('ninja-attack', true);
            } else if (this.scene.anims.exists('ninja-hit')) {
                this.scene.player.anims.play('ninja-hit', true);
            }
        } catch (error) {
            console.log("❌ Error en animación de ataque:", error);
        }

        // Efectos visuales
        if (this.scene.player.setTint) {
            this.scene.player.setTint(0xffffff);
            this.scene.time.delayedCall(200, () => {
                if (this.scene.player && this.scene.player.clearTint) {
                    this.scene.player.clearTint();
                }
            });
        }

        // Crear efecto de ataque
        if (this.scene.player.x !== undefined && this.scene.player.y !== undefined) {
            const attackEffect = this.scene.add.circle(this.scene.player.x, this.scene.player.y, 15, 0x00ffff, 0.8);
            attackEffect.setBlendMode('ADD');
            this.scene.tweens.add({
                targets: attackEffect,
                scaleX: 4,
                scaleY: 4,
                alpha: 0,
                duration: 400,
                onComplete: () => attackEffect.destroy()
            });
        }

        // Ataque a enemigos
        this.attackEnemies(this.scene.player, 40, 100);

        this.scene.cameras.main.shake(300, 0.02);

        this.scene.time.delayedCall(600, () => {
            this.canAttack = true;
        });
    }

    performCompanionAttack() {
        if (!this.companionCanAttack || !this.scene.companion || !this.scene.companion.active || !this.scene.companion.anims) return;
        
        this.companionCanAttack = false;
        console.log("💚 Compañero atacando con Double Jump!");
        
        try {
            if (this.scene.anims.exists('amigo-attack')) {
                this.scene.companion.anims.play('amigo-attack', true);
            }
        } catch (error) {
            console.log("❌ Error en animación de ataque del compañero:", error);
        }

        // Efectos visuales verdes
        if (this.scene.companion.setTint) {
            this.scene.companion.setTint(0x00ff00);
            this.scene.time.delayedCall(300, () => {
                if (this.scene.companion && this.scene.companion.clearTint) {
                    this.scene.companion.clearTint();
                }
            });
        }

        // Crear efecto verde
        if (this.scene.companion.x !== undefined && this.scene.companion.y !== undefined) {
            const attackEffect = this.scene.add.circle(this.scene.companion.x, this.scene.companion.y, 12, 0x00ff00, 0.9);
            attackEffect.setBlendMode('ADD');
            this.scene.tweens.add({
                targets: attackEffect,
                scaleX: 3.5,
                scaleY: 3.5,
                alpha: 0,
                duration: 350,
                onComplete: () => attackEffect.destroy()
            });
        }

        // Ataque a enemigos
        this.attackEnemies(this.scene.companion, 45, 95);

        this.scene.cameras.main.shake(250, 0.018);

        this.scene.time.delayedCall(500, () => {
            this.companionCanAttack = true;
        });
    }

    attackEnemies(attacker, damage, range) {
        if (!this.scene.enemies || !this.scene.enemies.children) return;

        let enemiesHit = 0;
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy || !enemy.active) return;
            if (!attacker || !attacker.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                attacker.x, attacker.y, enemy.x, enemy.y
            );
            
            if (distance < range) {
                this.scene.enemyManager.damageEnemy(enemy, damage);
                
                if (enemy && enemy.active && enemy.setVelocityX) {
                    const pushDirection = enemy.x > attacker.x ? 1 : -1;
                    enemy.setVelocityX(pushDirection * 300);
                    enemy.setVelocityY(-150);
                }
                
                enemiesHit++;
                console.log(`💥 ${attacker === this.scene.player ? 'Ninja' : 'Compañero'} golpeó enemigo!`);
            }
        });

        return enemiesHit;
    }
}