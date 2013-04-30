/**
*  @pickup.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
ig.module(  "game.entities.pickups.pickup").
requires(   "impact.entity").
defines(function () {
    EntityPickup= ig.Entity.extend({
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        EntityType: "bonus",
        maxVel: {
            x: 200,
            y: 300
        },
        health: 1,
        pickupType:null,
        collisionDamage: 20,
        isDead: !1,
        sound: new ig.Sound("media/sfx/pickup2.*"),
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        update: function () {
            this.parent();
            this.accel.y+=250;
            this.vel.y+=150;
            this.vel.x=0;
            this.parent();
            if(this.pos.x < ig.game.screen.x || this.pos.x + this.size.x > ig.game.screen.x + ig.system.width || this.pos.y < ig.game.screen.y || this.pos.y + this.size.y > ig.game.screen.y + ig.system.height || this.haveCollision){ ig.game.removeEntity(this); }
        },
        hit:function(other,amount){
        },
        check: function (other) {
            if(other.name==="hero"){
            this.sound.play();

            if(this.pickupType=="shield"){
                this.kill();
                ig.game.shield+=50;
                if(ig.game.shield>100)ig.game.shield=100;
            }
            if(this.pickupType=="doublebullets"){
                this.kill();
                ig.game.doublebullets=true;
                ig.game.triplebullets=false;
                ig.game.weapontimer.reset();
            }
            if(this.pickupType=="triplebullets"){
                this.kill();
                ig.game.doublebullets=false;
                ig.game.triplebullets=true;
                ig.game.weapontimer.reset();
            }

            if(this.pickupType=="health"){
                this.kill();
                ig.game.getEntitiesByType(EntityPlayer)[0].health+=30;
                    if(ig.game.getEntitiesByType(EntityPlayer)[0].health>100){
                        ig.game.getEntitiesByType(EntityPlayer)[0].health=100;
                    }
                }
            }
        }
    });
});