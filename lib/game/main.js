/**
*  @main.js
*  @version: 1.00
*  @author: Sven Anders Robbestad
*  @date: April 2013
*  @copyright (c) 2013 Sven Anders Robbestad, under the Apache License, Version 2.0
*  
*  Part of the Carnage Starter Kit: 
*/
var nX,nY;
if(typeof canvas != 'undefined'){
  canvas.addEventListener('touchstart', function(event){
     ig.input.actions['mouse']=true;
     nX=event.touches[0].pageX;
     nY=event.touches[0].pageY;
  }, false);

  canvas.addEventListener('touchmove', function(event){
     ig.input.actions['mouse']=true;
     mX=event.touches[0].pageX;
     mY=event.touches[0].pageY;
  }, false);
  
  canvas.addEventListener('touchend', function(event){
       ig.input.delayedKeyup['mouse'] = true;
  },false);
}


ig.module("game.main").
requires("impact.game",
    "impact.font",
    "game.config",
    "game.levels.main",
    'plugins.utilities',
    'game.entities.player',
    'game.entities.enemies.enemy-major',
    'game.entities.pickups.pickup-health',
    'game.entities.pickups.pickup-shield',
    'game.entities.pickups.pickup-doublebullets',
    'game.entities.pickups.pickup-triplebullets',
    'game.entities.ingametext',
    'plugins.impact-storage',
    'plugins.touch-button',
    'plugins.touch-joystick',
    "plugins.preloader").
