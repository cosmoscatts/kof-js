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

    this.hp = 100
    this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`)
    this.$hp_div = this.$hp.find('div')
  }

  start() {

  }

  updateMove() {
    this.vy += this.gravity
    
    this.x += this.vx * this.timeDelta / 1000
    this.y += this.vy * this.timeDelta / 1000

    // 如果角色重叠，取消运动
    // let [a, b] = this.root.players
    // if (a !== this) [a, b] = [b, a]
    // const r1 = {
    //   x1: a.x,
    //   y1: a.y,
    //   x2: a.x + a.width,
    //   y2: a.y + a.height,
    // }
    // const r2 = {
    //   x1: b.x,
    //   y1: b.y,
    //   x2: b.x + b.width,
    //   y2: b.y + b.height,
    // }
    // if (this.isCollision(r1, r2)) {
    //   a.x -= this.vx * this.timeDelta / 1000 / 2
    //   a.y -= this.vy * this.timeDelta / 1000 / 2
    //   b.x += this.vx * this.timeDelta / 1000 / 2
    //   b.y += this.vy * this.timeDelta / 1000 / 2

    //   if (this.status === 3) this.status = 0
    // }

    if (this.y > 450) {
      this.y = 450
      this.vy = 0
      if (this.status === 3) {
        this.status = 0
      }
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
      if (space) {
        this.status = 4
        this.vx = 0
        this.frameCurrentCnt = 0
      } else if (w) {
        if (d) {
          this.vx = this.speedx
        } else if (a) {
          this.vx = -this.speedx
        } else {
          this.vx = 0
        }
        this.vy = this.speedy
        this.status = 3
        this.frameCurrentCnt = 0
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

  updateDirection() {
    if (this.status === 6) return

    const players = this.root.players
    if (players[0] && players[1]) {
      const me = this, you = players[1 - this.id]
      if (me.x < you.x) me.direction = 1
      else me.direction = -1
    }
  }

  update() {
    this.updateControl()
    this.updateMove()
    this.updateDirection()
    this.updateAttack()
    this.render()
  }

  updateAttack() {
    if (this.status === 4 && this.frameCurrentCnt === 18) {
      const me = this, you = this.root.players[1 - this.id]
      let r1
      if (this.direction > 0) {
        r1 = {
          x1: me.x + 120,
          y1: me.y + 40,
          x2: me.x + 120 + 100,
          y2: me.y + 40 + 20,
        }
      } else {
        r1 = {
          x1: me.x + me.width - 120 - 100,
          y1: me.y + 40,
          x2: me.x + me.width - 120 - 100 + 100,
          y2: me.y + 40 + 20,
        }
      }
      let r2 = {
        x1: you.x,
        y1: you.y,
        x2: you.x + you.width,
        y2: you.y + you.height,
      }
      if (this.isCollision(r1, r2)) {
        you.isAttack()
      }
    }
  }

  isAttack() {
    if (this.status === 6) return

    this.status = 5
    this.frameCurrentCnt = 0

    this.hp = Math.max(this.hp - 10, 0)

    this.$hp_div.animate({
      width: this.$hp.parent().width() * this.hp / 100
    }, 300)

    this.$hp.animate({
      width: this.$hp.parent().width() * this.hp / 100
    }, 600)

    if (this.hp <= 0) {
      this.status = 6
      this.frameCurrentCnt = 0
      this.vx = 0
    }
  }

  /**
   * 两个矩形是否碰撞
   */
  isCollision(r1, r2) {
    if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
      return false
    if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
      return false 
    return true   
  }

  render() {
    // this.ctx.fillStyle = 'blue'
    // this.ctx.fillRect(this.x, this.y, this.width, this.height)

    // if (this.direction > 0) {
    //   this.ctx.fillStyle = 'red'
    //   this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20)
    // } else {
    //   this.ctx.fillStyle = 'red'
    //   this.ctx.fillRect(this.x + this.width - 120 - 100, this.y + 40, 100, 20)
    // }
   

    let status = this.status

    if (status === 1 && this.direction * this.vx < 0) {
      status = 2
    }

    const obj = this.animations.get(status)
    if (obj?.loaded) {
      if (this.direction > 0) {
        const k = parseInt(this.frameCurrentCnt / obj.frameRate) % obj.frameCnt
        const image = obj.gif.frames[k].image
        this.ctx.drawImage(image, this.x, this.y + obj.offsetY, image.width * obj.scale, image.height * obj.scale)
      } else {
        this.ctx.save()
        this.ctx.scale(-1, 1)
        this.ctx.translate(-this.root.gameMap.$canvas.width(), 0)

        const k = parseInt(this.frameCurrentCnt / obj.frameRate) % obj.frameCnt
        const image = obj.gif.frames[k].image
        this.ctx.drawImage(image, this.root.gameMap.$canvas.width() - this.x - this.width, this.y + obj.offsetY, image.width * obj.scale, image.height * obj.scale)

        this.ctx.restore()
      }
    }

    if ([4, 5, 6].includes(this.status) && this.frameCurrentCnt === obj.frameRate * (obj.frameCnt - 1)) {
      if (this.status === 6) {
        this.frameCurrentCnt--
      } else {
        this.status = 0
      }
      
    }

    this.frameCurrentCnt++
  }
}
