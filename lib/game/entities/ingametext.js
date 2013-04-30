ig.module('game.entities.ingametext')
.requires('impact.font', 
          'impact.entity')
.defines(function() {
  EntityIngametext = ig.Entity.extend({
    gravityFactor: 0,
    size: {
      x: 20,
      y: 15
    },
    lifeTime: 1.5,
    string: null,
    lifeTimer: null,
    vel: {
      x: 0,
      y: -50
    },
    font: new ig.Font('media/font24.png'),
    
    startAlpha: 1,
    currentalpha: 1,
    endAlpha: 0,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      if (this.lifeTime > 0) {
        this.lifeTimer = new ig.Timer(this.lifeTime);
      }
      ig.game.specialEntity = this;
    },
    update: function() {
      if (this.lifeTimer && this.lifeTimer.delta() >= 0) {
        ig.game.specialEntity = null;
        this.kill();
      }
      this.currentAlpha = (this.lifeTime + this.lifeTimer.delta()).map(0, this.lifeTime, this.startAlpha, this.endAlpha);
      this.parent();
    },
    
    draw: function(reallyDraw) {
     var context = ig.system.context;
  
      if (this.currentAlpha != 1) {
        context.globalAlpha = this.currentAlpha;
      }
      if(ig.ua.mobile){
        context = ig.system.context;
        context.font = "11pt Avenir-Black";
        context.textAlign = 'right';
        context.fillStyle = '#ffffff';
        context.fillText(this.string+"   ",  (this.pos.x +100)- ig.game.screen.x , this.pos.y - ig.game.screen.y);
      } else {
        this.font.draw(this.string, this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, ig.Font.ALIGN.CENTER);
      }
      /* important or else other entities will inherit this.currentAlpha */
      if (context.globalAlpha != 1) {
        context.globalAlpha = 1;
      }
      if( reallyDraw ) {
        this.parent();
      }
    }
  });
});

