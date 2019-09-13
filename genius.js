// START METADATA
// NAME: Genius
// AUTHOR: Kirran
// DESCRIPTION: Genius lyrics fetcher
// END METADATA
const FONT_SIZE = "20px";
let lyrics_html;

(function () {
    console.log("Genius")
    Spicetify.Player.addEventListener("appchange", init)
    Spicetify.Player.addEventListener("appchange", function () {
        $("#lyrics").remove()
    })
    Spicetify.Player.addEventListener("songchange", songChange)
})()

function init() {
    $(".progress-container.progress-bar-enabled").css("cursor", "pointer")
    $(`<style>
        .verse {
            line-height: 1.5em;
        }
        #refresh {
            position: absolute;
            top: 50px;
            right: 50px;
        }
        #refresh:hover:not(:active) {
            color: #fff;
        }
      </style>`).appendTo("head")
    $("body .view-player .player-bar-wrapper > div:first-child").after("<div><button id=\"lyrics-button\" class=\"button button-green\" style=\"position: absolute; z-index: 1; top: 0; bottom: 0; margin: auto; right: 270px;\">Lyrics</button></div>")
    if(!$("#lyrics-button").length) return;
    Spicetify.Player.removeEventListener("appchange", init)
    $("#lyrics-button").click(function () {
        main()
    })
    lyrics_html = $("<div id=\"lyrics\" class=\"hidden\"><button id=\"refresh\" class=\"button spoticon-repeat-16\"></button><div></div></div>")
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
        $("#lyrics div").html("hey bitch")
        songChange()
    })
    songChange()
}

function getData(song) {
    let artist = song["artist_name"]
    let title = song["title"]
    title = title.replace(/ ?\(.+\)/g, "").replace(/’/g, "'")
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
    if(!$("#lyrics").length) return;

    const ACCESS_TOKEN = 'uV_IMg_0vaBe2IOuPGMbqJuXtuBk7qrH2n7mk_jk5EILQqWtHY_j-byfga2HxibH'
    let song = getData(Spicetify.Player.data.track.metadata)
    let song_id;
    $.get("https://genius-spotify.herokuapp.com", song).then(function (lyrics) {
        lyrics = lyrics.replace(/\[/g, "<span class=\"verse\">[").replace(/\]/g, "]</span>")

        $("#lyrics div").html(lyrics)
        $("#lyrics a").replaceWith(function() { return this.innerHTML; });
    })
}
