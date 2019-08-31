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
    $("#refresh").click(songChange)
    songChange()
}

function getData(song) {
    let artist = song["artist_name"]
    let title = song["title"]
    let i = 1
    while (song["artist_name:"+i] !== undefined) {
        let artist_i = song["artist_name:"+i]
        //title = title.replace("(with " + artist_i + ")", "")
        title = title.replace(/\(.+\)/g, "")
        //artist += " " + artist_i
        i++
    }
    console.log(title)
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

    $.ajaxPrefilter( function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-genius.herokuapp.com/' + options.url;
            //options.url = "http://cors.corsproxy.io/url=" + options.url;
        }
    });

    const ACCESS_TOKEN = 'uV_IMg_0vaBe2IOuPGMbqJuXtuBk7qrH2n7mk_jk5EILQqWtHY_j-byfga2HxibH'
    let song = getData(Spicetify.Player.data.track.metadata)
    let base = "https://api.genius.com";
    let song_id;
    $.get({
        "url": base + "/search",
        "data": {
            "q": song["title"] + " " + song["artist"],
            "access_token": ACCESS_TOKEN
        },
        "crossDomain": true,
        "success": function ({ response: { hits } }) {
            hits.sort(({result: a}, {result: b}) => b["stats"]["pageviews"] - a["stats"]["pageviews"])
            console.log(hits)
            song_url = hits[0]["result"]["url"]
            $.ajax({
                type: "GET",
                url: song_url,
                data: {},
                success: function (data) {
                    let lyrics = $("<div></div>").append($.parseHTML(data)).find(".lyrics p")[0]
                    console.log(lyrics)
                    lyrics = lyrics.innerHTML.replace(/\[/g, "<span class=\"verse\">[").replace(/\]/g, "]</span>")

                    $("#lyrics div").html(lyrics)
                    $("#lyrics a").replaceWith(function() { return this.innerHTML; });
                }
            })
        }
    })
}
