//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= require("mongoose");


const homeStartingContent =
"As for a little bit about me, I am a developer based out of Vancouver, British Columbia with a love for building user-facing products. I'm always looking to learb any new tech and improve my skills in both frontend and backend development.";


const aboutContent = "I’m a Front-End Developer located in Vancouver, BC, Canada. I have a serious passion for UI effects, animations and creating intuitive, dynamic user experiences.";
const contactContent = "I’m interested in freelance opportunities – especially ambitious or large projects. However, if you have other request or question, don't hesitate to contact me" ;
const writingContent = "I mainly write about development, journal and lesson to understand deeply and remember for a long time.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//---------------- mongodb connection start -----------------

mongoose.connect('mongodb+srv://kimmy:Test1@cluster0.yc97m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err){
  if(err){console.log("DB Error!");}else{console.log("DB connected!");}
})

const blogpostSchema = new mongoose.Schema({
  title : {type:String},
  content : {type:String}
});

const Post = mongoose.model('blogDB', blogpostSchema);
//---------------- mongodb connection end -----------------


app.get('/about', function (req,res){
  res.render('about.ejs', {
    AboutContent : aboutContent
  });
}); //rendr 'about' page && pass the key : value to page

app.get('/contact', function (req,res){
  res.render('contact.ejs', {
    ContactContent : contactContent
  });
}); //render 'contact' page


app.get('/', function (req,res){
  res.render('home.ejs', {
    StartingContent : homeStartingContent
  });
}); //render 'home' page


app.get('/writing', function (req,res){
  Post.find({}, function(err,posts){
    if(err){
      console.log("DB 불러오기 실패");
    }else{ 
    res.render('writing.ejs', {
      posts : posts,
      WritingContent : writingContent
    });
  }
  });
  

}); //render 'writing' page

app.post('/compose', function(req,res){

   const post = new Post ({
     title : req.body.postTitle,
     content : req.body.postContents
   });

   post.save(function(err){
     if(!err){
       console.log("DB Save success!");
       res.redirect("/writing");
      }else{
        console.log("DB save failed!"); 
        res.redirect("/compose");
      }
   }); 
});
//pass data from 'compose' page

app.get('/compose',function (req,res){
  res.render("compose");
}); //render 'compost' page


app.get('/posts/:postId', function(req, res){

  const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, function(err, post){
      if(err){
        console.log("post 불러오기 실패");
      }else{
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    });

})

//express page routing (tip! req.params.postName : day1 )


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
