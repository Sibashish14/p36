var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed =0;
var lastFed =0;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed");
  feed.position(950,95);
  feed.mousePressed(feedDog);
  
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  if(foodS==0){
    dog.addImage(sadDog);
  }
}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 

  var readFoodStock=database.ref('FeedTime');
  readFoodStock.on("value",(data)=>{
    lastFed=data.val();
  });
 
  //write code to display text lastFed time here
  fill(0);
  if(lastFed>=12){
    text("Last Fed:"+lastFed%12+"PM",650,95);
  }else{
    text("Last Fed"+lastFed+"AM",650,95);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  if(foodObj.getFoodStock()<=0){
  foodObj.updateFoodStock(foodObj.getFoodObj()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  foodS--;
  database.ref('/').update({
    foodStock:foodS,
    lastFed:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
