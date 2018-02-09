var express = require("express");
var router = express.Router();
var Pub = require("../models/pub");
var middleware = require("../middleware"); //index.js will be automatically found


// INDEX - show all pubs
router.get("/", function(req, res){
   
   Pub.find({}, function(err, pubs){
       if(err){
           req.flash("error", err.message);;
       } else {
           res.render("pubs/index",{pubs:pubs});
       }
   });
   
});

//CREATE - add new pub to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var author ={
        id: req.user._id, 
        username: req.user.username
    }
    var newPub = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: author
    }
    Pub.create(newPub, function(err, pub){
        if(err){
            req.flash("error", err.message);
        } else {
            req.flash("success", "Pub was successfully created");
            res.redirect("/pubs");
        }
    });
    
    
});

//NEW - shows form to create new pub
router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
   res.render("pubs/new"); 
});

//SHOW - shows more info about pub
router.get("/:id", function(req, res) {
    Pub.findById(req.params.id).populate("comments").exec(function(err, foundPub){
        if(err){
            req.flash("error", err.message);
        } else{
            res.render("pubs/show", {pub: foundPub});
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.isAdmin, function(req, res) {
    Pub.findById(req.params.id, function(err, pub){
    if(err){
        req.flash("error", err.message);
        res.redirect("/pubs")
    } else{
        res.render("pubs/edit", {pub:pub}); 
    }
    });
});

//UPDATE
router.put("/:id", middleware.isAdmin, function(req, res){
    Pub.findByIdAndUpdate(req.params.id, req.body.pub, function(err, updatedPub){
        if(err){
            req.flash("error", err.message);
            res.redirect("/pubs");
        } else{
            req.flash("success", "Pub was successfully updated");
            res.redirect("/pubs/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.isAdmin, function(req, res){
    Pub.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/pubs");
        } else{
            req.flash("success", "Pub was successfully deleted");
            res.redirect("/pubs");
        }
    });
});


module.exports = router;
