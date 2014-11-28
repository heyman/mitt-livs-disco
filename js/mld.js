MLD = {
    songs: [],
    photos: [],
    currentScreen: null,
    currentSong: 0,
    blackScreen: $(".screen.black"),
    titleScreen: $(".screen.title"),
    songScreen: $(".screen.songs"),
    photoScreen: $(".screen.photos"),
    body: $("body"),
    photoElements: [],
    currentPhoto: -1,
    shiftDown: false,
    
    photoBeatCount: 0,
    photoBeatTime: 0,
    photoBeatInterval: 0,
    photoBeatIntervalToken: null,
    photoBeatLastTime: null,
    photoBeatRunning: false,
    
    html: $("html"),
    body: $("body"),
    colors: ["#f00", "#0f0", "#00f", "#ff0", "magenta"],
    flashBackgrouondIntervalToken: null,
    flashBackgroundRunning: false,
    
    init: function() {
        this.switchScreen(this.blackScreen);
        this.setSong(0);
        
        $.each(this.photos, function() {
            //console.log("photo", this);
            var photo = $('<i class="photo"></i>').appendTo(".screen.photos").hide();
            photo.css({"background-image": "url(" + this + ")"});
            MLD.photoElements.push(photo);
        });
        MLD.nextPhoto();
        
        $(document).on("keydown", function(event) {
            console.log("key:", event.keyCode);
            switch (event.keyCode) {
                case 16:  // shift key
                    MLD.shiftDown = true;
                    break;
                case 49:
                    MLD.switchScreen(MLD.blackScreen);
                    break;
                case 50:
                    MLD.switchScreen(MLD.titleScreen);
                    break;
                case 51:
                    MLD.switchScreen(MLD.photoScreen);
                    break;
                case 52:
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
                case 32: // Space key
                    if (MLD.currentScreen == MLD.photoScreen) {
                        MLD.nextPhoto();
                        if (MLD.shiftDown) {
                            if (MLD.photoBeatRunning)
                                MLD.stopPhotoBeat();
                            MLD.trackPhotoBeat();
                        } else {
                            MLD.stopPhotoBeat();
                        }
                    }
                    break;
                case 70: // F key
                    if (MLD.shiftDown) {
                        if (MLD.flashBackgroundRunning)
                            MLD.stopFlashBackground();
                        else
                            MLD.startFlashBackground();
                    } else {
                        MLD.flashBackground();
                    }
                    break;
                case 188: // , key
                    MLD.dolphinLeft();
                    break;
                case 190: // . key
                    MLD.dolphinRight();
                    break;
            }
        });
        $(document).on("keyup", function(event) {
            switch (event.keyCode) {
                case 16:  // shift key
                    MLD.shiftDown = false;
                    if (MLD.currentScreen == MLD.photoScreen) {
                        if (!MLD.photoBeatRunning)
                            MLD.startPhotoBeat();
                    }
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
        
        $(".songs li").css({height:""});
        var songHeight = Math.max($(".songs li:first").height(), $(".songs li:last").height());
        $(".songs li").css({height:songHeight});
        
        //console.log("height:", songHeight);
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
    
    trackPhotoBeat: function() {
        if (this.photoBeatTime == 0) {
            this.photoBeatTime = new Date().getTime();
        } else {
            var time = (new Date().getTime()) - this.photoBeatTime;
            this.photoBeatInterval = Math.round(time/this.photoBeatCount)
            console.log("interval:", this.photoBeatInterval);
        }
        this.photoBeatLastTime = new Date().getTime();
        this.photoBeatCount++;
    },
    startPhotoBeat: function() {
        console.log("starting photo beat");
        if (this.photoBeatInterval == 0)
            return
        
        // clear any previous beat interval
        clearInterval(MLD.photoBeatIntervalToken);
        
        // calculate short delay to get the beat synced
        var waitTime = this.photoBeatInterval - (((new Date().getTime()) - this.photoBeatLastTime) % this.photoBeatInterval);
        this.photoBeatRunning = true;
        setTimeout(function() {
            MLD.photoBeatIntervalToken = setInterval(function() {
                MLD.nextPhoto();
            }, MLD.photoBeatInterval);
        }, waitTime);
    },
    stopPhotoBeat: function() {
        console.log("stop photo beat");
        clearInterval(this.photoBeatIntervalToken);
        this.photoBeatRunning = false;
        this.photoBeatCount = 0;
        this.photoBeatTime = 0;
        this.photoBeatInterval = 0;
        this.photoBeatLastTime = null;
    },
    
    changeBackground: function() {
        var i = Math.floor(Math.random() * this.colors.length);
        this.html.css({"background-color": this.colors[i]});
        this.body.css({"background-color": this.colors[i]});
    },
    flashBackground: function() {
        var html = $("html");
        var body = $("body");
        var colors = ["#f00", "#0f0", "#00f", "#ff0", "magenta"];
        var count = 0;
        var changeColor = function() {
            MLD.changeBackground();
            count++;
            if (count < 30)
                setTimeout(changeColor, 100);
            else {
                MLD.body.css({"background-color": "#000"});
                MLD.html.css({"background-color": "#000"});
            }
        }
        setTimeout(changeColor, 0);
    },
    startFlashBackground: function() {
        if (this.flashBackgrouondIntervalToken)
            clearInterval(this.flashBackgrouondIntervalToken);
        this.flashBackgroundRunning = true;
        this.flashBackgrouondIntervalToken = setInterval(function() {
            MLD.changeBackground();
        }, 100);
    },
    stopFlashBackground: function() {
        if (this.flashBackgrouondIntervalToken) {
            clearInterval(this.flashBackgrouondIntervalToken);
            this.flashBackgroundRunning = false;
            MLD.body.css({"background-color": "#000"});
            MLD.html.css({"background-color": "#000"});
        }
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
