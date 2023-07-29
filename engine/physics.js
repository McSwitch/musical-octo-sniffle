class Physics
{
    #objects = [];
    #lastRun = new Date();

    constructor()
    {
        let that = this;
        setInterval(function() {
            that.loop();
        }, 100);
    }

    addObject(object)
    {
        this.#objects.push(object);
    }

    loop()
    {
        let now = new Date();
        let duration = (now - this.#lastRun) / 1000;
        if (duration > 1)
        {
            duration = 1;
        }

        this.#objects.forEach(
            function(object)
            {
                object.position.x += object.velocity.x * duration;
                object.position.y += object.velocity.y * duration;
            }
        );

        this.#lastRun = new Date();
    }
}
