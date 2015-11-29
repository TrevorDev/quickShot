import THREE = require("three")
import materials from "../../../libs/materials"
import stageFactory from "../../../libs/stageFactory"

//setup
var container = document.getElementById('container');
var stage = stageFactory.create(container);

//meshes
var sphere = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 16), materials.toon);
stage.scene.add(sphere);

var floor = new THREE.Mesh(new THREE.BoxGeometry(1000, 10, 3000), materials.toon);
stage.scene.add(floor);

//lighting
var ambiant = new THREE.AmbientLight(0xFFFFFF);
stage.scene.add(ambiant);

var light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
light.position.set( 0, 1000, 0 );
stage.scene.add( light );

stage.startRender(()=>{
	stage.camera.position.y++;
	light.position.x++;
	//floor.rotateX(0.01)
})
