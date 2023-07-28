class Jukebox
{
    songs = [];
    songCurrentAudio = new Audio();
    songCurrentUrl = null;
    #songCurrentIndex = 0;
    #volume = 1;
    #paused = true;

    constructor(songs, volume = 1)
    {
        this.#volume = volume;
        let that = this;
        songs.forEach(
            function(song)
            {
                that.songCurrentAudio.src = song;
                that.songCurrentAudio.volume = that.#volume;
                that.songCurrentUrl = new URL(that.songCurrentAudio.src);
                that.songs.push(song);
            }
        );
        this.songCurrentAudio.onended = (e) =>
        {
            that.Next();
        };

        if (this.songCurrentAudio.length > 0)
        {
            this.songCurrentAudio.volume = this.#volume;
            this.songCurrentAudio.src = this.songs[this.#songCurrentIndex];
            this.songCurrentUrl = new URL(this.songCurrentAudio.src);
        }
    }

    Shuffle()
    {
        if (this.songs.length <= 1)
        {
            return;
        }

        this.songs
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        this.#songCurrentIndex = 0;
        this.songCurrentAudio.volume = this.#volume;
        this.songCurrentAudio.src = this.#songCurrentIndex;
        this.songCurrentUrl = new URL(this.songCurrentAudio.src);
    }

    Previous()
    {
        if (this.songs.length <= 0)
        {
            return;
        }

        this.#songCurrentIndex--;
        if (this.#songCurrentIndex < 0)
        {
            this.#songCurrentIndex = this.songs.length - 1;
        }
        this.songCurrentAudio.volume = this.#volume;
        this.songCurrentAudio.src = this.songs[this.#songCurrentIndex];
        this.songCurrentUrl = new URL(this.songCurrentAudio.src);
    }

    SetVolume(volume)
    {
        if (volume < 0)
        {
            volume = 0;
        }
        else if (volume > 1)
        {
            volume = 1;
        }
        this.#volume = volume;
        if (this.songCurrentAudio)
        {
            this.songCurrentAudio.volume = volume;
        }
    }

    GetVolume()
    {
        return this.songCurrentAudio.volume;
    }

    Next()
    {
        if (this.songs.length <= 0)
        {
            return;
        }

        this.#songCurrentIndex++;
        if (this.#songCurrentIndex >= this.songs.length)
        {
            this.#songCurrentIndex = 0;
        }
        this.songCurrentAudio.volume = this.#volume;
        this.songCurrentAudio.src = this.songs[this.#songCurrentIndex];
        this.songCurrentUrl = new URL(this.songCurrentAudio.src);
    }

    Play()
    {
        if (this.songs.length <= 0)
        {
            return;
        }

        this.songCurrentAudio.volume = this.#volume;
        this.songCurrentAudio.autoplay = true;
        let that = this;
        let interval = setInterval(
            function() {
                that.songCurrentAudio.play().then(() => {
                    that.#paused = false;
                    clearInterval(interval);
                });
            },
            1000
        );
    }

    Pause()
    {
        if (this.songs.length <= 0)
        {
            return;
        }

        this.songCurrentAudio.autoplay = false;
        this.songCurrentAudio.pause();
        this.songCurrentAudio.volume = this.#volume;
        this.#paused = true;
    }

    PauseToggle()
    {
        if (this.#paused)
        {
            this.Play();
        }
        else
        {
            this.Pause();
        }
    }
}
