import THREE = require("three")

class Stage {
  scene:THREE.Scene;
  camera:THREE.PerspectiveCamera;
  renderer:THREE.WebGLRenderer;
  composer:any;
  constructor(){

  }

  startRender(renderLoop){
    var render = ()=>{
      this.composer.render()
      //this.renderer.render( this.scene, this.camera );
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
