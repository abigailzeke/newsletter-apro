const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();
app.use(express.static("public")); // to use local resource
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000,function(req,res){
  console.log("newsletter server running on port 3000");
})

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "yourMailChimpUsername:yourMailChimpAPI"
  }

  const request = https.request("https://us3.api.mailchimp.com/3.0/lists/ca4b741770",options,function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    /*response.on("data",function(data){
      //console.log(JSON.parse(data));
    })*/
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure",function(req,res) {
  res.redirect("/");
});
