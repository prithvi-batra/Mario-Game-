// Creating Variables.
var brickGroup;
var coinGroup;
var coinScore   = 0;
var jumpCounter = 0;
var obstacleGroup;
var gameState = "PLAY";
function preload(){
    // Adding Animations.
    mario_running =  loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png","images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
    marioDie      =  loadAnimation("images/dead.png");
    coinImage     =  loadAnimation("images/con1.png","images/con6.png");
    mushImage     =  loadAnimation("images/mush1.png","images/mush6.png");
    turImage      =  loadAnimation("images/tur1.png","images/tur5.png");
    // Adding Images.
    bgImage       =  loadImage("images/bgnew.jpg");
    brickImage    =  loadImage("images/brick.png");
    restartImage  =  loadImage("images/restart.png")
    
    // Adding Sounds.
    coinSound     =  loadSound("sounds/coinSound.mp3");
    dieSound      =  loadSound("sounds/dieSound.mp3");
}

function setup(){
    createCanvas(1000, 600);
    
    // create background Sprite.
    bg = createSprite(580,300);
    bg.addImage(bgImage);
    bg.scale = 0.4;
    
    // create Mario Sprite. 
    mario = createSprite(200,505,20,50);
    mario.addAnimation("running" ,mario_running);
    mario.addAnimation("Collided",marioDie);
    mario.scale = 0.2;

    // create ground Sprite. 
    ground =createSprite(200,525,400,10);
    ground.visible = false; 
    
    // creating Groups. 
    coinGroup = new Group();
    brickGroup = new Group();
    obstacleGroup = new Group();
    
    // creating sprite For Restart
    restart = createSprite(800,100);
    restart.addImage(restartImage);
    restart.scale = 0.4;
    
}

function draw(){
    background("black");
    mario.debug = true;
    if(gameState == "PLAY"){
    restart.visible = false;    
    // background Scroll. 
    if (bg.x < 250){
        bg.x = 750;
    }
    //mario.debug = true ;
    //console.log(jumpCounter); 
    
    // scaling Mario
    mario.scale = 0.2;
    mario.setCollider("rectangle",0,0,200,500);
    bg.velocityX = -4 ;
    // Limiting Jumps.
    
    if(mario.isTouching(ground)){
        jumpCounter = 0;
    }
    if(keyDown("space") && jumpCounter<5){
        mario.velocityY = -12;
        jumpCounter++;
    }

    // Gravity on Mario.
    mario.velocityY = mario.velocityY + 0.5;
    
    
    // Making Mario Colliding With Bricks
    for( var i = 0 ; i<brickGroup.length; i++){
        var temp = (brickGroup).get(i);
        if(temp.isTouching(mario)){
            // Mario Should Collide With Brick.
            mario.collide(temp);
            // Setting Jump Counter At 0 When Touching Brick. 
            jumpCounter = 0
        }
    };

    // Making Mario Not Move Out Of Screen When Coliding With The Brick.
    if (mario.x < 150){
        mario.x = 150;
    }
 
    // Making Mario Not Move Out Of Screen When Jumping.
    if (mario.y<50){
        mario.y = 100 ;
    }

    // Making Mario Collect The Coins.
    for(var i = 0 ; i<coinGroup.length ; i++){
        var temp = (coinGroup).get(i);
        if(temp.isTouching(mario)){
            // playing Coin Collecting Sound When Coin Is Collected.
            coinSound.play();
            // coinScore increment.
            coinScore++;
            // Destroying The Coin Collected.
            temp.destroy();
            temp = null;
        }
    }

    // Making Mario To Collide With Obstacles.
    for(var i = 0; i<obstacleGroup.length ; i++){
        var temp = obstacleGroup.get(i);
        if (temp.isTouching(mario)){
            // playing Die sound On Collision On Obstacle.
            dieSound.play(); 
            gameState = "END";
        }
    }

    // Calling Functions For Bricks ,Obstacles And Coins. 
    generateBricks();
    generateCoins();
    generateObstacles();
    }
    else if(gameState == "END"){
        restart.visible = true;    
        bg.velocityX = 0;
        obstacleGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        brickGroup.setVelocityXEach(0);   
        obstacleGroup.setLifetimeEach(-1);
        brickGroup.setLifetimeEach(-1);
        coinGroup.setLifetimeEach(-1);   
        mario.changeAnimation("Collided",marioDie);  
        mario.scale= 0.3;
        mario.setCollider("rectangle",0,0,300,20);
        mario.velocityY = 0;
        mario.velocityX = 0;
        mario.y = 500;
        if(mousePressedOver(restart)){
            restartGame();
        }
    }
    // Mario To Stay On Ground.
    mario.collide(ground);

    drawSprites();
    // Displaying Number Of Coins Collecting.
    textSize(20);
    stroke ("red");
    text("Coins Collected: " + coinScore,500,50);

}
function generateBricks() {
    // Gnerating Bricks After 70 Frames.
    if(frameCount%70 == 0){
    var brick = createSprite(1200,random(250,350),40,10);
    // Puting Brick Image And Adjusting It.
    brick.addImage (brickImage);
    brick.scale = 0.5 ; 
    // Making Brick Move.
    brick.velocityX = -4 ;
    // To Destroying Brick After A certain Time. 
    brick.lifetime = 350;
    brickGroup.add (brick);
}
}
function generateCoins(){
    // generating Coins After A certain Time.
    if(frameCount%50 == 0){
        var coin = createSprite(1200,random(100,300),40,10);
        // Adding Image And Adjusting It.
        coin.addAnimation("coin",coinImage);
        coin.scale  = 0.1;
        // Making The Coins Move.
        coin.velocityX= -4;
        // To Destroy Coins After A certain Time.
        coin.lifetime = 600;
        coinGroup.add(coin);
    }
}
function generateObstacles(){
    // generating Obstacles After A certain Time. 
    if(frameCount%100 == 0){
        var obstacle = createSprite(1200,490,40,40);
        // Making Obstacles Move.
        obstacle.velocityX = -4;
        // adding Random Function.
        var rand = Math.round(random(1,2));
        // Using Switch Case To Pick 1 ore 2.
        switch(rand){
            case 1 : 
            // Adding Animation
            obstacle.addAnimation("mush",mushImage);
            break; 
            case 2 :
            // Adding Animation.    
            obstacle.addAnimation("tur",turImage);
            break; 
            default : 
            break;            
        }
        // adjusting Obstacle.
        obstacle.scale= 0.15;
        // Lifetime To Destroy Obstacles After A certain Time.
        obstacle.lifetime = 300;
        obstacleGroup.add(obstacle);
    }
}
function restartGame(){
    gameState = "PLAY";
    obstacleGroup.destroyEach();
    coinGroup.destroyEach();
    brickGroup.destroyEach();
    mario.changeAnimation("running",mario_running);
    coinScore = 0;
}