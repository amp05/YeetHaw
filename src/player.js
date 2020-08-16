export default class Player {
  constructor(game, enemy, img) {
    this.game = game;
    this.img = img;
    this.scale = 4;
    this.lives = 2;
    this.oWidth = 19;
    this.oHeight = 24;
    this.width = this.oWidth * this.scale;
    this.height = this.oHeight * this.scale;
    this.x = enemy === true ? game.gameWidth : 0 - this.width;
    this.y = (game.gameHeight * 2.2) / 3;
    this.enemy = enemy;
    this.speed = 2 * this.scale;
    this.introduced = false;
    this.alive = true;
    this.deathTimer = 0;
    this.spriteIndex = 0;
    this.spriteCount = 0;
    this.hurt = false;
    this.hurtTimer = 0;
    this.deadSprite = false;
  }

  intro(deltaTime) {
    if (!this.enemy) {
      if (deltaTime > 0) {
        this.x += this.speed / deltaTime;
      } else {
        this.x += this.speed / 16;
      }
      if (this.x > 200 - this.width) {
        this.introduced = true;
        this.x = 200 - this.width;
      }
    } else {
      if (this.enemy) {
        if (deltaTime > 0) {
          this.x -= this.speed / deltaTime;
        } else {
          this.x -= this.speed / 16;
        }
        if (this.x < 400) {
          this.introduced = true;
          this.x = 400;
        }
      }
    }
  }
  drawFrame(ctx, sx, sy, cx, cy) {
    ctx.drawImage(
      this.img,
      sx * this.width,
      sy * this.height,
      this.width,
      this.height,
      cx,
      cy,
      this.width,
      this.height
    );
  }

  draw(ctx) {
    if (this.alive) {
      if (this.img != null) {
        if (this.introduced) {
          if (this.deadSprite) {
            this.drawFrame(ctx, 4, 1, this.x, this.y);
            return;
          }
          if (this.hurt && this.hurtTimer < 1000) {
            this.drawFrame(ctx, 4, 0, this.x, this.y);
          } else {
            this.drawFrame(ctx, this.spriteIndex, 0, this.x, this.y);
          }
        } else {
          this.drawFrame(ctx, this.spriteIndex, 1, this.x, this.y);
        }
      } else {
        ctx.fillStyle = "#0ff";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
      for (var i = 0; i < this.lives; i++) {
        if (this.enemy) {
          ctx.drawImage(this.game.imageArray[6], this.x + 25 + i * 20, this.y + this.height+5);
        } else {
          ctx.drawImage(this.game.imageArray[6], this.x + i * 20 + 10, this.y + this.height + 5);
        }
      }
    }
  }
  update(deltaTime) {
    if (this.game.gameState === 0 ||
        this.game.gameState === 3) {return;}
    this.spriteCount += deltaTime;
    if (this.hurt) {
      this.hurtTimer += deltaTime;
    }
    if (this.hurt && this.hurtTimer > 1000) {
      this.hurt = false;
      this.hurtTimer = 0;
    }
    if (this.spriteCount > 200) {
      this.spriteIndex++;
      if (this.spriteIndex > 3) {
        this.spriteIndex = 0;
      }
      this.spriteCount = 0;
    }
    if (this.introduced === false) {
      this.intro(deltaTime);
    } else {
      if (this.lives <= 0) {
        this.deadSprite = true;
        this.deathTimer += deltaTime;
        if (this.deathTimer >= 2000) {
          this.alive = false;
        }
      }
      return;
    }
  }
}
