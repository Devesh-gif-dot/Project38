
var gameState;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  gameState = "play";
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth-20, displayHeight-30);
  
  sun = createSprite(displayWidth-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  trex = createSprite(50, displayHeight-70,20,50);
  
  score = 0;
  
  trex.addAnimation("running", trex_running);
  trex.addImage("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  // trex.debug=true
  
  invisibleGround = createSprite(displayWidth/2,displayHeight/0.79,displayWidth,125);  
  invisibleGround.shapeColor = "white"
  invisibleGround.visible = false;
  
  ground = createSprite(displayWidth/2,displayHeight/0.75,displayWidth,2);
  ground.addImage("ground",groundImage);
  ground.scale=1.5;
  ground.x = displayWidth/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/1.8,displayHeight-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(displayWidth/1.8,displayHeight);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;
  
  gameState = "play";
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  text("Score: "+ score,30,50);

  if (gameState==="play"){
    score = score + Math.round(getFrameRate()/60);
    trex.velocityX= 5;
    console.log(trex.y)
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= 980) {
      jumpSound.play( )
      trex.velocityY = -15;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if(trex.x > displayWidth/2){
      ground.x = trex.x;
      invisibleGround.x = trex.x;
      trex.x = displayWidth/2.5
    }
      
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = "end";
    }
  }

  else if (gameState === "end") {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeImage("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  camera.position.y = trex.y-100;
  camera.position.x=trex.x+300;  
  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,displayHeight-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 300;    
    
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x+400,displayHeight/0.86,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
              
    obstacle.scale = 0.3;
    obstacle.lifetime = 200;
    
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = "play";
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
