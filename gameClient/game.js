let app = new PIXI.Application({width: 360, height: 640, antialias: true});
document.body.appendChild(app.view);

// load sprites
const getPath = (a) => 'images/' + a + ".png"
let images = ["car", "circle", "road"]

let data = {
  roadPosition: 0,
  speed: 5,
}

let loader = PIXI.loader.add(images.map(getPath)).load(() => {
  let sprites = {
    road1: new PIXI.Sprite(PIXI.loader.resources[getPath("road")].texture),
    road2: new PIXI.Sprite(PIXI.loader.resources[getPath("road")].texture),

    playerCar: new PIXI.Sprite(PIXI.loader.resources[getPath("car")].texture),
    circle: new PIXI.Sprite(PIXI.loader.resources[getPath("circle")].texture),

    ennemyCars1: new PIXI.Sprite(PIXI.loader.resources[getPath("car")].texture),
    ennemyCars2: new PIXI.Sprite(PIXI.loader.resources[getPath("car")].texture),
  }

  // init some positions

  // add sprites
  for(var s in sprites) {
    app.stage.addChild(sprites[s])
  }

  // starts game loop
  app.ticker.add(delta => {

    // GAME LOOP

    // UPDATE DATA
    data = {
      roadPosition: (data.roadPosition + delta * data.speed)%1280,
      speed: data.speed
    }

    // RENDER
    
    // lines
    sprites.road1.y = data.roadPosition
    sprites.road2.y = data.roadPosition - 1280

  });
})