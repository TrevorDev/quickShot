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
  xMouseVal = 0;
  yMouseVal = 0;
  move(){
    var mouoseSpd = 1/500
    //move mouse and limit verticle rotation
    var xChange =  this.xMouseVal - this.controller.getValue("rotX")* mouoseSpd;
    this.xMouseVal = this.controller.getValue("rotX")* mouoseSpd
    var yChange = this.yMouseVal - this.controller.getValue("rotY")* mouoseSpd
    this.yMouseVal = this.controller.getValue("rotY")* mouoseSpd
    this.body.rotation.x -= yChange
    if(this.body.rotation.x  > Math.PI/2 - 0.1){
      this.body.rotation.x = Math.PI/2 - 0.1
    }else if(this.body.rotation.x  < -Math.PI/2 + 0.1){
      this.body.rotation.x = -Math.PI/2 + 0.1
    }
    this.body.rotation.y += xChange

    //gravity
    this.spd.y -= 0.2

    //key input
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

    //colliison with objects
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
        // friction
        this.spd = this.spd.multiplyScalar(0.3)
      }
    }while(intersects.length > 0)


    this.body.position.add(this.spd)
  }
}

export default Character
