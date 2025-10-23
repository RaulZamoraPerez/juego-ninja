export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ninja-idle');
    
    this.scene = scene;
    this.health = 100;
    this.maxHealth = 100;
    this.isInvulnerable = false;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }

  update(keys) {
    this.handleMovement(keys);
    this.handleCombat(keys);
    this.updateAnimation();
  }

  handleMovement(keys) {
    let velocityX = 0;

    if (keys.A.isDown || keys.LEFT.isDown) {
      velocityX = -160;
      this.setFlipX(true);
    } else if (keys.D.isDown || keys.RIGHT.isDown) {
      velocityX = 160;
      this.setFlipX(false);
    }

    if (keys.SHIFT.isDown && velocityX !== 0) {
      velocityX *= 1.5;
    }

    if ((keys.SPACE.isDown || keys.W.isDown || keys.UP.isDown) && this.body.touching.down) {
      this.setVelocityY(-330);
      this.scene.soundManager.playSound('jumpSound');
    }

    this.setVelocityX(velocityX);
  }

  handleCombat(keys) {
    if (Phaser.Input.Keyboard.JustDown(keys.J)) {
      this.scene.performBasicAttack();
    }
    
    if (Phaser.Input.Keyboard.JustDown(keys.Q)) {
      this.scene.performDash();
    }
  }

  updateAnimation() {
    if (this.body.velocity.y < 0) {
      this.anims.play('ninja-jump', true);
    } else if (this.body.velocity.y > 0) {
      this.anims.play('ninja-fall', true);
    } else if (this.body.velocity.x !== 0) {
      this.anims.play('ninja-run', true);
    } else {
      this.anims.play('ninja-idle', true);
    }
  }

  takeDamage(amount) {
    if (this.isInvulnerable) return;
    
    this.health -= amount;
    this.scene.soundManager.playSound('hurtSound');
    
    this.isInvulnerable = true;
    this.setTint(0xff0000);
    
    this.scene.time.delayedCall(1000, () => {
      this.isInvulnerable = false;
      this.clearTint();
    });
    
    this.scene.events.emit('player-health-changed', this.health);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.scene.events.emit('player-health-changed', this.health);
  }
}