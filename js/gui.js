jQuery(document).ready(function($) {
    //...
    document.getElementById("main").style.width = window.innerWidth + "px";
    document.getElementById("main").style.height = window.innerHeight + "px";

    var sizes = {
        "left_sidebar" : 0.2,
        "viewport" : 0.7,
        "middle_section" : 0.8,
    };

    Resizable.initialise("main", sizes);

});

window.addEventListener("resize", () => {
    Resizable.activeContentWindows[0].changeSize(window.innerWidth, window.innerHeight);
    Resizable.activeContentWindows[0].childrenResize();
});

