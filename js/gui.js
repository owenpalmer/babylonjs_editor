document.addEventListener("DOMContentLoaded", () => {
    //...
    document.getElementById("main").style.width = window.innerWidth + "px";
    document.getElementById("main").style.height = window.innerHeight + "px";

    var sizes = {
        "win1" : 0.5,
        "win3" : 0.75,
        "win4" : 0.5,
        "win6" : 0.4,
        "win11" : 0.8,
        "win9" : 0.5,
        "win13" : 0.4 
    };

    Resizable.initialise("main", sizes);

});

window.addEventListener("resize", () => {
    Resizable.activeContentWindows[0].changeSize(window.innerWidth, window.innerHeight);
    Resizable.activeContentWindows[0].childrenResize();
});