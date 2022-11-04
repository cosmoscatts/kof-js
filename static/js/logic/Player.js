import { GameObject } from './index.js'

export class Player extends GameObject {
  constructor(root, info) {
    super()

    this.root = root

    const { id, x, y, width, height, color } = info
    this.id = id
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color

    this.direction = 1

    this.vx = 0 
    this.vy = 0 

    this.speedx = 400 // 水平方向速度
    this.speedy = -1000 // 跳起的初始速度

    this.gravity = 50 // 重力

    this.ctx = this.root.gameMap.ctx
    this.pressedKeys = this.root.gameMap.controller.pressedKeys

    this.status = 3 // 0: idle; 1: 向前; 2: 向后; 3: 跳跃; 4: 攻击; 5: 被打; 6: 死亡;
    this.animations = new Map()

    this.frameCurrentCnt = 0
  }

  start() {

  }

  updateMove() {
    if (this.status === 3) {
      this.vy += this.gravity
    }

    this.x += this.vx * this.timeDelta / 1000
    this.y += this.vy * this.timeDelta / 1000

    if (this.y > 450) {
      this.y = 450
      this.vy = 0
      this.status = 0
    }

    if (this.x < 0) {
      this.x = 0
    } else if (this.x + this.width > this.root.gameMap.$canvas.width()) {
      this.x = this.root.gameMap.$canvas.width() - this.width
    }
  }

  updateControl() {
    let w, a, d, space
    if (this.id === 0) {
      w = this.pressedKeys.has('w')
      a = this.pressedKeys.has('a')
      d = this.pressedKeys.has('d')
      space = this.pressedKeys.has(' ')
    } else {
      w = this.pressedKeys.has('ArrowUp')
      a = this.pressedKeys.has('ArrowLeft')
      d = this.pressedKeys.has('ArrowRight')
      space = this.pressedKeys.has('Enter')
    }

    if ([0, 1].includes(this.status)) {
      if (w) {
        if (d) {
          this.vx = this.speedx
        } else if (a) {
          this.vx = -this.speedx
        } else {
          this.vx = 0
        }
        this.vy = this.speedy
        this.status = 3
      } else if (d) {
        this.vx = this.speedx
        this.status = 1
      } else if (a) {
        this.vx = -this.speedx
        this.status = 1
      } else {
        this.vx = 0
        this.status = 0
      }
    }
  }

  update() {
    this.updateControl()
    this.updateMove()
    this.render()
  }

  render() {
    let status = this.status

    if (status === 1 && this.direction * this.vx < 0) {
      status = 2
    }

    const obj = this.animations.get(status)
    if (obj?.loaded) {
      const k = parseInt(this.frameCurrentCnt / obj.frameRate) % obj.frameCnt
      const image = obj.gif.frames[k].image
      this.ctx.drawImage(image, this.x, this.y + obj.offsetY, image.width * obj.scale, image.height * obj.scale)
    }

    this.frameCurrentCnt++
  }
}
