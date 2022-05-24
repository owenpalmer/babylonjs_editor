class MyScene {
    constructor(canvas){
        this.gui = new GuiUpdate(this);
        this.engine = new BABYLON.Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine
        this.scene = new BABYLON.Scene(this.engine);
        this.default_camera();
        this.default_gizmo_manager();
        this.default_grid();
        this.default_selection_system();
        this.actionManager = new BABYLON.ActionManager(this.scene);
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.object_clicked.bind(this)));
        this.add_cube();
        this.engine.runRenderLoop(() => {
            this.gui.refresh_materials_list();
            this.engine.resize();
            this.scene.render();
        });
    }

    object_clicked(ev){
        // Unparent all meshes from parent point
        for(let i in this.highlight_layer._meshes){
            let mesh = this.highlight_layer._meshes[i].mesh;
            mesh.setParent(null);
        }
        if(ev.sourceEvent.shiftKey == false){
            // Reset all selections and add new selection
            this.highlight_layer.removeAllMeshes();
            this.highlight_layer.addMesh(ev.meshUnderPointer, BABYLON.Color3.Yellow());
            this.gizmo_manager.attachToMesh(ev.meshUnderPointer);
        }else{
            // Add new selection
            this.highlight_layer.addMesh(ev.meshUnderPointer, BABYLON.Color3.Yellow());
            let number_of_selected_objects = Object.keys(this.highlight_layer._meshes).length;
            if(number_of_selected_objects > 1){
                // Get sum of all positions of all selected meshes
                let mesh_positions = new BABYLON.Vector3();
                for(let i in this.highlight_layer._meshes){
                    mesh_positions.addInPlace(this.highlight_layer._meshes[i].mesh.position);
                }
                let divisor = new BABYLON.Vector3(
                    number_of_selected_objects,
                    number_of_selected_objects,
                    number_of_selected_objects
                );
                // Set parent point position to median of all mesh positions
                this.parent_point.position = mesh_positions.divide(divisor);
                // Parent all meshes to parent point
                for(let i in this.highlight_layer._meshes){
                    let mesh = this.highlight_layer._meshes[i].mesh;
                    mesh.setParent(this.parent_point);
                }
                this.gizmo_manager.attachToMesh(this.parent_point);
            }
        }
        this.active_object = ev.meshUnderPointer;
    }

    add_cube(){
        let cube = BABYLON.MeshBuilder.CreateBox("cube", {}, this.scene);
        this.add_object_defaults(cube);
        return cube;
    }

    add_sphere(){
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, this.scene);
        this.add_object_defaults(sphere);
        return sphere;
    }
    
    add_cylinder(){
        let cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {}, this.scene);
        this.add_object_defaults(cylinder);
        return cylinder;
    }

    add_point_light() {
        let light_dummy = BABYLON.MeshBuilder.CreateSphere("point_light_dummy_mesh", {
            diameter: .3,
        }, this.scene);
        let light = new BABYLON.PointLight("point_light", new BABYLON.Vector3(), this.scene);
        light.parent = light_dummy;
        this.add_object_defaults(light_dummy);
    }

    add_new_material() {
        this.selected_material = new BABYLON.StandardMaterial("test", this.scene);
        this.gui.refresh_materials_list();
    }

    get_materials_list(){
        let materials_list = [];
        for(let i in this.scene.materials){
            if(this.scene.materials[i].name == this.default_grid.material) continue;
            materials_list.push(this.scene.materials[i]);
        }
        return materials_list;
    }

    add_object_defaults(object){
        this.gizmo_manager.attachableMeshes.push(object);
        object.actionManager = this.actionManager;
        this.material = this.default_material;
        this.gui.refresh_materials_list();
    }

    default_camera(){
        let camera = new BABYLON.ArcRotateCamera("default_camera", 1, 1, 10, new BABYLON.Vector3(0,0,0), this.scene);
        camera.attachControl(canvas, true);
        camera.inertia = 0.1;
        camera.panningInertia = 0.1;
        camera.inputs.attached.pointers.angularSensibilityX = 200;
        camera.inputs.attached.pointers.angularSensibilityY = 200;
        camera.inputs.attached.pointers.panningSensibility = 70;
        camera.inputs.attached.pointers.buttons[0] = null;
    }
    
    default_grid(){
        let default_grid_material = new BABYLON.GridMaterial("default_grid_material", this.scene);
        default_grid_material.majorUnitFrequency = 1;
        default_grid_material.minorUnitVisibility = 0.1;
        default_grid_material.gridRatio = 1;
        default_grid_material.backFaceCulling = false;
        default_grid_material.mainColor = new BABYLON.Color3(1, 1, 1);
        default_grid_material.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        default_grid_material.opacity = 0.1;
        this.default_grid = BABYLON.Mesh.CreateGround("default_grid", 100, 100, 2, this.scene);
        this.default_grid.material = default_grid_material;
        this.default_grid.isPickable = false;
    }

    default_gizmo_manager(){
        this.gizmo_manager = new BABYLON.GizmoManager(this.scene);
        this.gizmo_manager.usePointerToAttachGizmos = false;
        this.gizmo_manager.positionGizmoEnabled = true;
        this.gizmo_manager.attachableMeshes = [];
        this.gizmo_manager.onAttachedToMeshObservable.add((mesh) => {
            console.log(mesh.name);
        });
    }

    set_gizmos(pos, rot, scale){
        this.gizmo_manager.positionGizmoEnabled = pos;
        this.gizmo_manager.rotationGizmoEnabled = rot;
        this.gizmo_manager.scaleGizmoEnabled = scale;
    }

    default_selection_system(){
        let highlight = new BABYLON.HighlightLayer("default_highlight_layer", this.scene);
        highlight.addExcludedMesh(this.default_grid);
        let highlight_blur = .4;
        highlight.blurHorizontalSize = highlight_blur;
        highlight.blurVerticalSize = highlight_blur;
        highlight.innerGlow = false;
        highlight.disableBoundingBoxesFromEffectLayer = false;
        this.highlight_layer = highlight;
        this.parent_point = new BABYLON.Mesh("muliselected_parent_point", this.scene);
    }
}
