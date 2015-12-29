import THREE = require("three")
import materials from "../libs/materials"
import Controller from "../objects/controller"

class Character {
  body:THREE.Mesh
  spd:THREE.Vector3
  moveAcc = 0.1;
  constructor(public controller:Controller, public collisionObjects:Array<THREE.Object3D>){
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
        var ret = this.getCameraPos();
        ret.x += Math.sin(this.body.rotation.y) * Math.cos(this.body.rotation.x)
        ret.z += Math.cos(this.body.rotation.y) * Math.cos(this.body.rotation.x)
        ret.y -= Math.sin(this.body.rotation.x)
        return ret.multiplyScalar(1);
  }

  move(){
    var mouoseSpd = 1/500
    this.body.rotation.x = this.controller.getValue("rotY")* mouoseSpd
    this.body.rotation.y = -this.controller.getValue("rotX")* mouoseSpd

    this.spd.y -= 0.2

    if(this.controller.isDown("up")){
      this.spd.x += Math.sin(this.body.rotation.y) * this.moveAcc
      this.spd.z += Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("down")){
      this.spd.x -= Math.sin(this.body.rotation.y) * this.moveAcc
      this.spd.z -= Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("right")){
      this.spd.z += Math.sin(this.body.rotation.y) * this.moveAcc
      this.spd.x -= Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("left")){
      this.spd.z -= Math.sin(this.body.rotation.y) * this.moveAcc
      this.spd.x += Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("jump")){
      this.spd.y = 5
    }


    do{
      var movement = new THREE.Raycaster(this.body.position, this.spd.clone().normalize(), 0, this.spd.length())
      var intersects = movement.intersectObjects(this.collisionObjects, true)
      if(intersects.length > 0){
        var closest = intersects.reduce((prev, cur)=>{
          if(prev == null){
            return cur;
          }
          return cur.distance < prev.distance ? cur : prev
        })
        this.spd.copy(this.spd.projectOnPlane(closest.face.normal))
      }
    }while(intersects.length > 0)



    this.body.position.add(this.spd)
  }
}

export default Character
