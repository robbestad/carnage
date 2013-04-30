/**
*  @enemy-major.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
ig.module("game.entities.enemies.enemy-major").
requires("game.entities.enemies.enemy").
defines(function() {
  EntityEnemyMajor = EntityEnemy.extend({
    size: {
      x: 48,
      y: 48
    },
    offset: {
      x: 0,
      y: 0
    },
    waveTimer:null,
    enemyType:0,
    attackFormation:1,
    animSheet: new ig.AnimationSheet("media/sprites/enemy.png", 48, 48),
    health: 20,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      //this.enemyType=Math.floor(Math.random(3)*10);
      this.addAnim("normal", 1, [this.enemyType]);
      this.waveTimer=new ig.Timer(1);
    },
    update: function(){
        /*
        // SAMPLE MODIFIERS
        this.baseHeight=100;
        this.top+=2;
        this.ampl= 3 + 7* Math.random();
        this.omega= 7,
        this.amplitude=30,
        this.baseLevel= 50,
        this.phi=1;
        */


        switch(this.attackFormation){
          case 1:
          this.top+=2;
          this.vel.x= this.baseHeight* (Math.cos(this.omega * this.waveTimer.delta() *  this.phi));

          this.accel.y+=20;

          if(this.pos.y>ig.system.canvas.height/2) this.accel.y=-500;
          break;


          case 2:
          if(this.pos.x<0)
          this.vel.x= (this.pos.y+Math.sin(2*Math.PI)+ (Math.cos(this.omega * this.waveTimer.delta() + this.phi)));
          this.accel.y+=40;
          if(this.pos.x>ig.system.canvas.width-50) this.vel.x=-500;
          if(this.pos.y>ig.system.canvas.height/2) this.accel.y=-500;
          break;

          case 3:
          //LEFT TO RIGHT 
          if(this.pos.x<0)
          this.vel.x= (this.pos.y+Math.sin(2*Math.PI)+ (Math.cos(this.omega * this.waveTimer.delta() + this.phi)));
          if(this.pos.x>ig.system.canvas.width-50) this.vel.x=-500;
          if(this.pos.y>ig.system.canvas.height-100)this.accel.y=-500;
          if(this.pos.y<100)this.accel.y=500;
          break;

          case 4:
          //RIGHT TO LEFT
          if(this.pos.x<this.size.x){
            this.accel.x=500;
          } else if(this.pos.x>ig.system.canvas.width-(this.size.x*2)) {
            this.accel.x=-500;
          }
          if(this.pos.y>ig.system.canvas.height-100)this.accel.y=-500;
          if(this.pos.y<100)this.accel.y=500;
          break;

          case 5:
          // HOVER THEN EXPLODE
          this.vel.x=0;
          if(this.pos.y>ig.system.canvas.height/4) this.vel.y=0;this.vel.x=this.baseHeight*(Math.cos(this.omega * this.waveTimer.delta() *  this.phi));
          if(this.lifetimer.delta()>0){
          //this.exploded=true;
          var bullets=8;
              var inc = 180 / (bullets - 1);
              var a = 0;
              var radius = 0;
              for (var i = 0; i < bullets; i++) {
                var angle = a * Math.PI / 180;
                var x = this.pos.x;
                var y = this.pos.y+24;
                ig.game.spawnEntity(EntityMajorBullet, x, y, {
                  angle: angle
                });
                a += inc;
              }
              ig.game.removeEntity(this);
              var x = this.pos.x + this.size.x / 2,
              y = this.pos.y + this.size.y / 2;
              ig.game.spawnEntity(EntityExplosionShip, x, y);
              //ig.game.enemiesOnScreen--;
            //this.lifetimer.reset();
          }
          break;

          case 6:
          this.vel.x=this.baseHeight* (Math.cos(this.omega * this.waveTimer.delta() *  this.phi));
          this.accel.y+=10;
          if(this.lifetimer.delta()>0){
          var bullets=8;
              var inc = 180 / (bullets - 1);
              var a = 0;
              var radius = 0;
              for (var i = 0; i < bullets; i++) {
                var angle = a * Math.PI / 180;
                var x = this.pos.x+16;
                var y = this.pos.y;
                ig.game.spawnEntity(EntityMajorBullet, x, y, {
                  angle: angle
                });
                a += inc;
              }
            var x = this.pos.x + this.size.x / 2,
            y = this.pos.y + this.size.y / 2;
            ig.game.spawnEntity(EntityExplosionShip, x, y);
            ig.game.enemiesOnScreen--;
            ig.game.removeEntity(this);
            //this.lifetimer.reset();
          }
          break;


          case 7:
          this.top+=2;
          //this.vel.x= this.baseHeight* (Math.cos(this.omega * this.waveTimer.delta() *  this.phi));
          this.vel.x=0;
          this.accel.y+=100;
          this.maxVel.y=400;
          //if(this.pos.y>ig.system.canvas.height/2) this.accel.y=-500;
          break;


          default:
            this.vel.x=this.baseHeight* (Math.cos(this.omega * this.waveTimer.delta() *  this.phi));
            this.accel.y+=10;
          break;


        }
        this.parent();
    }
    });
});