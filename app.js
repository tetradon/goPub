var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    passportLocal   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    Pub             = require("./models/pub"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

    
    
var commentRoutes   = require("./routes/comments"),
    pubRoutes       = require("./routes/pubs"),
    indexRoutes     = require("./routes/index");
    
var url = process.env.DBURL || "mongodb://localhost/go_pub";
mongoose.connect(url, {useMongoClient: true});


mongoose.Promise = global.Promise;
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

seedDB();
app.locals.moment = require("moment");
//PASPORT CONFIGURATION
app.use(require("express-session")({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/pubs", pubRoutes);
app.use("/pubs/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("GoPub Server started!"); 
});