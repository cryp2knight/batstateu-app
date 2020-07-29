const express = require("express");
const app = express();
const port = 3000;
var admin = require("firebase-admin");

let bodyParser = require("body-parser");
// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Dell\Desktop\BatStateU-Alumni-App\server\batstateu-alumni-firebase-adminsdk-311qy-f008191e54.json"

var serviceAccount = require("C:\\Users\\Daniel\\Documents\\BatStateU-Alumni-App\\server\\google.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://batstateu-alumni.firebaseio.com",
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

const request = require("request");

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => res.send("Hello World!"));

const params = {
  do: "authenticate_student",
  auth_user: "test",
  auth_password: "test",
  target: "android",
  api_key: "380724ec1b6f2da784865ad931fe2ded",
};

const users = {
  0: {
    usr_name: "18-01924",
    usr_fullname: "DE CASTRO,  DANIEL D.",
    token: "009ea648c0143ddfd1fc703f07096648",
    photo_url:
      "http://dione.batstate-u.edu.ph/public/sites/api/fetch_photo.php?id=MTgtMDE5MjQ=",
  },
  1: {
    usr_name: "18-57857",
    usr_fullname: "PITA, MARK SETH U.",
    token: "9f7097120e70ad5701cf03170a2b5afa",
    photo_url:
      "http://dione.batstate-u.edu.ph/public/sites/api/fetch_photo.php?id=MTgtNTc4NTc=",
  },
};

const BASE_URL = "http://dione.batstate-u.edu.ph/public/sites/api/ajax.php?";
// http://dione.batstate-u.edu.ph/public/sites/api/ajax.php?api_key=380724ec1b6f2da784865ad931fe2ded&do=authenticate_student&auth_user=18-01924&auth_password=daniel1999
app.post("/login", function (req, res, next) {
  var data = JSON.parse(req.body);
  console.log(data);

  for (var i in data) {
    params[i] = data[i];
  }
  // console.log(params);
  param = "";
  for (var i in params) {
    param += "&" + i + "=" + params[i];
  }
  // console.log(BASE_URL + param);

  for (let user in users) {
    if (data.auth_user === users[user].usr_name) {
      admin
        .auth()
        .createCustomToken(data.auth_user, users[user])
        .then(function (customToken) {
          users[user].firebaseToken = customToken;
          console.log(users[user]);
          return res.status(200).json(users[user]);
        })
        .catch(function (error) {
          console.log("Error creating custom token:", error);
        });
    }
  }

  // uncomment this when u have new api
  // request.post(
  //   {
  //     url: BASE_URL + param,
  //     method: "POST",
  //     json: true,
  //   },
  //   function (err, response, body) {
  //     // console.log(body);
  //     if (body.length > 4){
  //       res.send(JSON.parse(body.slice(2,-2)));}
  //     else{
  //       res.send('Incorrect credentials!')
  //     }

  //     if (err){
  //       res.send(err)
  //     }

  //   }
  // );
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
