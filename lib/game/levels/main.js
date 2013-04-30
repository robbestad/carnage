ig.module( 'game.levels.main' )
.requires( 'impact.image','game.entities.player' )
.defines(function(){
LevelMain=/*JSON[*/{"entities":[{"type":"EntityPlayer","x":452,"y":544}],"layer":[{"name":"arena","width":4,"height":2,"linkWithCollision":false,"visible":1,"tilesetName":"media/backgrounds/background.png","repeat":true,"preRender":false,"distance":"1","tilesize":1024,"foreground":false,"data":[[1,1,0,1],[1,1,1,1]]}]}/*]JSON*/;
LevelMainResources=[new ig.Image('media/backgrounds/background.png')];
});