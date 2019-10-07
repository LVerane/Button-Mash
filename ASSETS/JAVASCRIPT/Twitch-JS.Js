$(document).on('click', '#reviewLink', function () {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function () {
    $("#navForm1").hide();
    $("#navForm2").show();
});



var gameid;
var streamer;

$("#twitch-embed").empty();
$(".twitchInfo").empty();

console.log(window.location.search);
var urlSearch = new URL(location.href).searchParams.get('navSearch');
var gameSearch = urlSearch;
console.log(gameSearch);

if (gameSearch)
{
    searchGame();
    gamesearch = 0;
}
else{
    featureGame();
}

// If Feature Games Button was Click
$("#feature-Game").on("click", function () {
    featureGame();
})


// Feature Streamer Button Click
$("#feature-Streamer").on("click", function () {
    $(".twitchInfo").empty();
    $("#twitch-embed").empty();
    event.preventDefault();
    $.ajax('https://api.twitch.tv/kraken/streams/featured?limit=12', // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);

            // using loop to generate all the avaible games that user search.
            for (var i = 0; i < response.featured.length; i++) {
                var channelContainer = $("<div>").attr({ id: "channel-container" });
                var subContainer = $("<div>").attr({ id: "sub-container" });

                // streamerName will help us find a preview image for our channels;
                var streamerName = response.featured[i].stream.channel.name.toLowerCase().split(' ').join('');

                // generating images of the channels
                var channelList = $("<img>").attr({ src: "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + streamerName + ".jpg", class: "allchannelImage", id: "channel-image", userName: response.featured[i].stream.channel.name });
                // channel Title                        
                var channelTitle = $("<p>").attr({ id: "channel-title" }).text(response.featured[i].stream.channel.status);
                // Channel UserName
                var channeluserName = $("<p>").attr({ id: "channel-name" }).text(response.featured[i].stream.channel.name);
                // creating icon next to the viewer count
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                var viewerChannel = $("<p>").attr({ id: "viewer-Channel-count" }).text(" " + response.featured[i].stream.viewers);

                //Append UserName, Icon and viewCount to a subContainer
                subContainer.append(channeluserName, iconCreate, viewerChannel);

                //Append Title, Channel-Image-List, SubContainer to TwitchInfo
                channelContainer.append(channelTitle, channelList, subContainer);
                $(".twitchInfo").append(channelContainer);
            }
        });
})

// after clicking on the games the user search for.
$(document).on("click", ".allgameImage", function () {
    // clear the container for new result
    $(".twitchInfo").empty();
    $("#twitch-embed").empty();

    // Overall Game information will be display here.
    var displayGame = $("<div>");
    var gameImage = $("<img>").attr({ src: $(this).attr("src") })
    var gameTitle = $("<h3>").attr({ id: "game-Header" }).text($(this).attr("gameName"));

    $(".twitchInfo").append(gameTitle, gameImage);

    // Using the clicked image attribute to get the game ID to look for live channels.
    gameid = $(this).attr("game_id");
    $.ajax('https://api.twitch.tv/helix/streams?first=10&language=en&game_id=' + gameid, // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);

            // looping 10 time to get the top 10 channels
            for (var i = 0; i < response.data.length; i++) {
                var channelContainer = $("<div>").attr({ id: "channel-container" });
                var subContainer = $("<div>").attr({ id: "sub-container" });

                // streamerName will help us find a preview image for our channels;
                var streamerName = response.data[i].user_name.toLowerCase().split(' ').join('');

                // generating images of the channels
                var channelList = $("<img>").attr({ src: "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + streamerName + ".jpg", class: "allchannelImage", id: "channel-image", userName: response.data[i].user_name });
                // channel Title                        
                var channelTitle = $("<p>").attr({ id: "channel-title" }).text(response.data[i].title);
                // Channel UserName
                var channeluserName = $("<p>").attr({ id: "channel-name" }).text(response.data[i].user_name);
                // creating icon next to the viewer count
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                var viewerChannel = $("<p>").attr({ id: "viewer-Channel-count" }).text(response.data[i].viewer_count);

                //Append UserName, Icon and viewCount to a subContainer
                subContainer.append(channeluserName, iconCreate, viewerChannel);

                //Append Title, Channel-Image-List, SubContainer to TwitchInfo
                channelContainer.append(channelTitle, channelList, subContainer);
                $(".twitchInfo").append(channelContainer);
            }

        });
})

// clicking on one of the channels will open an embed stream within our sites
$(document).on("click", ".allchannelImage", function () {
    $(".twitchInfo").empty();
    $("#twitch-embed").empty();
    $("#twitch-embed").show();

    console.log("Streamer Should be shown");
    var liveName = $(this).attr("userName");
    new Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        channel: liveName
    });
})


// Feature Game function
function featureGame() {
    $(".twitchInfo").empty();
    $("#twitch-embed").empty();
    $.ajax('https://api.twitch.tv/kraken/games/top?limit=12', // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);

            // using loop to generate all the avaible games that user search.
            for (var i = 0; i < response.top.length; i++) {
                // new container to hold the game image and number of views
                var gamesContainer = $("<div>").attr({ id: "game-Container" });
                // image of the game (will be use to on-click function later)    
                var gameList = $("<img>").attr({ src: response.top[i].game.box.large, gameName: response.top[i].game.name, game_id: response.top[i].game._id, class: "allgameImage", id: "game-image" + [i] });

                // viewers count      
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                var viewergameCount = $("<p>").attr({ id: "viewer-game-count" }).text(response.top[i].game.popularity + " viewer");

                // append the two to container, then append the container to TwitchInfo
                gamesContainer.append(gameList, iconCreate, viewergameCount);
                $(".twitchInfo").append(gamesContainer);
            }
        });
}

function searchGame() {
    $.ajax('https://api.twitch.tv/kraken/search/games?query=' + gameSearch + "&live=true", // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);
            // using loop to generate all the avaible games that user search.
            for (var i = 0; i < response.games.length; i++) {
                // new container to hold the game image and number of views
                var gamesContainer = $("<div>").attr({ id: "game-Container" });
                // image of the game (will be use to on-click function later)    
                var gameList = $("<img>").attr({ src: response.games[i].box.large, gameName: response.games[i].name, game_id: response.games[i]._id, class: "allgameImage", id: "game-image" + [i] });

                // viewers count      
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                var viewergameCount = $("<p>").attr({ id: "viewer-game-count" }).text(response.games[i].popularity + " viewer");
                // append the two to container, then append the container to TwitchInfo
                gamesContainer.append(gameList, iconCreate, viewergameCount);
                $(".twitchInfo").append(gamesContainer);
            }
        });
}