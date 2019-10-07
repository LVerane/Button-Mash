$(document).on('click', '#reviewLink', function () {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function () {
    $("#navForm1").hide();
    $("#navForm2").show();
});

console.log(window.location.search);
var urlSearch = new URL(location.href).searchParams.get('navSearch');
var game = urlSearch.split("");

for (var i = 0; i < game.length; i++) {
    if (game[i] == " ") {
        game[i] = "-"
    }
}
urlSearch = game.join("");

getInfo();


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

        reddit = $(`<a>`).attr("href", response.reddit_url)
        imageRed = $(`<img>`).attr("src", "ASSETS/IMAGES/redditLogoSmall.jpg")//will be the reddit logo
        reddit.html(imageRed)


        metacritic = $(`<a>`).attr("href", response.metacritic_url).text(`Metacritic Score: ${response.metacritic}`)

        website = $(`<a>`).attr("href", response.website)
        imageWeb = $(`<img>`).attr("src", response.background_image)
        imageWeb.attr("width", "500px") //this should go to css. give it a class instead?

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

function getReview(oficialName) {//do I pass gameInput as parameter?
    var queryURL = "https://api.rawg.io/api/games/" + oficialName + "/reviews";
    resetTruncate();

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        $("#game-reviews").html("")
        $("#reviews").text("Reviews")

        // console.log("got response from review");
        // console.log(response)

        for (var i = 0; i < response.results.length; i++) {

            //do an if check before
            //give the text box a size, overflow: hidden, change it on click?


            //reg ex to either take it away or replace it with close/open p tag?
            //splice away <br/> tags and add space/new line there.
            // review = text_truncate(response.results[i].text)
            review = response.results[i].text
            // console.log(review)

            // console.log("length is " + review.length)


            newPRating = $(`<p>`).text(`Rating: ${response.results[i].rating}/5`)
            newPReview = $(`<p>`).text(`${review}`).attr("class", "truncate").attr("id", count)

            count++;

            truncate();

            $("#game-reviews").append(newPReview, newPRating);
        }

    });
}

var fullReviews = [];
// var shortReviews = [];
var position = 0;
var count = 0;

function resetTruncate() {
    fullReviews = [];
    // shortReviews = [];
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
            // shortReviews.push(shortString)
            $(Element).html(shortString + show);
            position++;
        }

    });

}

$(document).on("click", ".show", function () {
    position = $(this).attr("data-show")
    // var hide = "<span class='hide' data-hide='" + position + "'>[Read Less]</span>";
    $(`#${position}`).html(fullReviews[position] + "<span class='hide' data-hide='" + position + "'>[Read Less]</span>");//used the "Hide" generated last, with data-count of 9. swap to attatch both show and hide and just toggle show/hide
    console.log("this is a test")//but data-hide goes to 9
    //and it loops. How? //swaping Hide for its declaration fixes it, but it somehow still loops. How?
});

$(document).on("click", ".hide", function () {
    position = $(this).attr("data-hide")
    // show = "<span class='show' data-show='" + position + "'>[Read More]</span>";
    $(`#${position}`).html(fullReviews[position].substring(0, 500) + "<span class='show' data-show='" + position + "'>[Read More]</span>");
});
