/**
*  @player.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
ig.module('game.entities.player')
.requires('impact.entity').defines(function() {
  window['EntityPlayer'] = ig.Entity.extend({
    gravityFactor:0,
    health:5,
    maxHealth:100,
    invincible:false,
    speed: 100,
    movespeed: 15,
    name:"hero",
    shield:100,
    floatTimer:null,
    invincibleTimer:null,
    attacker:null,
    nX:null,
    nY:null,
    firelaser:false,
    rockets_stash:5,
    lasersound: new ig.Sound("media/sfx/laser4.*"),
    diesound: new ig.Sound("media/sfx/die.*"),
    rocket_icon: new ig.Image("media/sprites/player-beam.png"),
    shoot_timer:null,
    rocket_timer:null,
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    moving: {right:0, left: 0, up: 0, down: 0},
    size: {
      x: 50,
      y: 37
    },
    offset: {
      x: 0,
      y: 0
    },
    maxVel: {
      x: 500,
      y: 500
    },
    hitTimer:null,
    animSheet: new ig.AnimationSheet("media/sprites/player1.png", 50, 37),

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim("idle", 100, [0]);
      this.addAnim("blink", 0.2, [0,2]);
      this.addAnim("hit", 0.05, [0,1,0,1]);
      //this.nX=100;
      //this.nY=100;
      this.invincible=true;
      this.invincibleTimer=new ig.Timer(2);
      this.shoot_timer = new ig.Timer(0.1);
      this.rocket_timer = new ig.Timer(1);
      this.hitTimer = new ig.Timer(0.2);
     },

    update: function() {
        this._controls();
        this.parent();

        this.firelaser=false;
        if(ig.input.state("fire")){
          this.firelaser=true;
        }

        /* analog stick */
        if(this.invincibleTimer.delta()>0){
          this.invincible=false;
            if (this.hitTimer.delta() < 0) {
              this.currentAnim = this.anims.hit;
            } else {
              this.currentAnim = this.anims.idle;
            }
        } else {
          this.currentAnim=this.anims.blink;
        }
        if(ig.input.state("CanvasTouch")){
          this.firelaser=true;
        }

      //FOR DESKTOP
      if(ig.input.state('moveLeft')) {
        if(this.pos.x<0) this.vel.x=0;
        else this.pos.x -= this.movespeed;
      }

      if(ig.input.state('moveRight')) {
        if(this.pos.x+this.size.x>ig.system.canvas.width) this.vel.x=0;
        else this.pos.x += this.movespeed;
      }

      if(ig.input.state('moveDown')) {
        if(this.pos.y+this.size.y>=ig.system.canvas.height) this.vel.y=0;
        else this.pos.y += this.movespeed;
      }
      if(ig.input.state('moveUp')) {
        if(this.pos.y<0) this.vel.y=0;
        else this.pos.y -= this.movespeed;
      }



    if(this.firelaser && this.shoot_timer.delta() > 0) {
        var x = this.pos.x+24;
        var y = this.pos.y;
        this.lasersound.play();
            var angle = 270 * Math.PI / 180;
                ig.game.spawnEntity(EntityDoubleBullet, x, y, {
                  angle: angle
                });

            if(ig.game.triplebullets){
              angle = 180 * Math.PI / 180;
                ig.game.spawnEntity(EntityDoubleBullet, x, y, {
                  angle: angle
                });

              angle = 360 * Math.PI / 180;
                ig.game.spawnEntity(EntityDoubleBullet, x, y, {
                  angle: angle
                });
            }
            if(ig.game.doublebullets){
              angle = 255 * Math.PI / 180;
                ig.game.spawnEntity(EntityDoubleBullet, x, y, {
                  angle: angle
                });

              angle = 285 * Math.PI / 180;
                ig.game.spawnEntity(EntityDoubleBullet, x, y, {
                  angle: angle
                });
            }
      this.shoot_timer.reset();
      }
      else if(ig.input.state("fire_rocket")){
        this._fire_rockets();
      }
    },
    _fire_rockets: function () {
            if(this.rocket_timer.delta() < 0 || this.rockets_stash === 0) return;
            //ig.game.spawnEntity(EntityPlayerAttackRocket, this.pos.x, this.pos.y+20);
            ig.game.spawnEntity(EntityPlayerAttackRocket, this.pos.x +20, this.pos.y);
            this.rocket_timer.reset();
            this.rockets_stash -= 1;
    },

    receiveDamage: function( amount, from ) {
        if(!this.invincible){
            //this.currentAnim.alpha=0.5;
            this.health -= amount;
            if( this.health <= 0 ) {
                this.kill();
            }
        }
    },
    jumpDown: function (percent) {
        if (!percent) percent = 1;
        this.moving.up = percent;

    },
    rightDown: function (percent) {
        if(this.pos.x+this.size.x>ig.system.canvas.width) this.vel.x=0;
        else this.pos.x += this.movespeed/3;
        if (!percent) percent = 1;
        //console.log("move right");
        this.moving.right = percent;
    },

   down: function (percent) {
        if(this.pos.y+this.size.y>=ig.system.canvas.height-75) this.vel.y=0;
        else this.pos.y += this.movespeed/3;
        if (!percent) percent = 1;
        //console.log("move right");
        this.moving.down = percent;
      },
    up: function (percent) {
        if(this.pos.y<0) this.vel.y=0;
        else this.pos.y -= this.movespeed/3;
        if (!percent) percent = 1;
        //console.log("move right");
        this.moving.up = percent;
      },

    upReleased:function () {
        this.moving.up = 0;
    },
    downReleased:function () {
        this.moving.down = 0;
    },

    rightReleased:function () {
        this.moving.right = 0;
    },
    leftDown: function (percent) {
        if(this.pos.x<0) this.vel.x=0;
        else this.pos.x -= this.movespeed/3;
        if (!percent) percent = 1;
        this.moving.left = percent;
    },
    leftReleased:function () {
        this.moving.left = 0;
    },
    leftReleased:function () {
                this.moving.left = 0;
    },
    rightReleased:function () {
                this.moving.right = 0;
    },
    _controls: function () {
      if(window.ejecta){
          var x = nX -10,
          y = nY -15;

      } 
      else if(ig.ua.mobile) {
       var x = this.pos.x -10,
           y = this.pos.y -15;
        if(!ig.ua.mobile) {
            this.vel.x = ig.game.stickLeft.input.x * 320;
            this.vel.y = ig.game.stickLeft.input.y * 250;
             if(ig.input.state("fire") && this.shoot_timer.delta() > 0) {
                ig.game.spawnEntity(EntityPlayerAttackLaser, x, y);
                this.shoot_timer.reset();
            } else if(ig.input.state("fire_rocket")){
              this._fire_rockets();
              }
        } else {
            ig.input.state("go_up") ? this.vel.y = -250 : ig.input.state("go_down") ? this.vel.y = 220 : this.vel.y = 0;
            ig.input.state("go_right") ? this._go_right() : ig.input.state("go_left") ? this._go_left() : this._stop_thrust();
            if(ig.input.state("go_up")) this.currentAnim = this.anims.tilt_left.rewind();
            if(ig.input.state("go_down")) this.currentAnim = this.anims.tilt_left.rewind();
            if(ig.input.state("fire") && this.shoot_timer.delta() > 0) {
                //ig.game.spawnEntity(EntityPlayerAttackLaser, x, y);
                //this.shoot_timer.reset();
            }
            else if(ig.input.state("fire_rocket")) {
              this.fire_rockets();
            }
        }
      } 
    },
    _go_right: function () {
        this.vel.x = 320;
    },
    _go_down: function () {
        this.vel.y = 250
    },
    _go_left: function () {
        this.vel.x = -320;
    },
    _stop_thrust: function () {
        this.vel.x = 0, this.currentAnim !== this.anims.normal && (this.currentAnim = this.anims.normal)
    },
    hit: function(other,amount) {
        if(other.name!="bullet" && other.name!="asteroid") other.kill();
        if(!this.invincible){
        if(ig.game.shield-amount>0){
          this.hitTimer.reset();
          ig.game.shield-=amount;
          for (var i = 0; i <= 5; i++) {
            ig.game.spawnEntity(EntityParticleBlue, this.pos.x,this.pos.y);
          }
        } else {
          this.die();
          for (var i = 0; i <= 15; i++) {
            ig.game.spawnEntity(EntityParticleBlue, this.pos.x,this.pos.y);
          }
        }
        this.health-=amount;
        }
    },
    die: function() {
      ig.game.shield=0;
      for(i=0;i<25;i++)
      ig.game.spawnEntity(EntityPlayerDeathParticle, this.pos.x-4, this.pos.y-4);
      ig.game.lives-=1;
      ig.game.playerKilled=true;
      ig.game.respawnTimer.reset();
      this.kill();
      this.diesound.play();
    },
    draw: function(){
      this.parent();
      var o=4,height=35;
      if(!ig.ua.mobile) if(this.rockets_stash>0)for(var c = 0; c <= this.rockets_stash; c++) this.rocket_icon.draw(o, height), o += this.rocket_icon.width + 2;
    }
});


