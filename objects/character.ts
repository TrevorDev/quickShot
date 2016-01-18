import THREE = require("three")
import materials from "../libs/materials"
import Controller from "../objects/controller"

class Character {
  body:THREE.Mesh
  spd:THREE.Vector3
  view:THREE.Vector3 = new THREE.Vector3(0,0,0)
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
        ret.x += Math.sin(this.view.y) * Math.cos(this.view.x)
        ret.z += Math.cos(this.view.y) * Math.cos(this.view.x)
        ret.y += Math.sin(this.view.x)
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
    this.view.x -= yChange
    if(this.view.x  > Math.PI/2 - 0.1){
      this.view.x = Math.PI/2 - 0.1
    }else if(this.view.x  < -Math.PI/2 + 0.1){
      this.view.x = -Math.PI/2 + 0.1
    }
    this.view.y += xChange

    //gravity
    this.spd.y -= 0.2

    //key input
    var walkDir = new THREE.Vector3()
    if(this.controller.isDown("up")){
      walkDir.x -= Math.sin(this.view.y) * this.moveAcc
      walkDir.z -= Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("down")){
      walkDir.x += Math.sin(this.view.y) * this.moveAcc
      walkDir.z += Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("right")){
      walkDir.z -= Math.sin(this.view.y) * this.moveAcc
      walkDir.x += Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("left")){
      walkDir.z += Math.sin(this.view.y) * this.moveAcc
      walkDir.x -= Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("jump")){
      this.spd.y = 5
    }

    //colliison with objects
    this.spd.add(walkDir)
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
        this.spd.projectOnPlane(closest.face.normal)

        // friction
        let walkPlane = walkDir.clone().projectOnPlane(closest.face.normal)
        let noFric = this.spd.clone().projectOnVector(walkPlane)
        let applyFric = this.spd.clone().sub(noFric)
        this.spd.copy(noFric.clone().add(applyFric.multiplyScalar(0.9)))
      }
    }while(intersects.length > 0)


    this.body.position.add(this.spd)
    this.body.rotation.y = this.view.y
    if(this.body.position.y < -1000){
      this.body.position.copy(new THREE.Vector3(0,0,0))
      this.spd.copy(new THREE.Vector3(0,0,0))
    }
  }
}

export default Character
