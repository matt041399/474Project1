var gameBoardWidth = 60 * 15;
var gameBoardHeight = 60 * 13;

var froggerGame = function() {
  var self = this;
  this.frog = undefined;
  this.updateInterval = undefined;

  // update the game state and call update functions of other objects
  this.update = function() {
    self.frog.update();
  }

  this.initialize = function() {
      self.frog = new frog(0,0);
      $(document).keydown(function(event){
          if(event.code=="ArrowUp") {
              event.preventDefault();
              self.frog.move(0,1);
          }
          else if(event.code=="ArrowDown") {
              event.preventDefault();
              self.frog.move(0,-1);
          }
          else if(event.code=="ArrowLeft") {
              event.preventDefault();
              self.frog.move(-1,0);
          }
          else if(event.code=="ArrowRight") {
              event.preventDefault();
              self.frog.move(1,0);
          }
      });

      updateInterval = setInterval(this.update,20);
  }

  this.initialize();
}

var frog=function(x,y) {
  var self = this;
  this.xPos = x;
  this.yPos = y;
  this.speed = 60;

  this.update = function() {
    // enforce gameboard bounds
    // assumes (0,0) is the bottom center
    if(self.xPos < -gameBoardWidth/2 + 30) {
        self.xPos = -gameBoardWidth/2 + 30;
    }
    else if(self.xPos > gameBoardWidth/2 - 30) {
        self.xPos = gameBoardWidth/2 - 30;
    }

    if(self.yPos < 0) {
        self.yPos = 0;
    }
    else if(self.yPos > gameBoardHeight-60) {
        self.yPos = gameBoardHeight-60;
    }

    $('#frog').css("top",-self.yPos+"px"); //note the negative sign; necessary so up is up and down is down; for some reason using the css property "bottom" didn't work right
    $('#frog').css("left",self.xPos+"px");
    console.log(self.xPos);
    console.log(self.yPos);
  }

  // moves the frog by speed * each multiplier passed in
  // example: move(1,0) moves the frog [speed] to the right
  this.move = function(xMult,yMult) {
    self.xPos += self.speed * xMult;
    self.yPos += self.speed * yMult;
  }
}