EntityDoubleBullet = ig.Entity.extend({
    size: {
      x: 5,
      y: 6
    },
    maxVel: {
      x: 500,
      y: 500
    },
    image: new ig.Image('media/sprites/beam_small.png'),
    health: 10,
    bulletspeed: 1000,
    maxSpeed: 560,
    name:"bullet",
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    update: function() {
      this.bulletspeed = Math.min(this.maxSpeed, this.bulletspeed + ig.system.tick * 500);
      this.vel.x = Math.cos(this.angle) * this.bulletspeed;
      this.vel.y = Math.sin(this.angle) * this.bulletspeed;
      this.pos.x += this.vel.x * ig.system.tick;
      this.pos.y += this.vel.y * ig.system.tick;
      if (this.pos.x > ig.system.width || this.pos.y > ig.system.height || this.pos.x < 0 || this.pos.y < 0) {
        ig.game.removeEntity(this);
      }
    },
    hit:function(){
         this.kill();
    },
    check:function(other){
      if(other.name != "bullet"){
        if(other.name!="asteroid") other.receiveDamage(10,this);
        this.kill();
      }
    },
    draw: function() {
      ig.system.context.drawImage(this.image.data, this.pos.x - ig.game._rscreen.x - this.offset.x, this.pos.y - ig.game._rscreen.y - this.offset.y);
    }
  });

