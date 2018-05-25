let app = new PIXI.Application({width: 360, height: 640, antialias: true});
document.body.appendChild(app.view);

// load sprites
const getPath = (a) => 'images/' + a + ".png"
let images = ["car", "carBlinkLeft", "carBlinkRight","car2", "car3", "circle", "road", "up", "down", "left", "right", "blinkLeft", "blinkRight", "blinkLeftOn", "blinkRightOn", "kmBackground", "speedLimit"]

let data = {
  blinkFrame: 0,
  roadPosition: 0,
  speed: 20,
  playerCarX: 360/2 -60/2,
  turn: 0,
  car1: {x: 35, y: -125, speed: Math.random()*5 + 18},
  car2: {x: 300, y: 800, speed: 15},
}

let loader = PIXI.loader.add(images.map(getPath)).load(() => {
  let textures = {
    car: PIXI.loader.resources[getPath("car")].texture,
    car2: PIXI.loader.resources[getPath("car2")].texture,
    car3: PIXI.loader.resources[getPath("car3")].texture,
    carBlinkLeft: PIXI.loader.resources[getPath("carBlinkLeft")].texture,
    carBlinkRight: PIXI.loader.resources[getPath("carBlinkRight")].texture,
    road: PIXI.loader.resources[getPath("road")].texture,
    circle: PIXI.loader.resources[getPath("circle")].texture,
    kmBackground: PIXI.loader.resources[getPath("kmBackground")].texture,
    speedLimit: PIXI.loader.resources[getPath("speedLimit")].texture,

    up: PIXI.loader.resources[getPath("up")].texture,
    down: PIXI.loader.resources[getPath("down")].texture,
    left: PIXI.loader.resources[getPath("left")].texture,
    right: PIXI.loader.resources[getPath("right")].texture,
    blinkLeft: PIXI.loader.resources[getPath("blinkLeft")].texture,
    blinkLeftOn: PIXI.loader.resources[getPath("blinkLeftOn")].texture,
    blinkRight: PIXI.loader.resources[getPath("blinkRight")].texture,
    blinkRightOn: PIXI.loader.resources[getPath("blinkRightOn")].texture,
  }

  let sprites = {
    road1: new PIXI.Sprite(textures.road),
    road2: new PIXI.Sprite(textures.road),

    playerCar: new PIXI.Sprite(textures.car),
    circle: new PIXI.Sprite(textures.circle),

    car1: new PIXI.Sprite(textures.car2),
    car2: new PIXI.Sprite(textures.car3),

    up: new PIXI.Sprite(textures.up),
    down: new PIXI.Sprite(textures.down),
    left: new PIXI.Sprite(textures.left),
    right: new PIXI.Sprite(textures.right),
    blinkLeft: new PIXI.Sprite(textures.blinkLeft),
    blinkRight: new PIXI.Sprite(textures.blinkRight),

    kmBackground: new PIXI.Sprite(textures.kmBackground),
    speedLimit: new PIXI.Sprite(textures.speedLimit),
  }

  let texts = {
    kms: new PIXI.Text('50')
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

  sprites.speedLimit.x = 300
  sprites.speedLimit.y = 10
  sprites.kmBackground.x = 300
  sprites.kmBackground.y = 70

  texts.kms.x = 311
  texts.kms.y = 79

  // add sprites
  for(var s in sprites) {
    app.stage.addChild(sprites[s])
  }
  for(var s in texts) {
    app.stage.addChild(texts[s])
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

  sprites.blinkLeft.on('pointerdown', () => {
    actions.blinkLeft = !actions.blinkLeft;
    actions.blinkRight = false
    data.blinkFrame = 0
  })
  sprites.blinkRight.on('pointerdown', () => {
    actions.blinkRight = !actions.blinkRight; 
    actions.blinkLeft = false
    data.blinkFrame = 0
  })

  // starts game loop
  app.ticker.add(delta => {
    /* UPDATE DATA */

    // turn & speed
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
    if(speed < 4) speed = 4
    if(speed > 33) speed = 33

    // cars
    const car1 = {
      ... data.car1,
      y: data.car1.y - data.car1.speed + speed
    }
    const car2 = {
      ... data.car2,
      y: data.car2.y - data.car2.speed + speed
    }
    
    if(car1.y > 1000 || car1.y < -125) {
      car1.y = -125
      do{
        car1.x = Math.floor(Math.random()*3) * 115 + 35
      } while(car1.x == car2.x)
      car1.speed = Math.random()*5 + 18
    } 
    if(car2.y > 1000 || car2.y < -125) {
      car2.y = -125
      do{
        car2.x = Math.floor(Math.random()*3) * 115 + 35
      } while(car1.x == car2.x)
      car2.speed = Math.random()*5 + 18
    }

    data = {
      ... data,
      blinkFrame: data.blinkFrame + 1,
      roadPosition: (data.roadPosition + delta * data.speed)%1280,
      playerCarX: data.playerCarX + turn * 5 * delta,
      car1,
      car2,
      turn,
      speed,
    }

    /* RENDER */
    
    // lines
    sprites.road1.y = data.roadPosition
    sprites.road2.y = data.roadPosition - 1280

    // playerCar
    sprites.playerCar.x = data.playerCarX
    sprites.circle.x = data.playerCarX - 20
    
    if(actions.blinkLeft && Math.floor(data.blinkFrame/20) % 2 == 0) {
      sprites.playerCar.setTexture(textures.carBlinkLeft)
      sprites.blinkLeft.setTexture(textures.blinkLeftOn)
    }
    else if(actions.blinkRight && Math.floor(data.blinkFrame/20) % 2 == 0) {
      sprites.playerCar.setTexture(textures.carBlinkRight)
      sprites.blinkRight.setTexture(textures.blinkRightOn)
    }
    else {
      sprites.playerCar.setTexture(textures.car)
      sprites.blinkLeft.setTexture(textures.blinkLeft)
      sprites.blinkRight.setTexture(textures.blinkRight)
    }

    // cars
    sprites.car1.x = data.car1.x
    sprites.car1.y = data.car1.y
    sprites.car2.x = data.car2.x
    sprites.car2.y = data.car2.y

    // text
    texts.kms.setText(Math.round(speed*3))

  });
})