var froggerGame = function() {
    var self = this;
    this.frog = undefined;
    this.updateInterval = undefined;

    this.update = function() {
        $('#frog').css("top",self.frog.yPos+"px");
        $('#frog').css("left",self.frog.xPos+"px");
        console.log(self.frog.xPos);
        console.log(self.frog.yPos);
    }

    this.initialize = function() {
        self.frog = new frog(0,0);
        console.log("test");
        $(document).keydown(function(event){
            if(event.code=="ArrowUp") {
                event.preventDefault();
                self.frog.yPos -= self.frog.speed;
                console.log("up");
            }
            else if(event.code=="ArrowDown") {
                event.preventDefault();
                self.frog.yPos += self.frog.speed;
                console.log("down");
            }
            else if(event.code=="ArrowLeft") {
                event.preventDefault();
                self.frog.xPos -= self.frog.speed;
                console.log("left");
            }
            else if(event.code=="ArrowRight") {
                event.preventDefault();
                self.frog.xPos += self.frog.speed;
                console.log("right");
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
    this.speed = 20;
}