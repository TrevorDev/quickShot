import "babel-polyfill"
import THREE = require("three")
import materials from "../../../libs/materials"
import stageFactory from "../../../libs/stageFactory"
import worldLoader from "../../../libs/worldLoader"
import Controller from "../../../objects/controller"
import Player from "../../../objects/character"

var main = async ()=>{
	//setup
	var container = document.getElementById('container');
	var stage = stageFactory.create(container);

	//meshes
	// var sphere = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 16), materials.toon);
	// sphere.position.z +=600;
	// stage.scene.add(sphere);
	//
	// var floor = new THREE.Mesh(new THREE.BoxGeometry(1000, 10, 3000), materials.toon);
	// stage.scene.add(floor);

	var map = (await worldLoader.load("/public/models/world1.obj"));
	stage.scene.add(map);

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
	var player = new Player(controller, [map]);
	player.body.position.y = 200;
	stage.scene.add(player.body)

	stage.startRender(()=>{
		//console.log(controller.getValue("rotX"))

		light.position.copy(player.body.position);
		light.position.y+=200;
		player.move();
		stage.camera.position.copy(player.getCameraPos())
		stage.camera.lookAt(player.getCameraLook())
		//sphere.rotateX(0.03)
		//floor.rotateX(0.01)
	})
}
main();
