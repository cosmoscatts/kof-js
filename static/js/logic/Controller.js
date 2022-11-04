export class Controller {
  constructor($canvas) {
    this.$canvas = $canvas

    this.pressedKeys = new Set()
    this.start()
  }

  start() {
    const outer = this
    this.$canvas.keydown((e) => {
      outer.pressedKeys.add(e.key)
    })

    this.$canvas.keyup((e) => {
      outer.pressedKeys.delete(e.key)
    })
  }
}
