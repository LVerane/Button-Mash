$.ajax('https://api.twitch.tv/kraken/clips/top?period=month&limit=4',
    {
        headers: {
            "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    }).then(function (response) {
        console.log(response);
        for (var i = 0; i < response.clips.length; i++) {
            var clipsContainer = $("<div>").attr({ id: "clips-Container" });

            var a = $("<a>").attr({ href: response.clips[i].url, target: "_blank" })
            var b = $("<img>").attr({ src: response.clips[i].thumbnails.medium, id: "imageClips" });
            var c = $("<p>").text(response.clips[i].title);
            a.append(b, c);
            $(".topClips").append(a);
        }
    })
