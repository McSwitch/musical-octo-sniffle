const sniffleScripts = [
    '/engine/camera.js',
    '/engine/controller.js',
    '/engine/jukebox.js',
    '/engine/physics.js',
];

function loadJson(FILE_URL)
{
    const request = new XMLHttpRequest();
    request.open('GET', FILE_URL, false);
    request.send(null);
    return JSON.parse(request.response);
}

function loadScript(FILE_URL, async = true) {
    let script = document.createElement("script");

    script.setAttribute("src", FILE_URL);
    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", async);

    document.body.appendChild(script);
}

sniffleScripts.forEach(
    function(script)
    {
        loadScript(script);
    }
);
