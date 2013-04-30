/**
*  @enemy.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
ig.module(  "game.entities.enemies.enemy").
requires(   "impact.entity", 
            "game.entities.explosion").
defines(function () {
    EntityEnemy = ig.Entity.extend({
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        EntityType: "enemy",
        name: "enemy",
        maxVel: {
          x: 125,
          y: 200
        },
        vel: {
          x: 125,
          y: 200
        },
        health: 1,
        score:500,
        lifetimer:null,
        bonustimer:null,
        invincible:false,
        collisionDamage: 5,
        isDead: false,
        exploded: false,
        baseHeight:100,
        top:2,
        omega: 7,
        amplitude:30,
        baseLevel: 50,
        phi:1,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.shoot_timer = new ig.Timer(2);
            this.lifetimer=new ig.Timer(3);
            this.bonustimer=new ig.Timer(3);
        },
        update: function () {
            this.parent();
            if(this.isDead) this.kill();
            if(this.shoot_timer.delta() > 0) this.shoot();
            if(this.pos.x+this.size.x<0)this.removeFromCanvas();
            if(this.pos.x>ig.system.canvas.width)this.removeFromCanvas();
            if(this.pos.y>ig.system.canvas.height)this.removeFromCanvas();
            // Remove without score if outside screen boundaries
        },
        removeFromCanvas:function(){
          ig.game.enemiesOnScreen--;
          ig.game.removeEntity(this);
        },
        receiveDamage: function( amount, from ) {
            if(this){
                //this.currentAnim.alpha-=0.1;
                this.health -= amount;
                if( this.health <= 0 ) {
                    this.currentAnim.alpha=1;
                    this.kill();
                }
            }
        },
        hit:function(other,amount){
          this.receiveDamage( this.amount, this.from );
        },
        check:function(other){
            this.health > other.collisionDamage ? this.receiveDamage(other.collisionDamage, this) : this.isDead = true;
            other.hit(this,15);
        },
        kill: function () {
            //ig.game.enemiesOnScreen--;
            ig.game.score+=this.score;
            ig.game.spawnEntity(EntityIngametext,this.pos.x,this.pos.y,{string:"+"+this.score});
            if(this.bonustimer.delta()>0){
              switch(Math.floor(Math.random()*4)){
              case 0://if(ig.game.getEntitiesByType(EntityPickupHealth).length<3){
              case 3:
              if(ig.game.getEntitiesByType(EntityPickupShield).length<1 &&
                ig.game.getEntitiesByType(EntityPickupDoublebullets).length<1 &&
                ig.game.getEntitiesByType(EntityPickupTriplebullets).length<1){
                ig.game.spawnEntity(EntityPickupShield,this.pos.x,this.pos.y,{});
              }
              break;

              case 1:
              if(ig.game.getEntitiesByType(EntityPickupShield).length<1 &&
                ig.game.getEntitiesByType(EntityPickupDoublebullets).length<1 &&
                ig.game.getEntitiesByType(EntityPickupTriplebullets).length<1){
                ig.game.spawnEntity(EntityPickupDoublebullets,this.pos.x,this.pos.y,{});
              }
              break;

              case 2:
              if(ig.game.getEntitiesByType(EntityPickupShield).length<1 &&
                ig.game.getEntitiesByType(EntityPickupDoublebullets).length<1 &&
                ig.game.getEntitiesByType(EntityPickupTriplebullets).length<1){
                ig.game.spawnEntity(EntityPickupTriplebullets,this.pos.x,this.pos.y,{});
              }
              break;

              default: break;
              }
              this.bonustimer.reset();
            }
            this.vel.x = 0, this.vel.y = -100;
            var x = this.pos.x + this.size.x / 2,
                y = this.pos.y + this.size.y / 2;
            ig.game.spawnEntity(EntityExplosionShip, x, y);
            for (var i = 0; i <= 15; i++) {
              ig.game.spawnEntity(EntityParticle, x,y);
            }
            this.removeFromCanvas();
           this.parent();


        },
        shoot: function() {
          //var player = ig.game.getEntitiesByType(EntityPlayer)[0];
          //if (!player) return;
          if(Math.floor(Math.random()*15)<5){
          var x = this.pos.x + this.size.x / 2,
              y = this.pos.y + this.size.y / 2;
          vel_x=0;
          //vel_y=this.vel.y*2;
          vel_y=1000;
          ig.game.spawnEntity(EntityEnemyAttackBullet, x, y, {
            vel: {
              x: vel_x,
              y: vel_y
            }
          });

          }
          this.shoot_timer.reset();

        }
     
    }), 
    EntityEnemyAttack = ig.Entity.extend({
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        health: 1,
        name:"bullet",
        zIndex: 90,
        maxVel: {
            x: 400,
            y: 400
        },
        collisionDamage: 5,
        haveCollision: false,
        isAttack: true,
        init: function(x, y, settings) {
            this.addAnim("normal", 1, [0], true);
            this.vel.y = -600;
            this.parent(x, y, settings);
        },

        update: function () {
            // Remove entity if outside of screen
            if(this.pos.x < ig.game.screen.x || this.pos.x + this.size.x > ig.game.screen.x + ig.system.width || this.pos.y < ig.game.screen.y || this.pos.y + this.size.y > ig.game.screen.y + ig.system.height || this.haveCollision){ ig.game.removeEntity(this); }
        },
        check: function (other) {
            // Don't die if being shot at. Bullets mustn't kill other bullets
            if(other.name!="bullet"){
                other.isAttack || (this.haveCollision = true)
            }
        }

    }),
   EntityEnemyAttackBullet = EntityEnemyAttack.extend({
    size: {
      x: 16,
      y: 16
    },
    offset: {
      x: 0,
      y: 0
    },
    animSheet: new ig.AnimationSheet("media/sprites/enemy-bullet.png", 16, 16),
    maxVel: {
      x: 200,
      y: 400
    },
    init: function(x, y, settings) {
      this.addAnim("normal", 10, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], false);
      this.vel.x = Math.cos(this.angle) * this.speed;
      this.vel.y = Math.sin(this.angle) * this.speed;
      this.parent(x, y, settings);
    },
    check:function(other){
      if(other.name != "bullet"){
        other.hit(this,5);
        this.kill();
      }
    },
    hit:function(){

    },

    update:function(){
      this.pos.x += this.vel.x * ig.system.tick;
      this.pos.y += this.vel.y * ig.system.tick;
      this.parent();
      if(this.pos.x < ig.game.screen.x || this.pos.x + this.size.x > ig.game.screen.x + ig.system.width || this.pos.y < ig.game.screen.y || this.pos.y + this.size.y > ig.game.screen.y + ig.system.height || this.haveCollision){ ig.game.removeEntity(this); }
    }
  });
EntityParticle = ig.Entity.extend({
    size: {
      x: 2,
      y: 2
    },
    offset: {
      x: 0,
      y: 0
    },
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.LITE,
    lifetime: 0.75,
    fadetime: 0.4,
    gravityFactor: 0,
    angle: 0,
    minBounceVelocity: 0,
    bounciness: 1.0,
    friction: {
      x: 0,
      y: 0
    },
    animSheet: new ig.AnimationSheet("media/particle-gradient.png", 2, 2),
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]);
      var vx = this.vel.x;
      var vy = this.vel.y;
      this.vel = {
        x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 100 + -this.vel.x,
        y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 100 + -this.vel.y
      };
      this.idleTimer = new ig.Timer();
    },
    hit:function(other,amount){
    },
    update: function() {
      if (this.idleTimer.delta() > this.lifetime) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
      this.parent();
      this.currentAnim.gotoFrame(this.currentAnim.alpha.map(0, 1, 0, 32));
    }
  });
 EntityParticleBlue = ig.Entity.extend({
    size: {
      x: 2,
      y: 2
    },
    offset: {
      x: 0,
      y: 0
    },
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.LITE,
    lifetime: 0.75,
    fadetime: 0.4,
    gravityFactor: 0,
    angle: 0,
    minBounceVelocity: 0,
    bounciness: 1.0,
    friction: {
      x: 0,
      y: 0
    },
    name:"bullet",
    animSheet: new ig.AnimationSheet("media/particle-gradient-blue.png", 2, 2),
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]);
      var vx = this.vel.x;
      var vy = this.vel.y;
      this.vel = {
        x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 100 + -this.vel.x,
        y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 100 + -this.vel.y
      };
      this.idleTimer = new ig.Timer();
    },
    update: function() {
      if (this.idleTimer.delta() > this.lifetime) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
      this.parent();
      this.currentAnim.gotoFrame(this.currentAnim.alpha.map(0, 1, 0, 32));
    }
  }),
  EntityMajorBullet = ig.Entity.extend({
     size: {
      x: 16,
      y: 16
    },
    offset: {
      x: 0,
      y: 0
    },
    maxVel:{
      x:1000,
      y:1000
    },
    image: new ig.Image('media/sprites/single-bullet.png'),
    health: 10,
    bulletspeed: 1000,
    maxSpeed: 160,
    name:"bullet",
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    update: function() {
      this.bulletspeed = Math.min(this.maxSpeed, this.bulletspeed + ig.system.tick * 100);
      this.vel.x = Math.cos(this.angle) * this.bulletspeed;
      this.vel.y = Math.sin(this.angle) * this.bulletspeed;
      this.pos.x += this.vel.x * ig.system.tick;
      this.pos.y += this.vel.y * ig.system.tick;
      if (this.pos.x > ig.system.width + 200 || this.pos.y > ig.system.height + 200 || this.pos.x < -200 || this.pos.y < -200) {
        this.kill();
      }
    },
    hit:function(other,amount){
    },
    check:function(other){
      if(other.name != "bullet"){
        other.hit(this,5);
        this.kill();
      }
    },
    draw: function() {
      ig.system.context.drawImage(this.image.data, this.pos.x - ig.game._rscreen.x - this.offset.x, this.pos.y - ig.game._rscreen.y - this.offset.y);
    }
  }),
  EntityDestroyerBullet = ig.Entity.extend({
     size: {
      x: 12,
      y: 18
    },
    offset: {
      x: 0,
      y: 0
    },
    maxVel:{
      x:1000,
      y:1000
    },
    name:"bullet",
    image: new ig.Image('media/sprites/drop.png'),
    health: 10,
    bulletspeed: 1000,
    maxSpeed: 160,
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    update: function() {
      this.bulletspeed = Math.min(this.maxSpeed, this.bulletspeed + ig.system.tick * 100);
      this.vel.x = Math.cos(this.angle) * this.bulletspeed;
      this.vel.y = Math.sin(this.angle) * this.bulletspeed;
      this.pos.x += this.vel.x * ig.system.tick;
      this.pos.y += this.vel.y * ig.system.tick;
      if (this.pos.x > ig.system.width + 200 || this.pos.y > ig.system.height + 200 || this.pos.x < -200 || this.pos.y < -200) {
        ig.game.removeEntity(this);
      }
    },
    hit:function(other,amount){

    },
    check:function(other){
      if(other.name != "bullet"){
        other.kill();
        this.kill();
      }
    },
    draw: function() {
      ig.system.context.drawImage(this.image.data, this.pos.x - ig.game._rscreen.x - this.offset.x, this.pos.y - ig.game._rscreen.y - this.offset.y);
    }
  });
});


