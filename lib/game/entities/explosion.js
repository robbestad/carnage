/**
*  @explosion.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
 ig.module("game.entities.explosion")
 .requires("impact.entity")
 .defines(function () {
    EntityExplosion = ig.Entity.extend({
        zIndex: 50,
        init: function (x, y, settings) {
            this.parent(x - this.size.x / 2, y - this.size.y / 2);
        },
        hit:function(other,amount){
        },
        update: function () {
            this.parent();
            if(this.currentAnim.frame === this.frames_count) this.kill();
        }
    }), 
    EntityExplosionShip = EntityExplosion.extend({
        size: {
            x: 64,
            y: 64
        },
        animSheet: new ig.AnimationSheet("media/explosion-ship.png", 64, 64),
        sound: new ig.Sound("media/sfx/explosion5.*"),
        init: function (x, y, settings) {
            var r = [0, 1, 2, 3];
            this.frames_count = r.length - 1;
            this.addAnim("normal", 0.05, r, false);
            this.parent(x, y, settings);
            this.sound.play();
        },
        hit:function(other,amount){
        }
    });
});