EntityBullet = ig.Entity.extend({
    size: {
      x: 28,
      y: 12
    },
    name:"bullet",
    animSheet: new ig.AnimationSheet('media/sprites/bigbeam.png', 28,12),
    collides: ig.Entity.COLLIDES.NEVER,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    maxVel: {
      x: 0,
      y: 500
    },
    hit: function(other,amount) {
      this.kill();
    },
    init:function(x,y,settings){
      this.parent(x, y, settings);
      this.addAnim('idle', 10, [0], false);
      this.currentAnim = this.anims.idle;
      this.vel.y=-500;
    },
    update: function() {
      this.parent();
      this.vel.y=-500;
      if(this.pos.y<0) this.kill();
    }
});

EntityPlayerAttackRocket = ig.Entity.extend({
        size: {
            x: 10,
            y: 28
        },
        name:"bullet",
        EntityType: "weapon",
        collides: ig.Entity.COLLIDES.NEVER,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        explodeTimer: null,
        maxVel: {
          x: 0,
          y: 500
        },
        animSheet: new ig.AnimationSheet("media/sprites/player-beam.png", 10, 28),
        sound: new ig.Sound("media/sfx/rocket.*"),
        collisionDamage: 50,
        init:function(x,y,settings){
          this.parent(x, y, settings);
          this.addAnim('idle', 10, [0], false);
          this.currentAnim = this.anims.idle;
          this.vel.y=-500;
          this.explodeTimer=new ig.Timer(1);
        },
        hit: function(other,amount) {
          var bullets=16;
              var inc = 360 / (bullets - 1);
              var a = 0;
              var radius = 0;
              for (var i = 0; i < bullets; i++) {
                var angle = a * Math.PI / 180;
                var x = this.pos.x+16;
                var y = this.pos.y;
                ig.game.spawnEntity(EntityDestroyerBullet, x, y, {
                  angle: angle
                });
                a += inc;
              }
        this.kill();
        },
        update: function() {
          this.parent();
          this.vel.y=-500;
          if(this.pos.y<0) this.kill();
          if(this.explodeTimer.delta()>0){
             var bullets=16;
              var inc = 360 / (bullets - 1);
              var a = 0;
              var radius = 0;
              for (var i = 0; i < bullets; i++) {
                var angle = a * Math.PI / 180;
                var x = this.pos.x+16;
                var y = this.pos.y;
                ig.game.spawnEntity(EntityDestroyerBullet, x, y, {
                  angle: angle
                });
                a += inc;
              }
        this.kill();
          }
        }
  });


EntityPlayerDeathParticle = ig.Entity.extend({
    gravityFactor: 0,
    lifeTime: 8,
    lifeTimer: null,
    alpha:1,
    size: {
      x: 4,
      y: 3
    },
    offset: {
      x: 0,
      y: 0
    },
    maxVel: {
      x: 200,
      y: 200
    },
    animSheet: new ig.AnimationSheet('media/sprites/particles.png', 4, 3),
    collides: ig.Entity.COLLIDES.NEVER,
    alpha: 0.6,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 0.1, [0,1,2,3,4], false);
      this.currentAnim.alpha = this.alpha;
      this.lifeTimer = new ig.Timer(this.lifeTime);
      Math.floor(Math.random()*10)>5?this.vel.x=200:this.vel.x=-200;
      Math.floor(Math.random()*10)>5?this.vel.y=200:this.vel.y=-200;
      
    },
    handleMovementTrace: function(res) {
      this.pos.x += this.vel.x * ig.system.tick;
      this.pos.y += this.vel.y * ig.system.tick;
    },
    update: function() {
      this.parent();
      if (this.lifeTimer && this.lifeTimer.delta() >= 0) {
        this.kill();
      }
    }
  });

  EntityPlayerDeath = ig.Entity.extend({
    gravityFactor: 0,
    animSheet: new ig.AnimationSheet('media/sprites/player.png', 50, 37),
    lifeTime: 1.2,
    lifeTimer: null,
    size: {
      x: 32,
      y: 32
    },
    offset: {
      x: 0,
      y: 0
    },
    maxVel: {
      x: 700,
      y: 700
    },
    friction: {
      x: 500,
      y: 100
    },

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('dying', 5, [0], true);
      this.lifeTimer = new ig.Timer(this.lifeTime);
    },
    update: function() {
      this.parent();
      if (this.lifeTimer && this.lifeTimer.delta() >= 0) {
        this.kill();
      } else if (this.lifeTimer) {
        this.currentAnim.alpha = this.lifeTimer.delta().map(-this.lifeTime, 0, 1, 0);
      }
    }
  });
});
