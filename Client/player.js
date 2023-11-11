const armLength = 50;
const legLength = 90;

class Player {
    constructor(x, y, name="") {
        this.name = name;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;

        //verticies
        this.vtx = {
            head:{x:0, y:0},
            elbowL:{x:0, y:0},
            elbowR:{x:0, y:0},
            handL:{x:0, y:0},
            handR:{x:0, y:0},
            legL:{x:0, y:0},
            legR:{x:0, y:0}
        }
        this.ang = {
            handL:1,
            handR:-1,
            legL:0,
            legR:0
        }
        this.angVel = {
            handL:0,
            handR:0,
            legL:0,
            legR:0
        }
        this.angAcc = {
            handL:0,
            handR:0,
            legL:0,
            legR:0
        }
    }
    update(player) {
        this.x = player.x;
        this.y = player.y;
        this.vx = player.vx;
        this.vy = player.vy;
    }
    updatePosition() { //DELETE
        this.x += this.vx;
    }
    updateVerticies() {
        //ragdolling !!!
        //arms
        if (this.vx!=0) {
            this.ang.handL += 0.05*Math.atan((this.vtx.handL.y-this.vtx.elbowL.y)/this.vx);
            this.ang.handR += 0.05*Math.atan((this.vtx.handR.y-this.vtx.elbowR.y)/this.vx);
            console.log(0.05*Math.atan((this.vtx.handL.y-this.vtx.elbowL.y)/this.vx))
        }
        this.angAcc.handL = -0.01*Math.sin(this.ang.handL) - 0.05*Math.sin(this.angVel.handL);
        this.angVel.handL += this.angAcc.handL;
        this.ang.handL += this.angVel.handL;
        this.vtx.handL.x = armLength*Math.cos(this.ang.handL + Math.PI/2);
        this.vtx.handL.y = armLength*Math.sin(this.ang.handL + Math.PI/2);

        this.angAcc.handR = -0.01*Math.sin(this.ang.handR) - 0.05*Math.sin(this.angVel.handR);
        this.angVel.handR += this.angAcc.handR;
        this.ang.handR += this.angVel.handR;
        this.vtx.handR.x = armLength*Math.cos(this.ang.handR + Math.PI/2);
        this.vtx.handR.y = armLength*Math.sin(this.ang.handR + Math.PI/2);
        //legs
        if (this.vx!=0) {
            this.ang.legL += 0.05*Math.atan((this.vtx.legL.y)/this.vx);
            this.ang.legR += 0.05*Math.atan((this.vtx.legR.y)/this.vx);
        }
        this.angAcc.legL = -0.01*Math.sin(this.ang.legL) - 0.05*Math.sin(this.angVel.legL);
        this.angVel.legL += this.angAcc.legL;
        this.ang.legL += this.angVel.legL;
        this.vtx.legL.x = legLength*Math.cos(this.ang.legL + Math.PI/2);
        this.vtx.legL.y = legLength*Math.sin(this.ang.legL + Math.PI/2);

        this.angAcc.legR = -0.01*Math.sin(this.ang.legR) - 0.05*Math.sin(this.angVel.legR);
        this.angVel.legR += this.angAcc.legR;
        this.ang.legR += this.angVel.legR;
        this.vtx.legR.x = legLength*Math.cos(this.ang.legR + Math.PI/2);
        this.vtx.legR.y = legLength*Math.sin(this.ang.legL + Math.PI/2);
    }
    draw(ctx) {
        ctx.fillStyle = "rgb(200,200,200)"
        //body
        ctx.beginPath();
        ctx.moveTo(this.x-15, this.y+40);
        ctx.lineTo(this.x-25,this.y+140);
        ctx.lineTo(this.x+25, this.y+140);
        ctx.lineTo(this.x+15, this.y+40);
        ctx.stroke();

        //limbs TODO
        //L arm
        ctx.beginPath();
        ctx.moveTo(this.x-15, this.y+40);
        ctx.lineTo(this.x+this.vtx.elbowL.x -50,this.y+this.vtx.elbowL.y +50);
        ctx.lineTo(this.x+this.vtx.handL.x -50,this.y+this.vtx.handL.y +50);
        ctx.stroke();
        //R arm
        ctx.beginPath();
        ctx.moveTo(this.x+15, this.y+40);
        ctx.lineTo(this.x+this.vtx.elbowR.x +50,this.y+this.vtx.elbowR.y +50);
        ctx.lineTo(this.x+this.vtx.handR.x +50,this.y+this.vtx.handR.y +50);
        ctx.stroke();
        //L leg
        ctx.beginPath();
        ctx.moveTo(this.x-25, this.y+140);
        ctx.lineTo(this.x+this.vtx.legL.x-25,this.y+this.vtx.legL.y+140);
        ctx.stroke();
        //R leg
        ctx.beginPath();
        ctx.moveTo(this.x+25, this.y+140);
        ctx.lineTo(this.x+this.vtx.legR.x+25,this.y+this.vtx.legR.y+140);
        ctx.stroke();
        //head
        ctx.beginPath();
        ctx.ellipse(this.x+this.vtx.head.x, this.y+this.vtx.head.y, 50, 50, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    

        //nose
        ctx.beginPath();
        ctx.moveTo(this.x+this.vtx.head.x+10, this.y+this.vtx.head.y+10);
        ctx.lineTo(this.x+this.vtx.head.x+60,this.y+this.vtx.head.y+20);
        ctx.lineTo(this.x+this.vtx.head.x+10, this.y+this.vtx.head.y+20);
        ctx.fill();
        ctx.stroke();


        //eyes
        ctx.beginPath();
        ctx.ellipse(this.x+this.vtx.head.x-15, this.y+this.vtx.head.y-10, 5, 5, 0, 0, 2 * Math.PI);
        ctx.ellipse(this.x+this.vtx.head.x+20, this.y+this.vtx.head.y-10, 5, 5, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fill();

    }
}

//module.exports = {Player, allPlayers}