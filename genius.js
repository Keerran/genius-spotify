// START METADATA
// NAME: Genius
// AUTHOR: Kirran
// DESCRIPTION: Genius lyrics fetcher
// END METADATA
const FONT_SIZE = "20px";
const DEBUG_URL = "http://localhost:5000"
let API_URL = "https://genius-spotify.herokuapp.com"
//API_URL = DEBUG_URL
let lyrics_html;

(function () {
    console.log("Genius")
    Spicetify.Player.addEventListener("appchange", init)
    Spicetify.Player.addEventListener("appchange", function () {
        $("#lyrics").toggleClass("hidden", true)
    })
    Spicetify.Player.addEventListener("songchange", songChange)
})()

function init() {
    console.log("Init")
    //$(".progress-container.progress-bar-enabled").css("cursor", "pointer")
    $(`<style>
        .verse {
            line-height: 1.5em;
        }
        #refresh {
            position: fixed;
            top: 50px;
            right: 50px;
        }
        #refresh:hover:not(:active) {
            color: #fff;
        }
      </style>`).appendTo("head")
    while(!$("#lyrics-button").length) {
        $(".extra-controls-container > div:first-child").after("<button id=\"lyrics-button\" class=\"lyrics-button button button-lyrics spoticon-lyrics-16\"></button>")
    }
    Spicetify.Player.removeEventListener("appchange", init)
    $("#lyrics-button").click(function () {
        main()
    })
    lyrics_html = $("<div id=\"lyrics\" class=\"hidden\"><button id=\"refresh\" class=\"button spoticon-refresh-16\"></button><div></div></div>")
    lyrics_html.css({
        background: "var(--modspotify_main_bg)",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 4,
        padding: "30px",
        fontSize: FONT_SIZE,
        overflowY: "scroll",
        lineHeight: "1.1em"
    })
    $(".main-view").append(lyrics_html)
    $("#refresh").click(() => {
        //$("#lyrics div").html("hey bitch")
        songChange()
    })
    songChange()
}

function getData(song) {
    let artist = song["artist_name"]
    let title = song["title"]
    title = title.replace(/ ?\(.+\)/g, "").replace(/’/g, "'").replace(/ - .+/g, "")
    return { artist, title }
}

function main() {
    if(!$("#lyrics").length)
    {
        $(".main-view").append(lyrics_html)
    }
    $("#lyrics").toggleClass("hidden")
}

function songChange() {
    console.log("songChange")

    let song = getData(Spicetify.Player.data.track.metadata)
    let song_id;
    $("#lyrics div").html("")
    $.get(API_URL, song).then(function ({lyrics, results}) {
        console.log(this.url)
        console.log(lyrics)
        console.log(results)
        lyrics = lyrics.replace(/\[/g, "<span class=\"verse\">[").replace(/\]/g, "]</span>")

        $("#lyrics div").html(lyrics)
        $("#lyrics a").replaceWith(function() { return this.innerHTML; });
    })
}
