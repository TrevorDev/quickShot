import THREE = require("three")
import materials from "../libs/materials"
class Player {
  body:THREE.Mesh
  constructor(){
    this.body = new THREE.Mesh(new THREE.BoxGeometry(1000, 10, 3000), materials.toon);
  }

  move(){
    
  }
}

export default Player
