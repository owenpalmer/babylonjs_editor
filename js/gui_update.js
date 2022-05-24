class GuiUpdate{
    constructor(scene){
        this.world = scene;
    }

    refresh_materials_list(){
        let materials_list = this.world.get_materials_list();
        $("#materials_grid").empty();
        for(let i in materials_list){
            let selected_class = "";
            if(materials_list[i] == this.world.default_grid.material) continue;
            if(materials_list[i] == this.world.selected_material) selected_class = "ui-selected";
            this.world.selected_material = $("#materials_grid").append('<div class="grid_item '+selected_class+'"><img class="add_object_icon" src="icons/sphere.png" alt="Sphere"></div>');
        }
    }

}