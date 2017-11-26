var app = require('express')();
var bodyParser = require('body-parser');
app.get('/', function (req, res) {
    res.send('Welcome to my homepage');
});
app.get('/contact', function (req, res) {
    res.send('this is the contact page');
});

app.post("/", function (req, res) {
    res.set({"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"})
    var params;
    postData = "";
    // receiving data
    req.on("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.on("end", function () {
        console.log('data transimted');
        //console.log(postData);
        try{
            params = JSON.parse(postData);
            if (("payload" in params) && ("skip" in params) && ("take" in params) && ("totalRecords" in params)) {
                var newList = [];
                var payload = params["payload"];
                for (item in payload) {
                    var buffer = payload[item];
                    if (buffer["drm"] == true && buffer["episodeCount"] > 0) {
                        var buffer2 = buffer["image"]

                        var single = {
                            "image": buffer2["showImage"],
                            "slug": buffer["slug"],
                            "title": buffer["title"]
                        };
                        newList.push(single);
                    }
                }

                var responseData = {
                    "response": newList
                }
                console.log(responseData);
                res.write(JSON.stringify(responseData));
                res.end();
            } else {
                var responseData = {
                    "error": "Could not decode request: JSON parsing failed"
                }
                res.statusCode = 400;
                console.log(JSON.stringify(responseData));
                res.write(JSON.stringify(responseData));
                res.end();
            }
        }catch (e){
            var responseData = {
                "error": "Could not decode request: JSON parsing failed"
            }
            res.statusCode = 400;
            console.log(JSON.stringify(responseData));
            res.write(JSON.stringify(responseData));
            res.end();
        }

    });
});

app.listen(80, '67.216.205.207');

