const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

function makeScene() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("thecam", 0, 0, 10, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);
    theinputs = camera.inputs.attached;
    camera.inertia = 0.1;
    camera.panningInertia = 0.1;
    camera.inputs.attached.pointers.angularSensibilityX = 200;
    camera.inputs.attached.pointers.angularSensibilityY = 200;
    camera.inputs.attached.pointers.panningSensibility = 100;
    camera.inputs.attached.pointers.buttons[0] = null;
    console.log(camera);

    gizmoman = new BABYLON.GizmoManager(scene);
    gizmoman.positionGizmoEnabled = true;
    // gizmoman.rotationGizmoEnabled = true;
    // gizmoman.scaleGizmoEnabled = true;
    gizmoman.attachableMeshes = [];

    var groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
	groundMaterial.majorUnitFrequency = 1;
	groundMaterial.minorUnitVisibility = 0.1;
	groundMaterial.gridRatio = 2;
	groundMaterial.backFaceCulling = false;
	groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	groundMaterial.opacity = 0.2;
	
	var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
	ground.material = groundMaterial;

    const light = new BABYLON.HemisphericLight("thelight", new BABYLON.Vector3(0,0,0), scene);

    const plane = BABYLON.MeshBuilder.CreatePlane("theplane", {}, scene);
    plane.position = new BABYLON.Vector3(-3,0,0);

    const points = [
        new BABYLON.Vector3(2, 0, 0),
        new BABYLON.Vector3(2, 1, 1),
        new BABYLON.Vector3(2, 1, 0),
    ]

    const lines = BABYLON.MeshBuilder.CreateLines("theline", {
        points: points,
    }, scene);

    const mat = new BABYLON.StandardMaterial("themat", scene);
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.1);
    mat.emissiveColor = new BABYLON.Color3(0, 1, 0);

    return scene;
}

const scene = makeScene();
engine.runRenderLoop(() => {
    engine.resize();
    scene.render();
});

jQuery(document).ready(function($) {
    $(".add_object").on("click", function(e){
        object_slug = e.target.parentNode.dataset.object;
        if(object_slug == "sphere"){
            createSphere();
        }
        if(object_slug == "cube"){
            createCube();
        }
        if(object_slug == "cylinder"){
            createSphere();
        }
    });
});

function createSphere() {
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
    gizmoman.attachableMeshes.push(sphere);
}

function createCube() {
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    gizmoman.attachableMeshes.push(box);
}