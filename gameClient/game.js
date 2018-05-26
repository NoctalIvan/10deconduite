let app = new PIXI.Application({width: 360, height: 640, antialias: true});
document.body.appendChild(app.view);

// load sprites
const getPath = (a) => 'images/' + a + ".png"
let images = ["car", "carBlinkLeft", "carBlinkRight","car2", "car3", "road", "up", "down", "left", "right", "blinkLeft", "blinkRight", "blinkLeftOn", "blinkRightOn", "kmBackground", "speedLimit"]

let data = {
  blinkFrame: 0,
  roadPosition: 0,
  speed: 20,
  playerCarX: 360/2 -60/2,
  turn: 0,
  car1: {x: 35, y: -125, speed: Math.random()*5 + 18},
  car2: {x: 300, y: 800, speed: 15},
  score: 100,
  timer: 60,

  scoreData: {
    accBande: 0,
    noBlink: 0,
    uselessBlink: 0,
    strongBreak: 0,
  },
  warnings: [],
}
setInterval(() => {
  data.timer --
  if(data.timer == 0) {
    end()
  }
}, 1000)

const niceWarning = {
  accBande: "bande blanche",
  lowSpeed: "vitesse insuffisante",
  highSpeed: "vitesse trop élevée",
  noBlink: "clignottants manquants",
  uselessBlink: "clignottants obsolètes",
  strongTurn: "virage trop serré",
  strongBreak: "freinage trop fort",
  zone: "distances de sécurité",
  route: "hors route",
}

let ended = false
const end = () => {
  console.log("end")
  localStorage.setItem('score', JSON.stringify(data))
  // location.href = '/result'
}

