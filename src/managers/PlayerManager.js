


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

    // Permite controlar solo al compañero (flechas) aunque el jugador esté muerto
    handleCompanionMovement() {
        if (!this.scene.companion || !this.scene.companion.active || !this.scene.companion.body) return;

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

        // Salto del compañero
        if (arrowUpPressed && this.scene.companion.setVelocityY) {
            if (this.scene.companion.body.touching.down || 
                (this.scene.companion.body.velocity.y > -10 && this.scene.companion.body.velocity.y < 10)) {
                this.scene.companion.setVelocityY(-330);
                console.log("🦘 Compañero saltando!");
            }
        }
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

        // Permitir movimiento del jugador aunque el compañero esté muerto
        if (!this.scene.player || !this.scene.player.active || !this.scene.player.body) return;

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

        // Animaciones del jugador
        if (this.scene.player && this.scene.player.active && this.scene.player.body && this.scene.player.anims) {
            // No cambiar animación si está atacando
            if (!(this.scene.player.anims.isPlaying && 
                this.scene.player.anims.currentAnim && 
                (this.scene.player.anims.currentAnim.key === 'ninja-attack' || 
                this.scene.player.anims.currentAnim.key === 'ninja-hit'))) {
                try {
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
                } catch (error) {
                    console.log("❌ Error en animaciones jugador:", error);
                }
            }
        }

        // Animaciones del compañero
        if (this.scene.companion && this.scene.companion.active && this.scene.companion.body && this.scene.companion.anims) {
            // No cambiar animación si está atacando
            if (!(this.scene.companion.anims.isPlaying && 
                this.scene.companion.anims.currentAnim && 
                this.scene.companion.anims.currentAnim.key === 'amigo-attack')) {
                try {
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
                    console.log("❌ Error en animaciones compañero:", error);
                }
            }
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
        // Efecto de línea de impacto (slash)
        if (this.scene.player.x !== undefined && this.scene.player.y !== undefined) {
            // Determinar dirección
            const dir = this.scene.player.flipX ? -1 : 1;
            const offsetX = 32 * dir;
            const slash = this.scene.add.rectangle(
                this.scene.player.x + offsetX,
                this.scene.player.y,
                38, 8,
                0xffffff, 0.7
            );
            slash.setAngle(dir === 1 ? 10 : -10);
            slash.setDepth(11);
            slash.setBlendMode('ADD');
            this.scene.tweens.add({
                targets: slash,
                scaleX: 1.7,
                alpha: 0,
                x: this.scene.player.x + offsetX + 18 * dir,
                duration: 120,
                onComplete: () => slash.destroy()
            });
        }
        if (!this.canAttack || !this.scene.player || !this.scene.player.active) return;
        this.canAttack = false;
        // Efecto de destello azul al atacar
        if (this.scene.player.setTint && this.scene.player.clearTint) {
            this.scene.player.setTint(0x00bfff);
            this.scene.time.delayedCall(80, () => {
                if (this.scene.player && this.scene.player.active) this.scene.player.clearTint();
            });
        }
        // Efecto de círculo de energía (onda)
        if (this.scene.player.x !== undefined && this.scene.player.y !== undefined) {
            const energyCircle = this.scene.add.circle(this.scene.player.x, this.scene.player.y, 18, 0x00bfff, 0.5);
            energyCircle.setDepth(10);
            energyCircle.setBlendMode('ADD');
            this.scene.tweens.add({
                targets: energyCircle,
                scaleX: 3.2,
                scaleY: 3.2,
                alpha: 0,
                duration: 220,
                onComplete: () => energyCircle.destroy()
            });
        }
        // Atacar enemigos
        this.attackEnemies(this.scene.player, 40, 100);
        this.scene.time.delayedCall(600, () => {
            this.canAttack = true;
        });
    }

    performCompanionAttack() {
        if (!this.companionCanAttack || !this.scene.companion || !this.scene.companion.active || !this.scene.companion.anims) return;

        // Siempre forzar que el compañero no rote
        if (this.scene.companion.setAngle) this.scene.companion.setAngle(0);
        if (this.scene.companion.setRotation) this.scene.companion.setRotation(0);

        this.companionCanAttack = false;
        console.log("💚 Compañero atacando con Double Jump!");

        // NO reproducir animación de ataque para evitar giro
        if (this.scene.companion.anims && this.scene.anims.exists('amigo-idle')) {
            this.scene.companion.anims.play('amigo-idle', true);
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
            // Refuerza ángulo/rotación a 0 después del ataque
            if (this.scene.companion.setAngle) this.scene.companion.setAngle(0);
            if (this.scene.companion.setRotation) this.scene.companion.setRotation(0);
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
                // Efecto de destello blanco
                if (enemy.setTint && enemy.clearTint) {
                    enemy.setTint(0xffffff);
                    this.scene.time.delayedCall(80, () => {
                        if (enemy && enemy.active) enemy.clearTint();
                    });
                }
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