// DECLARING THE "CANVAS ELEMENT" & SETING IT'S CONTEXT
const canva = document.querySelector("#canva");
const ctx = canva.getContext("2d");

// DELARATION OF THE COMPONENTS
// the user
const user = {
    x: canva.width - 25,
    y: (canva.height - 120)/2,
    width: 25,
    height: 120,
    score: 0
}
// the computer
const comp = {
    x: 0,
    y: (canva.height - 120)/2,
    width: 25,
    height: 120,
    score: 0
}
// the ball
const ball = {
    x: canva.width/2,
    y: canva.height/2,
    width: 20,
    height: 20,
    radius: 20,
    speed: 5,
    velocityX: 5,
    velocityY: 5
}
// the net
const net = {
    x: canva.width/2 - 1,
    y: 0,
    width: 2,
    height: 10
}

// FUNCTIONS TO DRAW THE COMPONENTS
// draw the user & computer
function drawRect(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
// draw the ball
function drawCircle(x, y, r, width, height, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, width, height);
    ctx.closePath();
    ctx.fill();
}
// draw the net
function drawNet(x, y, width, height){
    for(let i = 0; i < canva.height; i+=15){
        drawRect(x, y+i, width, height);
    }
}
// draw the score
function drawText(text, x, y, color){
    ctx.fillStyle = color;
    ctx.font = "45px monospace";
    ctx.fillText(text, x, y);
}

// RENDERIGN THE COMPONENTS TO THE "CANVAS"
function render(){
    // render the computer
    drawRect(comp.x, comp.y, comp.width, comp.height, "#e4e4e4d4");
    // render the user
    drawRect(user.x, user.y, user.width, user.height, "#e4e4e4d4");
    // render the ball
    drawCircle(ball.x, ball.y, ball.width, ball.height, "#e4e4e4d4");
    // render the net
    drawNet(net.x, net.y, net.width, net.height);
    // render the score of the computer
    drawText(comp.score, canva.width/4, canva.height/5);
     // render the score of the user
    drawText(user.score, 3*canva.width/4, canva.height/5);

}

// DETECTION OF THE COLLISION
function collision(b, p){
    b.top = b.y - b.radius;
    b.right = b.x + b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;

    p.top = p.y;
    p.right = p.x + p.width
    p.bottom = p.y + p.height;
    p.left = p.x;

    return b.left < p.right && b.bottom > p.top && b.top < p.bottom && b.right > p.left; 
}

// USER CONTROL
canva.addEventListener("mousemove", moveUser);
function moveUser(e){
    let rect = canva.getBoundingClientRect();
    user.y = e.clientY - rect.top - user.height/2;
}

// UPDATE THE POSITION OF COMPONENTS
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // simple AI to control the computer
    let computerLevel = 0.1;
    comp.y += (ball.y - (comp.y + comp.height/2))*computerLevel;

    if(ball.y < ball.radius || ball.y + ball.radius > canva.height){
        ball.velocityY = -ball.velocityY;
    }

    let player = ball.x > canva.width/2 ? user : comp;
    if(collision(ball, player)){
        let collidePoint = (ball.y - (player.y + player.height/2))/(player.height/2);
        let angleRad = collidePoint*(Math.PI/4);

        let direction = ball.x < (canva.width/2) ? 1 : -1;
        ball.velocityX = direction*ball.speed*Math.cos(angleRad);
        ball.velocityY = ball.speed*Math.sin(angleRad);

        ball.speed += 0.1;
    }
   // update the score
   if(ball.x < ball.radius){
        user.score++;
        resetBall();
   }else if(ball.x + ball.radius > canva.width){
        comp.score++;
        resetBall();
   } 
}

function resetBall(){
    ball.x = canva.width/2;
    ball.y = canva.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

 render();
let moveStart = Date.now();
function game(){
     // clear the canvas
    drawRect(0, 0, canva.width, canva.height, "black");
    update();
    render();
    let now = Date.now();
    let delta = now - moveStart;
    if(delta > 1000){
        moveStart = now;
    }
    requestAnimationFrame(game);
}
document.querySelector("#play-btn").addEventListener("click", ()=>{
    game();
});


