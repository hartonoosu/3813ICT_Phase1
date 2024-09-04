const fs = require("fs");

module.exports = function(req, res) {
    let userobj = {
        "userid": req.body.userid,
        "username": req.body.username,
        "useremail": req.body.useremail,
        "usergroup": req.body.usergroup,
        "userrole": req.body.userrole
    };
    let uArray = [];
    fs.readFile("./data/extendedUsers.json", "utf-8", function(err, data) {
      //open the file of user list
        if (err) throw err;
        uArray = JSON.parse(data);
        console.log(userobj);
        //make some change according to user's post
        let i = uArray.findIndex(x => x.username == userobj.username);

        if (i == -1) {
            uArray.push(userobj);
        } else {
            uArray[i] = userobj;
        }
        // send response to user
        //res.send(uArray);
        res.send(userobj); //send only the affected user's data back
        // save the file of user list
        let uArrayJson = JSON.stringify(uArray);
        fs.writeFile("./data/extendedUsers.json", uArrayJson, "utf-8", function(err) {
            if (err) throw err;
        });
    });
};
