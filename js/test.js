const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine

function makeScene() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("thecam", 0, 0, 10, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);
    camera.inertia = 0.1;
    camera.panningInertia = 0.1;
    camera.inputs.attached.pointers.angularSensibilityX = 200;
    camera.inputs.attached.pointers.angularSensibilityY = 200;
    camera.inputs.attached.pointers.panningSensibility = 70;
    camera.inputs.attached.pointers.buttons[0] = null;

    gizmoman = new BABYLON.GizmoManager(scene);
    gizmoman.usePointerToAttachGizmos = false;
    gizmoman.positionGizmoEnabled = true;
    gizmoman.attachableMeshes = [];
    gizmoman.onAttachedToMeshObservable.add((mesh) => {
        console.log(mesh.name);
    });

    ground = createViewportGrid(scene);

    highlight = new BABYLON.HighlightLayer("hl1", scene);
    highlight.addExcludedMesh(ground);
    highlight_blur = .4;
    highlight.blurHorizontalSize = highlight_blur;
    highlight.blurVerticalSize = highlight_blur;
    highlight.innerGlow = false;
    highlight.disableBoundingBoxesFromEffectLayer = false;

    active_object = null;
    parent_point = new BABYLON.Mesh("muliselected_parent_point", scene);
    actionManager = new BABYLON.ActionManager(scene);
    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){
        // Unparent all meshes from parent point
        for(i in highlight._meshes){
            mesh = highlight._meshes[i].mesh;
            mesh.setParent(null);
        }
        if(ev.sourceEvent.shiftKey == false){
            // Reset all selections and add new selection
            highlight.removeAllMeshes();
            highlight.addMesh(ev.meshUnderPointer, BABYLON.Color3.Yellow());
            gizmoman.attachToMesh(ev.meshUnderPointer);
        }else{
            // Add new selection
            highlight.addMesh(ev.meshUnderPointer, BABYLON.Color3.Yellow());
            number_of_selected_objects = Object.keys(highlight._meshes).length;
            if(number_of_selected_objects > 1){
                // Get sum of all positions of all selected meshes
                mesh_positions = new BABYLON.Vector3();
                for(i in highlight._meshes){
                    mesh_positions.addInPlace(highlight._meshes[i].mesh.position);
                }
                divisor = new BABYLON.Vector3(
                    number_of_selected_objects,
                    number_of_selected_objects,
                    number_of_selected_objects
                );
                // Set parent point position to median of all mesh positions
                parent_point.position = mesh_positions.divide(divisor);
                // Parent all meshes to parent point
                for(i in highlight._meshes){
                    mesh = highlight._meshes[i].mesh;
                    mesh.setParent(parent_point);
                }
                gizmoman.attachToMesh(parent_point);
            }
        }
        active_object = ev.meshUnderPointer;
    }));

    const light = new BABYLON.DirectionalLight("thelight", new BABYLON.Vector3(-1,-1,0), scene);

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
            createCylinder();
        }
        if(object_slug == "point_light"){
            createPointLight();
        }
    });

    $("#gizmo_options_selectable").on("click", function(e){
        gizmo_type = e.target.dataset.gizmo_type;
        console.log(gizmo_type);
        if(gizmo_type  == "move"){
            gizmoman.positionGizmoEnabled = true;
            gizmoman.rotationGizmoEnabled = false;
            gizmoman.scaleGizmoEnabled = false;
        }
        if(gizmo_type  == "rotate"){
            gizmoman.positionGizmoEnabled = false;
            gizmoman.rotationGizmoEnabled = true;
            gizmoman.scaleGizmoEnabled = false;
        }
        if(gizmo_type  == "scale"){
            gizmoman.positionGizmoEnabled = false;
            gizmoman.rotationGizmoEnabled = false;
            gizmoman.scaleGizmoEnabled = true;
        }
    });

    $("#gizmo_options_selectable").selectable();
});

function createSphere() {
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
    gizmoman.attachableMeshes.push(sphere);
    sphere.actionManager = actionManager;
}

function createCube() {
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    gizmoman.attachableMeshes.push(box);
    box.actionManager = actionManager;
}

function createCylinder() {
    const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {}, scene);
    gizmoman.attachableMeshes.push(cylinder);
    cylinder.actionManager = actionManager;
}

function createPointLight() {
    const light_dummy = BABYLON.MeshBuilder.CreateSphere("point_light_dummy_mesh", {
        diameter: .3,
    }, scene);
    const light = new BABYLON.PointLight("point_light", new BABYLON.Vector3(0,0,0), scene);
    light.parent = light_dummy;
    gizmoman.attachableMeshes.push(light_dummy);
    light_dummy.actionManager = actionManager;
}

function createViewportGrid(scene) {
    var groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
	groundMaterial.majorUnitFrequency = 1;
	groundMaterial.minorUnitVisibility = 0.1;
	groundMaterial.gridRatio = 1;
	groundMaterial.backFaceCulling = false;
	groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	groundMaterial.opacity = 0.1;
	var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
	ground.material = groundMaterial;
    ground.isPickable = false;
    return ground;
}