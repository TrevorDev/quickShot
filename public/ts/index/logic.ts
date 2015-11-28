import THREE = require("three")


var container;
var camera, scene, renderer;

var mesh;

init();
animate();

function init() {

	container = document.getElementById( 'container' );

	//

	camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
	camera.position.z = 2750;

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );


	window.addEventListener( 'resize', onWindowResize, false );


  var mesh = new THREE.Mesh( new THREE.SphereGeometry( 70, 32, 16 ), new THREE.ShaderMaterial( {
  lights: true,
	uniforms: {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },

    //light uniforms populated from lights
    ambientLightColor : { type: "fv", value: [] },

		directionalLightDirection : { type: "fv", value: [] },
		directionalLightColor : { type: "fv", value: [] },

		hemisphereLightDirection : { type: "fv", value: [] },
		hemisphereLightSkyColor : { type: "fv", value: [] },
		hemisphereLightGroundColor : { type: "fv", value: [] },

		pointLightColor : { type: "fv", value: [] },
		pointLightPosition : { type: "fv", value: [] },
		pointLightDistance : { type: "fv1", value: [] },
		pointLightDecay : { type: "fv1", value: [] },

		spotLightColor : { type: "fv", value: [] },
		spotLightPosition : { type: "fv", value: [] },
		spotLightDirection : { type: "fv", value: [] },
		spotLightDistance : { type: "fv1", value: [] },
		spotLightAngleCos : { type: "fv1", value: [] },
		spotLightExponent : { type: "fv1", value: [] },
		spotLightDecay : { type: "fv1", value: [] }
	},
	vertexShader: `
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
	fragmentShader: `
  void main() {
    gl_FragColor = vec4 (0.2, 0.2, 0.5, 1.0);
  }
  `

} ) );
  scene.add( mesh );
  //scene.add( new THREE.AmbientLight( 0x777777 ) );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
				requestAnimationFrame( animate );
				render();
}

function render() {
  renderer.render( scene, camera );
}