defines(function () {
     
     // ********************************************
     //
     //
     //
     //
     //
     //                 GAME SCENE
     //
     //
     //
     //
     //
     // ********************************************


    window.Carnage = ig.Game.extend({
        font: new ig.Font("media/font24.png"),
        spawnTimer: null,
        kills:null,
        gravity:0,
        lives:3,
        joystick: null,
        enemySize:48,
        heart: new ig.Image("media/sprites/icon.png"),
        onegamlogo: new ig.Image('media/1gam.png'),
        menubuttons: [],
        doublebullets:false,
        triplebullets:false,
        weapontimer:null,
        killsactual:0,
        tempkill:0,
        scoreReportedScore:false,
        scoreReportedPop:false,
        tempscore:0,
        score: 0,
        omega: 7,
        amplitude: 30,
        baseLevel: 50,
        gamePaused:false,
        enemiesSpawned:false,
        phi: 5,
        getreadytimer:null,
        onegamtimer:null,
        gameCenter:null,
        clearColor: null,
        backgroundScroll:null,
        backgroundMap:null,
        gameOverTimer:null,
        gameOver:false,
        gameOverTimerSet:false,
        spawnPos:null,
        player:null,
        floatTimer:null,
        waitTimer:0,
        flyTimer:0,
        shield:100,
        beam:0,
        enemiesOnScreen:0,
        playerKilled:false,
        respawnTimer:null,
        vel:{
          x:0,
          y:0
        },
        init: function () {
        // Define music tracks
        if(ig.music) ig.music.stop();  

        this.floatTimer = new ig.Timer(0.5);
        this.respawnTimer = new ig.Timer(1.5);
        this.spawnTimer = new ig.Timer(3);
        this.weapontimer = new ig.Timer(10);
        this.gamePaused=false;
        var nX;
        var nY;
        if(ig.ua.mobile||ig.ua.ipad||window.ejecta){
            ig.input.bind( ig.KEY.MOUSE1, 'CanvasTouch');
            ig.input.bindTouch( '#canvas', 'CanvasTouch' );
          } else {
        ig.input.bind( ig.KEY.MOUSE1,"CanvasTouch");
        }
        ig.input.bind( ig.KEY.ENTER, 'interact' );
        ig.input.bind( ig.KEY.UP_ARROW, 'moveUp' );
        ig.input.bind( ig.KEY.SPACE, 'fire' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'moveDown' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'moveLeft' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'moveRight' );

        this.spawnPosX=[];
        this.spawnPosY=[];
        this.scoreReportedScore=false;
        this.scoreReportedPop=false;

        this.vel.x=-50;
        this.maxwidth=Math.floor(ig.system.canvas.width/this.enemySize);
        var start=this.enemySize;
            while(start<ig.system.canvas.width-this.enemySize*2){
              start+=this.enemySize*3;
              this.spawnPosX.push(start);
            }

        start=0;
        for(j=0;j<10;j++){
          start-=this.enemySize*j;
          this.spawnPosY.push(start);
        }

        //GLOBAL VARIABLES
        this.backgroundScroll=0;
        this.gameOver=false;
        this.getreadytimer=new ig.Timer(1.5);
        this.onegamtimer=new ig.Timer(2);
        this.gameOverTimerSet=false;
        this.storage = new ig.Storage();
        
        // initalize storage variables 
        this.storage.initUnset('highScore', 0);
        this.storage.initUnset('playerName', '');
        this.storage.initUnset('level', 0);
        this.storage.initUnset('tempScore', 0);

        // On init, set start at level 1
        ig.game.storage.set("currentLevel",1);
        this.currentLevel=1;

        // set variables from storage
        this.highScore=this.storage.get('highScore');
        
        // If you want to start at a different level, unrem this 
        /*
        var storageLevel=this.storage.get('currentLevel');
        if(storageLevel)
        this.currentLevel=storageLevel;
        else
          this.currentLevel=1;
        */

        // load the basic background map
        this.loadLevel(LevelMain);

        // set player var for easy access
        this.player=this.getEntitiesByType(EntityPlayer)[0];
        this.player.pos.x=ig.system.canvas.width/2;
        this.player.pos.y=ig.system.canvas.height-100;
          if( ig.ua.mobile) {
            var radius = 55,
            margin = 20,
            y = ig.system.height - radius - margin,
            r1 = radius + margin;
            //this.stickLeft = new ig.AnalogStick(r1, y, radius, 40);

            x1 = radius + margin,
            x2 = ig.system.width - radius - margin;

            var y1 = ig.system.height - radius - margin / 2,
            x1 = (ig.system.width - radius - margin / 2)-45;
            var y2 = ig.system.height - radius - margin * 4,
            x2 = (ig.system.width - radius + margin)-25;

        } else {
            ig.input.bind(ig.KEY.X, "fire"),
            ig.input.bind(ig.KEY.C, "fire_rocket");
          }

        this.gameOverTimer=new ig.Timer(3);
        Carnage.initialized = true;
        this.joystick = new TouchJoystick();
             
        },

        updateControlMovement: function () {
                if (this.player === null)
                    this.player=this.getEntitiesByType(EntityPlayer)[0];

                if (this.player.pos.y + this.player.size.y < 0)
                    return;
                if (this.joystick) {
                    if (ig.input.pressed('CanvasTouch')) {
                        if(window.ejecta){
                        this.joystick.activate(nX,nY);

                        } else {
                        this.joystick.activate(ig.input.mouse.x, ig.input.mouse.y);
                        }

                    } else if (ig.input.released('CanvasTouch')) {
                        this.joystick.deactivate();
                    }


                    if(window.ejecta){
                      this.joystick.update(mX,mY);
                    } else {
                    this.joystick.update(ig.input.mouse.x, ig.input.mouse.y);
                    }

                    // Mouse Control Logic
                    if (this.joystick.mouseDown) {
                        var mouseDownPoint = this.joystick.mouseDownPoint;
                        this.currentMousePoint = this.joystick.currentMousePoint;

                        var distPercent = this.currentMousePoint.dist / this.joystick.radius;
                        //TODO This needs to be based on angle and distance
                        if (this.currentMousePoint.y < mouseDownPoint.y && this.currentMousePoint.dist > 20) {
                            //this.player.jumpDown(distPercent);
                            this.currentMousePoint.flying = true;
                        }
                        var sensibility=20;
                        if (this.currentMousePoint.dist > 5) {
                            if (this.currentMousePoint.x > mouseDownPoint.x+sensibility) {
                                if (this.player.moving.left > 0)
                                    this.player.leftReleased();
                                this.player.rightDown(distPercent);
                                this.currentMousePoint.dir = 1;
                            } else if (this.currentMousePoint.x < mouseDownPoint.x-sensibility) {
                                if (this.player.moving.right > 0)
                                    this.player.rightReleased();
                                this.player.leftDown(distPercent);
                                this.currentMousePoint.dir = 0;
                            }

                            if (this.currentMousePoint.y > mouseDownPoint.y+sensibility) {
                                if (this.player.moving.down > 0)
                                    this.player.downReleased();
                                this.player.down(distPercent);
                                //this.currentMousePoint.dir = 1;
                            } else if (this.currentMousePoint.y < mouseDownPoint.y-sensibility) {
                                if (this.player.moving.up > 0)
                                    this.player.upReleased();
                                this.player.up(distPercent);
                                //this.currentMousePoint.dir = 0;
                            }
                        } else {
                            //console.log("Release");
                            if (this.currentMousePoint.dir)
                                this.player.rightReleased();
                            else {
                                this.player.leftReleased();
                            }
                        }

                    } else {
                        if (this.currentMousePoint) {
                            if (this.currentMousePoint.dir)
                                this.player.rightReleased();
                            else {
                                this.player.leftReleased();
                            }
                        }
                        this.currentMousePoint = null;
                    }

                }
                // Keyboard Controls
                if (this.player && !this.gameOver) {
                    // Controls
                    if (ig.input.pressed('left')) {
                        this.player.leftDown();
                    } else if (ig.input.released('left')) {
                        this.player.leftReleased();
                    }

                    if (ig.input.pressed('right')) {
                        this.player.rightDown();
                    } else if (ig.input.released('right')) {
                        this.player.rightReleased();
                    }

                }
            },
        reset: function() {
          this.currentLevel = 1;
          this.entities = [];
        },
        setTitle: function() {
              this.reset();
            },

         loadLevel: function( data ) {
             this.parent( data );
             this.backgroundMap = this.backgroundMaps[0];
             this.backgroundMaps.erase( this.backgroundMap );
         },
         nextlevel:function(){
          this.storage.set('score',this.score);
          ig.game.score=this.score;
          this.currentLevel++;
          this.storage.set('currentLevel',this.currentLevel);
          this.getreadytimer.set(0.5);
          this.spawnTimer.set(1);
          this.enemiesSpawned=false;
        },
        update: function () {
          this.parent();

          // Reset weapons:
          if(this.weapontimer.delta()>0){
            this.doublebullets=false;
            this.triplebullets=false;
            this.weapontimer.reset();
          }

          // Update control movement
          if (!this.gameOver && !this.gamePaused)
              this.updateControlMovement();

          // Respawn player if he died, game over if out of lives
          if(this.playerKilled === true && this.lives<=0){
            this.gameOver=true;

            // PLAYER DIED!
            this.storage.set('killsactual',this.killsactual);
            this.storage.set('score',this.score);
            ig.game.score=this.score;

            //this.gameOverTimer.reset();
          }
          else if( (this.playerKilled == true || ig.game.getEntitiesByType(EntityPlayer).length<=0) && this.respawnTimer.delta()>0 && 
            ig.game.getEntitiesByType(EntityPlayer).length<=0){
            this.playerKilled = false;
            ig.game.shield=100;
            player=ig.game.spawnEntity(EntityPlayer,ig.system.canvas.width/2,ig.system.canvas.height-100);
            this.player=this.getEntitiesByType(EntityPlayer)[0];

          }


            if (ig.input.pressed("startGame") && this.gameOver) {
                ig.system.setGame(Carnage);
                return;
            }


     // ********************************************
     //                SPAWN LOGIC
     // ********************************************



    if(!this.gameOver){
      //Jump to next level
      if(this.enemiesOnScreen<=0 && this.enemiesSpawned) this.nextlevel();


      // Set up the levels
      var spawnmore=false;
      var spawnRows=4; // define max rows of enemies to be spawned
      if(!this.enemiesSpawned){
        console.log("spawn:"+this.enemiesSpawned+" onscreen: "+this.enemiesOnScreen);
      var numberOfWaves=10;
      var wave=Math.floor(Math.random()*numberOfWaves);
      
      // if you want to debug a wave, enter the wave number directly here 
      // wave=0;

      switch(wave){
        case 0:
          if(!this.enemiesSpawned){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-this.enemySize,{enemyType:15});
            if(spawnRows>=2){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(this.enemySize*2),{enemyType:16});
            }
            if(spawnRows>=3){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(this.enemySize*3),{enemyType:17});
            } 
            if(spawnRows>=4){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(this.enemySize*4),{enemyType:12});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;


        case 1:
          if(!this.enemiesSpawned){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-this.enemySize:-(this.enemySize*2),{enemyType:7});
            if(spawnRows>=2){
              for(i=1;i<this.maxwidth;i++)
              this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*4),{enemyType:7});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

        case 2:
          if(!this.enemiesSpawned){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(i*this.enemySize),{enemyType:4,attackFormation:2});
            if(spawnRows>=2){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+this.enemySize),{enemyType:14,attackFormation:2});
            }if(spawnRows>=3){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize*2)),{enemyType:8,attackFormation:2});
            }if(spawnRows>=4){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize*3)),{enemyType:8,attackFormation:2});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

        case 3:
          if(!this.enemiesSpawned){
            for(i=3;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(i*this.enemySize),{enemyType:9,attackFormation:3});
            if(spawnRows>=2){
            for(i=3;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+this.enemySize),{enemyType:10,attackFormation:3});
            }if(spawnRows>=3){
            for(i=3;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize*2)),{enemyType:16,attackFormation:3});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

        case 4:
          if(!this.enemiesSpawned){
            for(i=this.maxwidth;i>3;i--)
            this.spawnEntity(EntityEnemyMajor,ig.system.canvas.width-(i*this.enemySize),-(i*this.enemySize),{enemyType:10,attackFormation:4});
            if(spawnRows>=2){
            for(i=this.maxwidth;i>3;i--)
            this.spawnEntity(EntityEnemyMajor,ig.system.canvas.width-(i*this.enemySize),-Math.abs((i*this.enemySize)+(this.enemySize)),{enemyType:17,attackFormation:4});
            }if(spawnRows>=3){
            for(i=this.maxwidth;i>3;i--)
            this.spawnEntity(EntityEnemyMajor,ig.system.canvas.width-(i*this.enemySize),-Math.abs((i*this.enemySize)+(this.enemySize*2)),{enemyType:18,attackFormation:4});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

        case 5:
          if(!this.enemiesSpawned){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(i*this.enemySize),{enemyType:11,attackFormation:2});
            if(spawnRows>=2){
              for(i=1;i<this.maxwidth;i++)
              this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize)),{enemyType:19,attackFormation:2});
            }if(spawnRows>=3){
              for(i=1;i<this.maxwidth;i++)
              this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize*2)),{enemyType:20,attackFormation:2});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;


        case 6:
          if(!this.enemiesSpawned){
            for(i=3;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(i*this.enemySize),{enemyType:12,attackFormation:3});
            if(spawnRows>=2){
            for(i=3;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize)),{enemyType:21,attackFormation:3});
            }if(spawnRows>=3){
            for(i=3;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize*2)),{enemyType:22,attackFormation:3});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

        case 7:
          if(!this.enemiesSpawned){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize):-(this.enemySize*2),{enemyType:7});
            if(spawnRows>=2){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*4),{enemyType:8});
            }if(spawnRows>=3){
              for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*6),{enemyType:8});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

        case 8:
          if(!this.enemiesSpawned){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-(i*this.enemySize),{enemyType:4,attackFormation:2});
            if(spawnRows>=2){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize)),{enemyType:13,attackFormation:2});
            }if(spawnRows>=3){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,-Math.abs((i*this.enemySize)+(this.enemySize*2)),{enemyType:14,attackFormation:2});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

    
     
        case 9:
        // ENEMYSTORM
          if(!this.enemiesSpawned){
            var enemySprite=Math.floor(Math.random()*5)+59;
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize):-(this.enemySize*2),{enemyType:enemySprite,attackFormation:7});
            if(spawnRows>=2){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*3),{enemyType:enemySprite,attackFormation:7});
            }if(spawnRows>=3){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*4),{enemyType:enemySprite,attackFormation:7});
            }if(spawnRows>=4){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*5),{enemyType:enemySprite,attackFormation:7});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;

          case 10:
          default:
        // ENEMYSTORM
          if(!this.enemiesSpawned){
            var enemySprite=Math.floor(Math.random()*5)+59;
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize):-(this.enemySize*2),{enemyType:enemySprite,attackFormation:7});
            if(spawnRows>=2){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*3),{enemyType:enemySprite,attackFormation:7});
            }if(spawnRows>=3){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*4),{enemyType:enemySprite,attackFormation:7});
            }if(spawnRows>=3){
            for(i=1;i<this.maxwidth;i++)
            this.spawnEntity(EntityEnemyMajor,i*this.enemySize,i%2?-(this.enemySize*3):-(this.enemySize*5),{enemyType:enemySprite,attackFormation:7});
            }
            this.enemiesOnScreen=ig.game.getEntitiesByType(EntityEnemyMajor).length;
            this.enemiesSpawned=true;
         }
        break;


      }

    }
  }



     // ********************************************
     //                 SCROLL
     // ********************************************

        var modifier=this.currentLevel;
        if(this.currentLevel>25) modifier=25;
        this.backgroundScroll += ig.system.tick * (350+(10*this.currentLevel));
        //if(ig.game.gameOver) this.backgroundScroll=0;
        this.backgroundMap.setScreenPos( 0,-this.backgroundScroll );

        },
        draw: function () {
            this.backgroundMap.draw();
            this.parent();


            this.color="#4c75aa";
            if(!this.gameOver){
            this._draw_hearts();
            if(this.onegamtimer.delta()<0)
            this._draw_onegam();

            this._draw_shield();

            if (this.joystick) {
                if (this.joystick.mouseDown) {
                    if (this.joystick.mouseDownPoint) {
                       innerjoy=new ig.Image("media/ui/backbutton.png");
                       innerjoy.draw(this.joystick.mouseDownPoint.x - this.joystick.radius, this.joystick.mouseDownPoint.y - this.joystick.radius);
                       outerjoy=new ig.Image("media/ui/button.png");
                       outerjoy.draw(this.joystick.currentMousePoint.x+10 - this.joystick.radius/2, this.joystick.currentMousePoint.y+5 - this.joystick.radius/2);
                       // this.textures.drawFrame("media/ui/touch-point-small.png", this.joystick.mouseDownPoint.x - this.joystick.radius, this.joystick.mouseDownPoint.y - this.joystick.radius);
                       // this.textures.drawFrame("media/ui/touch-point-large.png", this.joystick.currentMousePoint.x - this.joystick.radius, this.joystick.currentMousePoint.y - this.joystick.radius);
                    }
                }
            }

            }

            ///*** GAMEOVER **** ///
            if(this.currentLevel===250){
              // arbitrary end to our game
              this.gameOver=true;
            }

              if(this.gameOver){
                if(!this.gameOverTimerSet){
                  this.gameOverTimer.set(7);
                  this.gameOverTimerSet=true;
                  ig.game.storage.set("highScore",ig.game.score);
                }

                for(i=0;i<ig.game.entities.length;i++){
                  ig.game.removeEntity( ig.game.entities[i]);
                }

                if(ig.ua.mobile){
                  if(this.currentLevel==250){
                    this.font.draw("GAME OVER", ig.system.canvas.width/2, 60, ig.Font.ALIGN.CENTER);
                    this.font.draw("WOW! YOU WON!", ig.system.canvas.width/2, 130, ig.Font.ALIGN.CENTER);
                    this.font.draw("YOUR ACHIEVEMENT WILL GO", ig.system.canvas.width/2, 150, ig.Font.ALIGN.CENTER);
                    this.font.draw("DOWN IN THE ANNALS OF", ig.system.canvas.width/2, 170, ig.Font.ALIGN.CENTER);
                    this.font.draw("HISTORY", ig.system.canvas.width/2, 190, ig.Font.ALIGN.CENTER);
                  } else {

                  this.font.draw("GAME OVER", ig.system.canvas.width/2, 60, ig.Font.ALIGN.CENTER);
                  this.font.draw("FINAL SCORE:", ig.system.canvas.width/2, 120, ig.Font.ALIGN.CENTER);
                  this.font.draw(ig.game.score+" POINTS", ig.system.canvas.width/2, 140, ig.Font.ALIGN.CENTER);
                  }
                  if(this.gameOverTimer.delta()>0){
                    ig.system.setGame(Carnage);
                    window.setTimeout('Carnage', 1);
                  }
                  } else {
                    this.font.draw("GAME OVER", ig.system.canvas.width/2, 100, ig.Font.ALIGN.CENTER);
                    
                    if(this.currentLevel==250){
                      this.font.draw("WOW! YOU WON!", ig.system.canvas.width/2, 130, ig.Font.ALIGN.CENTER);
                      this.font.draw("YOUR ACHIEVEMENT WILL GO", ig.system.canvas.width/2, 150, ig.Font.ALIGN.CENTER);
                      this.font.draw("DOWN IN THE ANNALS OF", ig.system.canvas.width/2, 170, ig.Font.ALIGN.CENTER);
                      this.font.draw("HISTORY", ig.system.canvas.width/2, 190, ig.Font.ALIGN.CENTER);
                    }
                    if(this.gameOverTimer.delta()>0){
                         ig.system.setGame(Carnage);
                    }


             }
            }


      if(window.ejecta || ig.ua.mobile){
        //this.stickLeft.draw();
        var ctx = ig.system.context;
        ctx.font = "11pt Avenir-Black";
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.score+"   ", ig.system.canvas.width, 21);
        ctx.fillText("   Wave: "+this.currentLevel, ig.system.canvas.width/2, 21);
      } else {
            this.font.draw("Wave: "+this.currentLevel+"           "+this.score+"   ", ig.system.canvas.width, 5, ig.Font.ALIGN.RIGHT);
      }


      },
      _draw_shield: function(){
        height=Math.abs(this.shield);
        var startpos=ig.system.canvas.height/2;
         // border/background
        ig.system.context.fillStyle = "rgb(108,94,181)";
        ig.system.context.beginPath();
        ig.system.context.rect(
                        23 * ig.system.scale,
                        (ig.system.canvas.height/2-(height+25) - 8) * ig.system.scale,
                        24 * ig.system.scale,
                        height+5 * ig.system.scale
                    );
        ig.system.context.closePath();
        ig.system.context.fill();

        if(height<0){
          height=0;
          }
        if(height>50)ig.system.context.fillStyle = "rgba(112,164,178,1)";
        //else if(height>25)ig.system.context.fillStyle = "rgba(90,90,0,0.9)";
        else ig.system.context.fillStyle = "rgba(154,103,89,1)";
        ig.system.context.fillRect((25*ig.system.scale),
        ig.system.canvas.height/2-(30*ig.system.scale)  , 20*ig.system.scale, -(height*ig.system.scale));
      },
     _draw_hearts: function () {
      if(this.lives>0){
            for(var c = 0; c < (this.lives); c++){
              this.heart.draw(22*c, 15);
            }
          }
     },
     _draw_onegam:function(){
      this.onegamlogo.draw(ig.system.canvas.width/2-100,ig.system.canvas.height/2-100);
     }

    });





    // ********************************************
    //                 SET UP CANVAS
    // ********************************************

    var innerWidth = window.innerWidth,
    innerHeight = window.innerHeight;

    window.innerWidth>600?innerWidth=600:window.innerWidth;
    window.innerHeight>800?innerHeight=800:window.innerHeight;
    ig.startNewGame = function (width, height) {
    ig.$('#canvas').style.display = 'block';

    ig.main("#canvas", Carnage, 60, width, height, 1,SvenardoLoader);

    if (window.resizeGame)
        window.resizeGame();
    };

    if( ig.ua.mobile) {
        var e = window.innerWidth,
        t = window.innerHeight;
        window.innerWidth > Config.background.x && 
        (e = Config.background.x), window.innerHeight > Config.background.y 
        && (t = Config.background.y);
        ig.Sound.enabled = false;
        ig.startNewGame(e, t);
    } else {
      if (typeof(WinJS) == 'undefined') {
        ig.startNewGame(innerWidth, innerHeight);
        if(!ig.ua.mobile) window.resizeGame();
      }
    }
});
