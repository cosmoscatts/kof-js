import { GameMap } from './logic/GameMap.js'
import { Kyo } from './logic/kyo.js'

export class KOF {
  constructor(id) {
    this.$kof = $(`#${id}`)
    
    this.gameMap = new GameMap(this)
    this.players = [
      new Kyo(
        this,
        {
          id: 0,
          x: 200, 
          y: 0,
          width: 120,
          height: 200,
          color: 'blue',
        }
      ),
      new Kyo(
        this,
        {
          id: 1,
          x: 900, 
          y: 0,
          width: 120,
          height: 200,
          color: 'red',
        }
      ),
    ]
  }
}
