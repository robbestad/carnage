/**
*  @pickup-shield.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
ig.module("game.entities.pickups.pickup-shield").
requires("game.entities.pickups.pickup").
defines(function() {
  EntityPickupShield = EntityPickup.extend({
    size: {
      x: 40,
      y: 30
    },
    offset: {
      x: 0,
      y: 0
    },
    animSheet: new ig.AnimationSheet("media/sprites/powerup.png", 40, 30),
    health: 20,
    maxVel: {
      x: 25,
      y: 65
    },
    vel: {
      x: -25,
      y: 65
    },
    pickupType:"shield",
    courseAdjusted:false,
    collisionDamage: 0,
    init: function(x, y, settings) {
     this.addAnim("default", 30, [3]);
     this.parent(x, y, settings);
    }
  });
});