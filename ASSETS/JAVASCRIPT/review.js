$("#submit").on("click", function (event) {
    event.preventDefault();

    gameInput = $("#game-id").val().trim();
    game = gameInput.split("");

    for (var i = 0; i < game.length; i++) {
        if (game[i] == " ") {
            game[i] = "-"
        }
    }

    gameInput = game.join("");
    console.log(game);
    console.log(gameInput);

    getInfo();

});

function getInfo() {
    var queryURL = "https://api.rawg.io/api/games/" + gameInput;

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
        imageRed = $(`<img>`).attr("src", "https://via.placeholder.com/50")//will be the reddit logo
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

            //move this function declaration to global
            // text_truncate = function (str, length, ending) {
            //     if (length == null) {
            //         length = 300;
            //     }
            //     if (ending == null) {
            //         ending = '...';
            //     }
            //     if (str.length > length) {
            //         return str.substring(0, length - ending.length) + ending;
            //     } else {
            //         return str;
            //     }
            // };

            //reg ex to either take it away or replace it with close/open p tag?
            //splice away <br/> tags and add space/new line there.
            // review = text_truncate(response.results[i].text)
            review = response.results[i].text
            // console.log(review)

            // console.log("length is " + review.length)


            newPRating = $(`<p>`).text(`Rating: ${response.results[i].rating}/5`)
            newPReview = $(`<p>`).text(`${review}`).attr("class", "truncate")

            truncate();

            $("#game-reviews").append(newPReview, newPRating);
        }

    });
}

//reset those on next search
var fullReviews = [];
var shortReviews = [];
// var showCount = 0;
// var hideCount = 0;
var position = 0;
// var count = 0;

function truncate() {
    // var Show = $(`<span>`).text("More").attr("class", "show")
    // var Hide = $(`<span>`).text("Less").attr("class", "hide")
    var Show = "<span class='show' data-show=" + position + ">[Read More]</span>";
    var Hide = "<span class='hide' data-hide=" + position + ">[Read Less]</span>";
    // console.log(showCount)
    // console.log(hideCount)
    // showCount++;
    // hideCount++;
    position++;

    $(".truncate").each(function () {
        var Element = this;
        var FullText = $(Element).text();
        var shortString = FullText.substring(0, 500);
        // console.log("full text = " + FullText)
        // console.log("short string = " + shortString)
        if (FullText.length > 600) {
            fullReviews.push(FullText)
            shortReviews.push(shortString)
            $(Element).html(shortString + Show);
            console.log("full text = " + FullText)
            console.log("short string = " + shortString)
            // console.log(fullReviews[count])
            // console.log(shortReviews[count])
        }

        $(Element).on("click", ".show", function () {
            position = $(this).attr("data-show")
            console.log(position)//this does not change
            $(Element).html(fullReviews[position-1] + "<span class='hide' data-hide=" + position + ">[Read Less]</span>");//used the "Hide" generated last, with data-count of 9. swap to attatch both show and hide and just toggle show/hide
            console.log(Hide)//but data-hide goes to 9
            //and it loops. How? //swaping Hide for its declaration fixes it, but it somehow still loops. How?
        });

        $(Element).on("click", ".hide", function () {
            position = $(this).attr("data-hide")
            // console.log(position)
            $(Element).html(shortReviews[position-1] + "<span class='show' data-show=" + position + ">[Read More]</span>");
        });
    });

}