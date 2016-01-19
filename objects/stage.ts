import THREE = require("three")
import materials from "../libs/materials"

class Stage {
  scene:THREE.Scene;
  camera:THREE.PerspectiveCamera;
  renderer:THREE.WebGLRenderer;
  depthRenderTarget: THREE.WebGLRenderTarget
  composer:any;
  constructor(){

  }

  startRender(renderLoop){
    var render = ()=>{
      this.scene.overrideMaterial = materials.depth;
			this.renderer.render( this.scene, this.camera, this.depthRenderTarget, true );
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
