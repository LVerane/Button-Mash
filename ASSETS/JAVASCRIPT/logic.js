//app_info_print 440
//"http://cors-anywhere.herokuapp.com/api.steampowered.com/ISteamApps/GetAppList/v0002/"

var queryURL = "https://cors-anywhere.herokuapp.com/store.steampowered.com/appreviews/321290?json=1";

$.ajax({
    url: queryURL,
    method: "GET",
   
    // headers: {
    //     "Access-Control-Allow-Origin" : "*"
    // },
    // crossDomain: true
}).then(function (response) {

    console.log("got response");
    console.log(response);

});