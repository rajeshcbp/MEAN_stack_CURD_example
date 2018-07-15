var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var http = require('http');
var multer = require('multer');
var crypto = require('crypto');
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//=======================================================HTML Pages=====================================================
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

//======================================================Connect to Mongoose================================================================

var promise = mongoose.connect('mongodb://localhost/your_db_name', {
    useMongoClient: true,
    /* other options */
});


//=======================================================Routs============================================================================

//User routs
var user = require('./routs/account/createNewAccount');


//=====================================================API'S===============================================================================


app.post("/CreateNewUser", user.createUser);
app.get("/GetAllUserDetails", user.getAllUserDetails);
app.get("/GetUserDetails/:Id", user.getUserDetails);
app.put("/UpdateUserDetails/:Id", user.updateUser);
app.delete("/DeleteUserDetails/:Id", user.delete);


//=========================================================================================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server connected to port" + " " + PORT);