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
        for(var i=0; i<response.platforms.length; i++){
            platforms.append(response.platforms[i].platform.name)
            if(i < (response.platforms.length - 2)){
                platforms.append(", ")
            }else if(i === (response.platforms.length - 2)){
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

        console.log("got response from review");
        console.log(response)

        for (var i = 0; i < response.results.length; i++) {

            //move this function declaration to global
            text_truncate = function (str, length, ending) {
                if (length == null) {
                    length = 300;
                }
                if (ending == null) {
                    ending = '...';
                }
                if (str.length > length) {
                    return str.substring(0, length - ending.length) + ending;
                } else {
                    return str;
                }
            };

            //splice away <br/> tags and add space/new line there.
            review = text_truncate(response.results[i].text)

            newPRating = $(`<p>`).text(`Rating: ${response.results[i].rating}/5`)
            newPReview = $(`<p>`).text(review)
            
            $("#game-reviews").append(newPReview, newPRating);
        }

    });
}
