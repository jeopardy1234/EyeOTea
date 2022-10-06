var express = require("express");
var router = express.Router();
// const axios = require('axios');
const axios = require('axios');
const moment = require('moment');
// set url as constant
const URL = 'https://jsonplaceholder.typicode.com/todos';
// Load User model
const User = require("../models/Users");

router.get("/data", function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

var timer = setInterval(function () {
    axios
        .get("https://api.thingspeak.com/channels/1837482/feeds.json?results=1")
        .then((response) => {
            {
                var data1 = response.data.feeds;
                for (var i = 0; i < 1; i++) {
                    var d = moment(new Date()).format("DD-MM-YYYY");
                    var t = new Date().toLocaleTimeString();
                    // console.log(t);
                    var monthfield = d.split('-')[1];
                    var dayfield = d.split('-')[0] - 1;
                    var yearfield = d.split('-')[2];
                    var inputDate = yearfield + monthfield + dayfield;
                    var d = data1[i].created_at.substring(0,10);
                    var t = data1[i].created_at.substring(11,19);
                    var datte = d.split('-');
                    var x = datte[0];
                    datte[0] = datte[2];
                    datte[2] = x;
                    d=datte[0]+"-"+datte[1]+"-"+datte[2];
                    // console.log(d,t);

                    var ph = (Math.round(data1[i].field3 * 100) / 100);
                    var turbidity = (Math.round(data1[i].field2 * 100) / 100);
                    var tds = (Math.round(data1[i].field1 * 100) / 100);
                    var temperature = (Math.round(data1[i].field4 * 100) / 100);
                    const newUser = new User({
                        date: d,
                        time: t,
                        ph: ph,
                        turbidity: turbidity,
                        temperature: temperature,
                        tds: tds,
                        id: data1.entry_id,
                        date1: inputDate,
                        created: data1[i].created_at,
                    });
                    console.log(newUser);
                    console.log("hi");
                    newUser.save()
                        .then(user => {
                            console.log("data posted");
                        })
                        .catch(err => {
                            console.log("error while posting data");
                        });
                }
            };
        })
        console.log("done");
}, 40000);
module.exports = router;

