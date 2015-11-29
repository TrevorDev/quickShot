import THREE = require("three")
class Stage {
  scene:THREE.Scene;
  camera:THREE.PerspectiveCamera;
  renderer:THREE.WebGLRenderer;
  constructor(){

  }

  startRender(renderLoop){
    var render = ()=>{
    	this.renderer.render( this.scene, this.camera );
    }

    var animate = ()=>{
			requestAnimationFrame( animate );
      renderLoop();
			render();
    }
    animate()
  }

}

export default Stage
