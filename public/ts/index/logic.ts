import THREE = require("three")
import materials from "../../../libs/materials"
import stageFactory from "../../../libs/stageFactory"
import Controller from "../../../objects/controller"
import Player from "../../../objects/character"

//setup
var container = document.getElementById('container');
var stage = stageFactory.create(container);

//meshes
var sphere = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 16), materials.toon);
sphere.position.z +=600;
stage.scene.add(sphere);

var floor = new THREE.Mesh(new THREE.BoxGeometry(1000, 10, 3000), materials.toon);
stage.scene.add(floor);

//lighting
var ambiant = new THREE.AmbientLight(0xFFFFFF);
stage.scene.add(ambiant);

var light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
light.position.set( 0, 1000, 0 );
stage.scene.add( light );

//player
var controller = new Controller({
	up: "w",
	down: "s",
	left: "a",
	right: "d",
	jump: " ",
	rotX: "mouseX",
	rotY: "mouseY",
	click: "mouseLeft"
})
var player = new Player(controller, [floor, sphere]);
player.body.position.y = 200;
stage.scene.add(player.body)

stage.startRender(()=>{
	//console.log(controller.getValue("rotX"))

	light.position.x++;

	player.move();
	stage.camera.position.copy(player.getCameraPos())
	stage.camera.lookAt(player.getCameraLook())
	//sphere.rotateX(0.03)
	//floor.rotateX(0.01)
})
