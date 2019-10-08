$(document).on('click', '#reviewLink', function () {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function () {
    $("#navForm1").hide();
    $("#navForm2").show();
});

$(document).on('click', '#show-random', function () {
    counter = 0;
    clearInfo();
    showRandomGame();
});

$(document).on('click', '#show-search', function () {
    clearRandom();
    getInfo();
    getVideo();
});

console.log(window.location.search);
var urlSearch = new URL(location.href).searchParams.get('navSearch');

var topGames = ["portal-2", "red-dead-redemption-2", "dragon-age-origins-ultimate-edition", "the-legend-of-zelda-breath-of-the-wild", "heroes-of-might-and-magic-3-the-shadow-of-death", "marvels-spider-man", "divinity-original-sin-ii-definitive-edition", "warcraft-3-reign-of-chaos", "bioshock", "shin-megami-tensei-persona-4", "mortal-kombat-11"];
var counter = 0;

//
var videoSearch = new URL(location.href).searchParams.get('navSearch');
//

if (urlSearch === null || urlSearch === "") {
    console.log("url is null")
    clearInfo();
    showRandomGame();
} else {
    //change it to reg rex
    var game = urlSearch.split("");

    for (var i = 0; i < game.length; i++) {
        if (game[i] == " ") {
            game[i] = "-"
        }
    }
    urlSearch = game.join("");

    //video
    var video = videoSearch.split("");
    //change it to reg rex
    for (var i = 0; i < video.length; i++) {
        if (video[i] == " ") {
            video[i] = "%20"
        }
    }
    videoSearch = video.join("");
    //

    clearRandom();
    getInfo();
    getVideo();
}

//random game start
function clearInfo() {
    $("#game-reviews").html("")
    $("#reviews").html("")
    $("#platforms").html("")
    $("#about").html("")
    $("#game-image").html("")
    $("#game-info").html("")
    $("#reddit").html("")
    $("#metacritic").html("")
    $("#average-rating").html("")
    $(".trailer-link").html("")
}

function clearRandom() {
    for (var i = 0; i < 6; i++) {
        $(`.random-game-${i} .about`).html("")
        $(`.random-game-${i} .game-image`).html("")
        $(`.random-game-${i} .game-info`).html("")
    }
}

function showRandomGame() {
    for (var i = 0; i < 6; i++) {
        // var randomGame = Math.ceil(Math.random() * 358660);
        // var randomLink = "https://api.rawg.io/api/games/" + randomGame;

        var randomPosition = Math.floor(Math.random() * topGames.length)
        var randomGame = topGames[randomPosition]
        var randomLink = "https://api.rawg.io/api/games/" + randomGame + "/suggested?page_size=10";

        $.ajax({
            url: randomLink,
            method: "GET",
        }).then(function (response) {

            var suggestedPosition = Math.floor(Math.random() * 10)
            var randomSuggestion = response.results[suggestedPosition].slug
            var randomSuggestionLink = "https://api.rawg.io/api/games/" + randomSuggestion

            $.ajax({
                url: randomSuggestionLink,
                method: "GET",
            }).then(function (response) {
                console.log(response)

                website = $(`<a>`).attr({ "href": response.website, "target": "_blank" })
                imageWeb = $(`<img>`).attr("src", response.background_image)
                imageWeb.attr("class", "game-img");

                website.html(imageWeb);

                $(`.random-game-${counter} .about`).text(response.name)
                $(`.random-game-${counter} .game-image`).html(website)
                $(`.random-game-${counter} .game-info`).html(response.description)
                counter++;
            });
        });
    }
}
//random game end

//youtube api start
function getVideo() {
    var videoURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + videoSearch + "%20trailer&key=AIzaSyBIJ6pbEXcv9in6Xi-Z8IogrfMpxKUXVy0"
    console.log("videourl = " + videoURL)
    $.ajax({
        url: videoURL,
        method: "GET",
    }).then(function (response) {
        console.log("response from videourl = " + response)
        console.log("response items blah = " + response.items[0].id.videoId)
        var videoId = response.items[0].id.videoId;
        var videoLink = "https://www.youtube.com/watch?v=" + videoId;
        $(".trailer-link").attr("href", videoLink).text("Watch trailer");
        videoSetUp();

    });
}

function videoSetUp() {
    $(`.trailer-link`).magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        preloader: true,
    });
}
//youtube api end

function getInfo() {
    var queryURL = "https://api.rawg.io/api/games/" + urlSearch;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        console.log("got response from info");
        console.log(response)

        platforms = $("<p>").text("Available for ")
        for (var i = 0; i < response.platforms.length; i++) {
            platforms.append(response.platforms[i].platform.name)
            if (i < (response.platforms.length - 2)) {
                platforms.append(", ")
            } else if (i === (response.platforms.length - 2)) {
                platforms.append(" and ")
            }
        }

        averageRating = $(`<p>`).text(`Average RAWG Rating: ${response.rating}`)
        oficialName = response.slug

        reddit = $(`<a>`).attr({ "href": response.reddit_url, "target": "_blank" })
        imageRed = $(`<img>`).attr("src", "ASSETS/IMAGES/redditLogoSmall.jpg")
        reddit.html(imageRed)


        metacritic = $(`<a>`).attr("href", response.metacritic_url).text(`Metacritic Score: ${response.metacritic}`)

        website = $(`<a>`).attr({ "href": response.website, "target": "_blank" })
        imageWeb = $(`<img>`).attr("src", response.background_image)
        imageWeb.attr("class", "game-img");

        website.html(imageWeb);

        $("#platforms").html(platforms)
        $("#about").text(response.name)
        $("#game-image").html(website)
        $("#game-info").html(response.description)
        $("#reddit").html(reddit)
        $("#metacritic").html(metacritic)
        $("#average-rating").html(averageRating)

        getReview(oficialName);
    });
}

function getReview(oficialName) {
    var queryURL = "https://api.rawg.io/api/games/" + oficialName + "/reviews";
    resetTruncate();

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        $("#game-reviews").html("")
        $("#reviews").text("Reviews")

        for (var i = 0; i < response.results.length; i++) {

            review = response.results[i].text
            review = review.replace(/<br\s*[\/]?>/gi, "</p><p>")

            newPRating = $(`<p>`).text(`Rating: ${response.results[i].rating}/5`)
            newPReview = $(`<p>${review}</p>`).attr("class", "truncate").attr("id", count)

            count++;

            truncate();

            $("#game-reviews").append(newPReview, newPRating);
        }
    });
}

var fullReviews = [];
var position = 0;
var count = 0;

function resetTruncate() {
    fullReviews = [];
    position = 0;
    count = 0;
}

function truncate() {
    var show = "<span class='show' data-show='" + position + "'>[Read More]</span>";

    $(".truncate").each(function () {
        var Element = this;
        var FullText = $(Element).text();
        var shortString = FullText.substring(0, 500);
        if (FullText.length > 600) {
            fullReviews.push(FullText)
            $(Element).html(shortString + show);
            position++;
        }
    });
}

$(document).on("click", ".show", function () {
    position = $(this).attr("data-show")
    $(`#${position}`).html(fullReviews[position] + "<span class='hide' data-hide='" + position + "'>[Read Less]</span>");
});

$(document).on("click", ".hide", function () {
    position = $(this).attr("data-hide")
    $(`#${position}`).html(fullReviews[position].substring(0, 500) + "<span class='show' data-show='" + position + "'>[Read More]</span>");
});