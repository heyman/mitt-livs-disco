MLD = {
    songs: [],
    photos: [],
    currentScreen: null,
    currentSong: 0,
    titleScreen: $(".screen.title"),
    songScreen: $(".screen.songs"),
    photoScreen: $(".screen.photos"),
    body: $("body"),
    photoElements: [],
    currentPhoto: -1,
    
    init: function() {
        this.switchScreen(this.titleScreen);
        this.setSong(0);
        
        $.each(this.photos, function() {
            //console.log("photo", this);
            var photo = $('<i class="photo"></i>').appendTo(".screen.photos").hide();
            photo.css({"background-image": "url(" + this + ")"});
            MLD.photoElements.push(photo);
        });
        MLD.nextPhoto();
        
        $(document).on("keydown", function(event) {
            console.log("event:", event);
            switch (event.keyCode) {
                case 49:
                    MLD.switchScreen(MLD.titleScreen);
                    break;
                case 50:
                    MLD.switchScreen(MLD.photoScreen);
                    break;
                case 51:
                    MLD.switchScreen(MLD.songScreen);
                    break;
                case 37:
                    if (MLD.currentScreen == MLD.songScreen) {
                        MLD.changeSong(-1);
                    }
                    break;
                case 39:
                    if (MLD.currentScreen == MLD.songScreen) {
                        MLD.changeSong(1);
                    }
                    break;
                case 32:
                    if (MLD.currentScreen == MLD.photoScreen) {
                        MLD.nextPhoto();
                    }
                    break;
                case 70: // F key
                    MLD.flashBackground();
                    break;
                case 188: // , key
                    MLD.dolphinLeft();
                    break;
                case 190: // . key
                    MLD.dolphinRight();
                    break;
            }
        });
        
        //console.log(document.documentElement.requestFullscreen);
        //document.documentElement.requestFullscreen();
        $("body").click(function() {
            this.webkitRequestFullscreen();
        });
    },
    
    switchScreen: function(screen) {
        $(".screen").hide();
        screen.show();
        this.currentScreen = screen;
    },
    
    changeSong: function(delta) {
        this.setSong(this.currentSong+delta);
    },
    
    setSong: function(i) {
        if (i < 0 || i >= this.songs.length)
            return;
        var song1 = this.songs[i][0].split(" - ");
        var song2 = this.songs[i][1].split(" - ");
        $(".songs .song1 h2").text(song1[0]);
        $(".songs .song1 h3").text(song1[1]);
        $(".songs .song2 h2").text(song2[0]);
        $(".songs .song2 h3").text(song2[1]);
        this.currentSong = i;
    },
    
    nextPhoto: function() {
        if (this.photoElements.length == 0)
            return;
        if (this.photoElements[this.currentPhoto])
            this.photoElements[this.currentPhoto].hide();
        
        this.currentPhoto++;
        if (this.currentPhoto >= this.photoElements.length)
            this.currentPhoto = 0;
        this.photoElements[this.currentPhoto].show();
    },
    
    flashBackground: function() {
        var html = $("html");
        var body = $("body");
        var colors = ["#f00", "#0f0", "#00f", "#ff0", "magenta"];
        var count = 0;
        var changeColor = function() {
            var i = Math.floor(Math.random() * colors.length);
            html.css({"background-color": colors[i]});
            body.css({"background-color": colors[i]});
            count++;
            if (count < 30)
                setTimeout(changeColor, 100);
            else {
                body.css({"background-color": "#000"});
                html.css({"background-color": "#000"});
            }
        }
        setTimeout(changeColor, 0);
    },
    
    dolphinLeft: function() {
        var left = $('<i class="dolphin left"></i>').appendTo(MLD.body);
        left
            .transition({x: "100%", y: "-130%", rotate:"25deg"}, 800, "linear")
            .transition({x: "150%", y: "-180%", rotate:"40deg"}, 400, "linear")
            .transition({x: "250%", y: "0", rotate:"90deg"}, 800, "linear", function() {
                left.remove();
            });
    },
    dolphinRight: function() {
        var right = $('<i class="dolphin"></i>').appendTo(MLD.body);
        right
            .transition({x: "-100%", y: "-130%", rotate:"-25deg"}, 800, "linear")
            .transition({x: "-150%", y: "-180%", rotate:"-40deg"}, 400, "linear")
            .transition({x: "-250%", y: "0", rotate:"-90deg"}, 800, "linear", function() {
                right.remove();
            });
    }
};
