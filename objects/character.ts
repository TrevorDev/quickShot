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

  getCameraLook(){
        var height = 50
        var ret = new THREE.Vector3()
        ret.copy(this.body.position)
        ret.y = this.body.position.y+height
        return ret
  }

  getCameraPos(){
        var height = 50
        var ret = this.getCameraLook();
        ret.x += Math.sin(this.body.rotation.y) * Math.cos(this.body.rotation.x)
        ret.z += Math.cos(this.body.rotation.y) * Math.cos(this.body.rotation.x)
        ret.y += Math.sin(this.body.rotation.x)
        var diff = ret.clone().sub(this.getCameraLook())
        return diff.multiplyScalar(1000).add(this.getCameraLook())
  }
  xMouseVal = 0;
  yMouseVal = 0;
  move(){
    var mouoseSpd = 1/700
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
    var walkDir = new THREE.Vector3()
    if(this.controller.isDown("up")){
      walkDir.x -= Math.sin(this.body.rotation.y) * this.moveAcc
      walkDir.z -= Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("down")){
      walkDir.x += Math.sin(this.body.rotation.y) * this.moveAcc
      walkDir.z += Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("right")){
      walkDir.z -= Math.sin(this.body.rotation.y) * this.moveAcc
      walkDir.x += Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("left")){
      walkDir.z += Math.sin(this.body.rotation.y) * this.moveAcc
      walkDir.x -= Math.cos(this.body.rotation.y) * this.moveAcc
    }
    if(this.controller.isDown("jump")){
      this.spd.y = 5
    }

    //colliison with objects
    this.spd = this.spd.add(walkDir)
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
        //var purpWalkDir = new THREE.Vector3(walkDir.z, 0, -walkDir.x)
        this.spd = this.spd.multiplyScalar(0.3)
        //this.spd.projectOnVector(walkDir)
      }
    }while(intersects.length > 0)


    this.body.position.add(this.spd)
  }
}

export default Character
