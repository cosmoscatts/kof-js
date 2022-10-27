const GAME_OBJECTS = []

export class GameObject {
  constructor() {
    GAME_OBJECTS.push(this)
    this.tiemDelta = 0
    this.hasCalledStart = false
  }

  start() {

  }

  update() {

  }

  destory() {
    for (let i in GAME_OBJECTS) {
  
    }
  }
}
