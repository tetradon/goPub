var express = require("express");
var router = express.Router({mergeParams: true}); //mergeParams need to get the "/:id" param from the url
var Pub = require("../models/pub");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //index.js will be automatically found

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Pub.findById(req.params.id, function(err, pub){
        if(err){
            req.flash("error", err.message);
        } else{
            res.render("comments/new", {pub: pub});  
        }
    });
      
});

//CREATE
router.post("/", middleware.isLoggedIn ,function(req, res){
    Pub.findById(req.params.id, function(err, pub) {
        if(err){
            req.flash("error", err.message);
            res.redirect("/pubs");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", err.message);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    pub.comments.push(comment);
                    pub.save();
                    req.flash("success", "Comment was successfully added");
                    res.redirect("/pubs/" + pub._id);
                }
            });
        }
    })
});

//EDIT
router.get("/:comment_id/edit", middleware.isOwnerOrAdmin, function(req, res){
    Pub.findById(req.params.id, function(err, pub){
    if(err){
        req.flash("error", err.message);
        res.redirect("back");
    } else{
        Comment.findById(req.params.comment_id,function(err, comment) {
           if(err){
               req.flash("error", err.message);
               res.redirect("back");
           } else{
               res.render("comments/edit",{pub:pub,comment:comment});
           }
        });
      
    }
    });
   
});

//UPDATE
router.put("/:comment_id", middleware.isOwnerOrAdmin, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else{
            req.flash("success", "Comment was successfully updated");
            res.redirect("/pubs/" + req.params.id);
        }
    })
});

//DESTROY
router.delete("/:comment_id", middleware.isOwnerOrAdmin, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else{
            req.flash("success", "Comment was successfully deleted");
            res.redirect("/pubs/" + req.params.id);
        }
    });  
   
});



module.exports = router;