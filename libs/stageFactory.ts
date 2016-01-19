import THREE = require("three")
import Stage from "../objects/stage"
import passShaders from "../libs/passShaders";
let EffectComposer = require('three-effectcomposer')(THREE)

export default {
  create: function(container){
    var ret = new Stage();
    ret.camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 35000 );
  	ret.camera.position.z = 2750;

    ret.scene = new THREE.Scene();
  	ret.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    ret.renderer = new THREE.WebGLRenderer( { antialias: false } );
  	ret.renderer.setClearColor( ret.scene.fog.color );
  	ret.renderer.setPixelRatio( window.devicePixelRatio );
  	ret.renderer.setSize( window.innerWidth, window.innerHeight );

    ret.composer = new EffectComposer(ret.renderer);
    ret.composer.addPass(new EffectComposer.RenderPass(ret.scene, ret.camera))

    var effect = new EffectComposer.ShaderPass( passShaders.default );
    effect.renderToScreen = true;
    ret.composer.addPass(effect)

    container.appendChild( ret.renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {

    	ret.camera.aspect = window.innerWidth / window.innerHeight;
    	ret.camera.updateProjectionMatrix();

    	ret.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    return ret;
  }
}
