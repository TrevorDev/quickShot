import THREE = require("three")
import materials from "../libs/materials"
import Controller from "../objects/controller"

class Character {
  body:THREE.Mesh
  spd:THREE.Vector3
  moveAcc = 0.1;
  constructor(public controller:Controller){
    this.body = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), materials.toon);
    this.spd = new THREE.Vector3(0,0,0)
  }

  getCameraPos(){
        var height = 50
        var ret = new THREE.Vector3()
        ret.copy(this.body.position)
        ret.y = this.body.position.y+height
        return ret
  }

  getCameraLook(){
        var height = 50
        var ret = new THREE.Vector3()
        ret.copy(this.body.position)
        //console.log()
        ret.x += Math.sin(this.body.rotation.y) * Math.cos(this.body.rotation.x)
        ret.z += Math.cos(this.body.rotation.y) * Math.cos(this.body.rotation.x)
        ret.y = this.body.position.y+height - Math.sin(this.body.rotation.x)
        return ret
  }

  move(){
    this.body.rotation.x = this.controller.getValue("rotY")/1000
    this.body.rotation.y = -this.controller.getValue("rotX")/1000

    if(this.controller.isDown("up")){
      this.spd.x += Math.sin(this.body.rotation.y) * this.moveAcc
      this.spd.z += Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("down")){
      this.spd.x -= Math.sin(this.body.rotation.y) * this.moveAcc
      this.spd.z -= Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("left")){
      this.body.rotation.y+=0.05;
    }
    if(this.controller.isDown("right")){
      this.body.rotation.y-=0.05;
    }

    this.body.position.add(this.spd)
  }
}

export default Character