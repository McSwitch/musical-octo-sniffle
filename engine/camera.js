class Camera
{
    velocity = { x: 0, y: 0 };
    position = { x: 0, y: 0 };
    zoom = 1;
    #duration = 0;
    #previousStep = null;
    #framesPerSecond = 0;
    #verbose = true;
    #rendering = false;
    #paused = false;
    canvas = null;
    #ctx = null;
    backgroundColor = "#333";
    crossHairStyle = null;
    fill = true;
    #map = null;

    constructor(canvas, scenePath)
    {
        let that = this;
        this.#map = loadJson(`${scenePath}/map.json`);
        this.#map.tilesets.forEach(
            function(tileset, index)
            {
                that.#map.tilesets[index].tileset = loadJson(`${scenePath}/${tileset.source}`);
                let tilesetImage = new Image();
                tilesetImage.src = `${scenePath}/${that.#map.tilesets[index].tileset.image}`;
                that.#map.tilesets[index].tileset.set = tilesetImage;
            }
        );

        if (canvas)
        {
            this.canvas = canvas;
        }
        this.Resume();
        let camera = this;
        setInterval(function() {
            camera.#framesPerSecond = Math.floor(1000 / camera.#duration);
        }, 250);
    }

    Resume()
    {
        this.#rendering = true;
        let camera = this;
        window.requestAnimationFrame((step) => { camera.Render(step) });
    }

    Paused()
    {
        this.#paused = true;
        let camera = this;
    }

    Stop()
    {
        this.#rendering = false;
    }

    RenderBackground()
    {
        // ground, grass, buildings, etc
    }

    RenderObjects()
    {
        // characters, vehicles, etc
    }

    RenderForeground()
    {
        // bridges, roofs, etc
    }

    RenderUserHeadsUpDisplay()
    {
        // health, etc
    }

    RenderUserInterface()
    {
        // inventory, etc
    }

    RenderUserMenu()
    {
        // options, save, load, exit, etc
    }

    Render(step)
    {
        let camera = this;

        if (!camera || !camera.canvas)
        {
            camera.#previousStep = null;
            window.requestAnimationFrame((step) => { camera.Render(step) });
            return;
        }

        if (camera.fill)
        {
            camera.canvas.width = document.body.clientWidth;
            camera.canvas.height = document.body.clientHeight;
        }

        if (camera.#previousStep)
        {
            let duration = step - camera.#previousStep;
            camera.#duration = camera.#duration * 0.8 + duration * 0.2;
        }

        let canvas = camera.canvas;
        if (!camera.#ctx)
        {
            camera.#ctx = canvas.getContext("2d");
        }
        let ctx = camera.#ctx;

        ctx.fillStyle = camera.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        camera.#map.layers.forEach(function(layer) {
            ctx.globalAlpha = layer.opacity;
            if (layer.class === "collision")
            {
                ctx.globalAlpha = 0.6;
                return;
            }
            layer.data.forEach(function(cell, index) {
                let gridRow = Math.floor(index / layer.width);
                let gridColumn = index % layer.width;
                let gridY = gridRow * camera.#map.tileheight;
                let gridX = gridColumn * camera.#map.tilewidth;

                let tileset = camera.#map.tilesets[0].tileset;
                let tileIndex = cell - 1;
                let tileRow = Math.floor(tileIndex / tileset.columns);
                let tileColumn = tileIndex % tileset.columns;
                let tileY = tileRow * tileset.tileheight;
                let tileX = tileColumn * tileset.tilewidth;

                ctx.drawImage(
                    tileset.set,
                    tileX,
                    tileY,
                    tileset.tilewidth,
                    tileset.tileheight,
                    Math.floor(camera.position.x) + gridX * camera.zoom,
                    Math.floor(camera.position.y) + gridY * camera.zoom,
                    camera.#map.tilewidth * camera.zoom,
                    camera.#map.tileheight * camera.zoom,
                );
            })
        });

        if (camera.crossHairStyle)
        {
            ctx.strokeStyle = camera.crossHairStyle;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }

        if (camera.#verbose)
        {
            let zoom = Math.floor(camera.zoom * 100) / 100;
            let lines = [
                ` FPS: ${camera.#framesPerSecond}`,
                `   X: ${camera.position.x}`,
                `   Y: ${camera.position.y}`,
                `ZOOM: ${zoom}`
            ];

            let textSizeVertical = (canvas.height - 100) / lines.length;
            let textSizeHorizontal = (canvas.width - 100) / 40;
            let textSize = Math.min(textSizeVertical, textSizeHorizontal);
            if (textSize > 32)
            {
                textSize = 32;
            }
            else if (textSize < 8)
            {
                textSize = 8;
            }
            ctx.fillStyle = "white";
            ctx.font = `${textSize}px monospace`;
            lines.forEach(
                function(line, index)
                {
                    ctx.fillText(line, 10, 10 + textSize * (index + 1));
                }
            );
        }

        camera.#previousStep = step;
        window.requestAnimationFrame((step) => { camera.Render(step) });
    }
}
