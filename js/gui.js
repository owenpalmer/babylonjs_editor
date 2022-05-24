jQuery(document).ready(function($) {
    document.getElementById("main").style.width = window.innerWidth + "px";
    document.getElementById("main").style.height = window.innerHeight + "px";

    var sizes = {
        "left_sidebar" : 0.2,
        "viewport" : 0.7,
        "middle_section" : 0.80,
    };

    Resizable.initialise("main", sizes);

    var colorpicker = new iro.ColorPicker("#material_color_picker", {
        width: 150,
        handleRadius: 4,
    });

    colorpicker.on("color:change", function(color) {
        console.log(my_scene.active_object);
    });

    $(".add_object").on("click", function(e){
        object_slug = e.target.parentNode.dataset.object;
        if(object_slug == "sphere") my_scene.add_sphere();
        if(object_slug == "cube") my_scene.add_cube();
        if(object_slug == "cylinder") my_scene.add_cylinder();
        if(object_slug == "point_light") my_scene.add_point_light();
    });

    $("#create_new_material").on("click", function(e){
        $('#materials_grid .ui-selected').removeClass('ui-selected');
        $("#materials_grid").append('<div class="grid_item ui-selected"><img class="add_object_icon" src="icons/sphere.png" alt="Sphere"></div>');
        my_scene.add_new_material();
    });

    $("#gizmo_options_selectable").on("click", function(e){
        gizmo_type = e.target.dataset.gizmo_type;
        if(gizmo_type == "move") my_scene.set_gizmos(true, false, false);
        if(gizmo_type == "rotate") my_scene.set_gizmos(false, true, false);
        if(gizmo_type == "scale") my_scene.set_gizmos(false, false, true);
    });

    $("#gizmo_options_selectable").selectable();
    $("#materials_grid").selectable();

});

window.addEventListener("resize", () => {
    Resizable.activeContentWindows[0].changeSize(window.innerWidth, window.innerHeight);
    Resizable.activeContentWindows[0].childrenResize();
});