let loader = PIXI.loader.add(images.map(getPath)).load(() => {
  let textures = {
    car: PIXI.loader.resources[getPath("car")].texture,
    car2: PIXI.loader.resources[getPath("car2")].texture,
    car3: PIXI.loader.resources[getPath("car3")].texture,
    carBlinkLeft: PIXI.loader.resources[getPath("carBlinkLeft")].texture,
    carBlinkRight: PIXI.loader.resources[getPath("carBlinkRight")].texture,
    road: PIXI.loader.resources[getPath("road")].texture,
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
    kms: new PIXI.Text('50'),
    score: new PIXI.Text('100/100'),
    timer: new PIXI.Text('45s'),

    warning1: new PIXI.Text(''),
    warning2: new PIXI.Text(''),
    warning3: new PIXI.Text(''),
  }

  // init some positions
  sprites.playerCar.y = 400

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

  sprites.left.alpha = 0.2
  sprites.right.alpha = 0.2
  sprites.up.alpha = 0.2
  sprites.down.alpha = 0.2
  sprites.blinkLeft.alpha = 0.2
  sprites.blinkRight.alpha = 0.2

  sprites.speedLimit.x = 300
  sprites.speedLimit.y = 10
  sprites.kmBackground.x = 300
  sprites.kmBackground.y = 70

  texts.kms.x = 311
  texts.kms.y = 79
  texts.score.x = 0
  texts.score.y = 0
  texts.timer.x = 0
  texts.timer.y = 25

  texts.warning1.y = 60
  texts.warning2.y = 85
  texts.warning3.y = 110

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
    if(ended) return
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

    /* score */
    let score = data.score
    let warnings = []

    // bandes
    if(data.playerCarX > 55 && data.playerCarX < 135 || data.playerCarX > 165 && data.playerCarX < 245){
      data.scoreData.accBande ++
    } else {
      data.scoreData.accBande = 0
    }
    if(data.scoreData.accBande > 60) {
      warnings.push('accBande')
      score -= 0.1
    }

    // route
    if(data.playerCarX < 15 || data.playerCarX > 285){
      warnings.push('route')
      score -= 0.3
    }
    
    // vitesse
    if(data.speed < 20) {
      score -= 0.05
      warnings.push('lowSpeed')
    }
    else if(data.speed > 25){
      score -= 0.1
      warnings.push('highSpeed')      
    }

    // blinkers
    if(actions.left && !actions.blinkLeft || actions.right && !actions.blinkRight) {
      data.scoreData.noBlink ++
    } else {
      data.scoreData.noBlink = 0
    }
    if(data.scoreData.noBlink > 20) {
      warnings.push('noBlink')
      score -= 0.5
    }

    if(!actions.left && actions.blinkLeft || !actions.right && actions.blinkRight) {
      data.scoreData.uselessBlink ++
    } else {
      data.scoreData.uselessBlink = 0
    }
    if(data.scoreData.uselessBlink > 120) {
      warnings.push('uselessBlink')
      score -= 0.1
    }

    // strong turns
    if(Math.abs(turn) > 1) {
      warnings.push('strongTurn')
      score -= 0.3
    }

    // strong break
    if(actions.down) {
      data.scoreData.strongBreak ++
    } else {
      data.scoreData.strongBreak = 0
    }
    if(data.scoreData.strongBreak > 20) {
      warnings.push('strongBreak')
      score -= 0.1
    }

    // distance (120 * 420 around) - car = 60 * 120
    const zone = {
      minX: data.playerCarX,
      maxX: data.playerCarX + 60,
      minY: 400 - 100,
      maxY: 400 + 120 + 50,
    }
    const player = {
      minX: data.playerCarX,
      maxX: data.playerCarX + 60,
      minY: 400,
      maxY: 400 + 120,
    }
    const c1 = {
      minX: data.car1.x,
      maxX: data.car1.x + 60,
      minY: data.car1.y,
      maxY: data.car1.y + 120,
    }
    const c2 = {
      minX: data.car2.x,
      maxX: data.car2.x + 60,
      minY: data.car2.y,
      maxY: data.car2.y + 120,
    }

    if(c1.maxX > zone.minX && c1.minX < zone.maxX && c1.maxY > zone.minY && c1.minY < zone.maxY ||
      c2.maxX > zone.minX && c2.minX < zone.maxX && c2.maxY > zone.minY && c2.minY < zone.maxY){
      score -= 0.1
      warnings.push('zone')
    }

    // collision
    if(c1.maxX > player.minX && c1.minX < player.maxX && c1.maxY > player.minY && c1.minY < player.maxY ||
      c2.maxX > player.minX && c2.minX < player.maxX && c2.maxY > player.minY && c2.minY < player.maxY){
      end()
    }

    data = {
      ... data,
      score,
      warnings,
      blinkFrame: data.blinkFrame + 1,
      roadPosition: (data.roadPosition + delta * data.speed)%1280,
      playerCarX: data.playerCarX + turn * 5 * delta,
      car1,
      car2,
      turn,
      speed,
    }
    if(data.playerCarX < 0) {
      data.playerCarX = 0
      turn = 0
    }
    if(data.playerCarX > 360 - 60) {
      data.playerCarX = 360-60
      turn = 0
    }

    /* RENDER */
    
    // lines
    sprites.road1.y = data.roadPosition
    sprites.road2.y = data.roadPosition - 1280

    // playerCar
    sprites.playerCar.x = data.playerCarX
    
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

    // buttons
    sprites.up.alpha = actions.up ? 1 : 0.2
    sprites.down.alpha = actions.down ? 1 : 0.2
    sprites.left.alpha = actions.left ? 1 : 0.2
    sprites.right.alpha = actions.right ? 1 : 0.2

    // text
    texts.kms.setText(Math.round(speed*3))
    texts.score.setText(Math.floor(data.score)/10 + "/10")
    texts.timer.setText(data.timer + "s")

    texts.warning1.setText(warnings[0] ? niceWarning[warnings[0]] : '')
    texts.warning2.setText(warnings[1] ? niceWarning[warnings[1]] : '')
    texts.warning3.setText(warnings[2] ? niceWarning[warnings[2]] : '')

    if(score < 0) end()
  });
})