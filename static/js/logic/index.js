const GAME_OBJECTS = []

export class GameObject {
  constructor() {
    GAME_OBJECTS.push(this)

    this.timeDelta = 0
    this.hasCalledStart = false
  }

  start() {

  }

  update() {

  }

  destory() {
    for (let i in GAME_OBJECTS) {
      const obj = GAME_OBJECTS[i]
      if (obj === this) {
        GAME_OBJECTS.splice(i, 1)
      }
    }
  }
}

let lastTimestamp = 0

const step = (timestamp) => {
  for (const obj of GAME_OBJECTS) {
    if (!obj.hasCalledStart) {
        obj.start()
        obj.hasCalledStart = true
    } else {
        obj.timeDelta = timestamp - lastTimestamp
        obj.update()
    }
  }
  lastTimestamp = timestamp
  requestAnimationFrame(step)
}

requestAnimationFrame(step)
