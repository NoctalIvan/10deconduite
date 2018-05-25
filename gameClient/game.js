let app = new PIXI.Application({width: 360, height: 640, antialias: true});
document.body.appendChild(app.view);

// load sprites
const getPath = (a) => 'images/' + a + ".png"
let images = ["car", "car2", "circle", "road", "up", "down", "left", "right", "blinkLeft", "blinkRight"]

let data = {
  frame: 0,
  roadPosition: 0,
  speed: 5,
  playerCarX: 360/2 -60/2,
  turn: 0,
}

let loader = PIXI.loader.add(images.map(getPath)).load(() => {
  let sprites = {
    road1: new PIXI.Sprite(PIXI.loader.resources[getPath("road")].texture),
    road2: new PIXI.Sprite(PIXI.loader.resources[getPath("road")].texture),

    playerCar: new PIXI.Sprite(PIXI.loader.resources[getPath("car")].texture),
    circle: new PIXI.Sprite(PIXI.loader.resources[getPath("circle")].texture),

    ennemyCars1: new PIXI.Sprite(PIXI.loader.resources[getPath("car2")].texture),
    ennemyCars2: new PIXI.Sprite(PIXI.loader.resources[getPath("car2")].texture),

    up: new PIXI.Sprite(PIXI.loader.resources[getPath("up")].texture),
    down: new PIXI.Sprite(PIXI.loader.resources[getPath("down")].texture),
    left: new PIXI.Sprite(PIXI.loader.resources[getPath("left")].texture),
    right: new PIXI.Sprite(PIXI.loader.resources[getPath("right")].texture),
    blinkLeft: new PIXI.Sprite(PIXI.loader.resources[getPath("blinkLeft")].texture),
    blinkRight: new PIXI.Sprite(PIXI.loader.resources[getPath("blinkRight")].texture),
  }

  // init some positions
  sprites.playerCar.y = 400
  sprites.circle.y = 280

  sprites.left.x = 25
  sprites.left.y = 520
  sprites.blinkLeft.x = 25
  sprites.blinkLeft.y = 420
  sprites.right.x = 255
  sprites.right.y = 520
  sprites.blinkRight.x = 255
  sprites.blinkRight.y = 420
  sprites.up.x = 140
  sprites.up.y = 360
  sprites.down.x = 140
  sprites.down.y = 470

  // add sprites
  for(var s in sprites) {
    app.stage.addChild(sprites[s])
  }

  // interractions
  const actions = {
    up: false,
    down: false,
    left: false,
    right: false,
    blinkLeft: false,
    blinkRight: false,
  }

  sprites.up.interactive = true
  sprites.down.interactive = true
  sprites.left.interactive = true
  sprites.right.interactive = true
  sprites.blinkLeft.interactive = true
  sprites.blinkRight.interactive = true

  sprites.up.on('pointerdown', () => {actions.up = true})
  sprites.up.on('pointerup', () => {actions.up = false})
    sprites.up.on('pointerupoutside', () => {actions.up = false})
  sprites.down.on('pointerdown', () => {actions.down = true})
  sprites.down.on('pointerup', () => {actions.down = false})
    sprites.down.on('pointerupoutside', () => {actions.down = false})
  sprites.left.on('pointerdown', () => {actions.left = true})
  sprites.left.on('pointerup', () => {actions.left = false})
    sprites.left.on('pointerupoutside', () => {actions.left = false})
  sprites.right.on('pointerdown', () => {actions.right = true})
  sprites.right.on('pointerup', () => {actions.right = false})
    sprites.right.on('pointerupoutside', () => {actions.right = false})

  sprites.blinkLeft.on('pointerdown', () => {actions.blinkLeft = !actions.blinkLeft})
  sprites.blinkRight.on('pointerdown', () => {actions.blinkRight = !actions.blinkLeft})

  // starts game loop
  app.ticker.add(delta => {

    // GAME LOOP

    // UPDATE DATA
    let turn = data.turn
    let base = 0.02 * delta
    if(actions.left && !actions.right) turn -= base
    else if(!actions.left && actions.right) turn += base
    else if(turn > 0) turn -= 3 * base * delta
    else if(turn < 0) turn += 3 * base * delta
    if(!actions.left && !actions.right && Math.abs(turn) <= 0.2) turn = 0
    
    let speed = data.speed
    base = 0.3 * delta
    if(actions.down && !actions.up) speed -= base
    else if(!actions.down && actions.up) speed += base
    if(speed < 0) speed = 0
    if(speed > 30) speed = 30

    data = {
      ... data,
      frame: (data.frame + 1),
      roadPosition: (data.roadPosition + delta * data.speed)%1280,
      playerCarX: data.playerCarX + turn * 5 * delta,
      turn,
      speed,
    }

    // RENDER
    
    // lines
    sprites.road1.y = data.roadPosition
    sprites.road2.y = data.roadPosition - 1280

    // playerCar
    sprites.playerCar.x = data.playerCarX
    sprites.circle.x = data.playerCarX - 20

  });
})