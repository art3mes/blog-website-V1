
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');                           //LODASH
const mongoose=require('mongoose');
require('dotenv').config();


const homeStartingContent = "Welcome to our blog! Here, we share informative and inspiring content on a variety of topics that matter to you. Whether you're looking for advice on personal growth, tips for a healthier lifestyle, or insights on the latest trends and innovations, we've got you covered. Our team of writers and experts are passionate about creating engaging and informative content that will help you navigate through life's challenges and find new opportunities for growth and success. So sit back, grab a cup of coffee, and enjoy our latest articles and insights.";
const aboutContent = "At our website, we are dedicated to providing our readers with the most valuable and insightful content possible. Our team is made up of passionate writers, researchers, and experts who are committed to delivering high-quality articles that inform, educate, and inspire our readers. Whether you're looking for advice on personal growth, health and wellness, or the latest industry trends and news, our website is your go-to destination for all things informative and inspiring. We strive to create a welcoming and inclusive community where our readers can connect, share their experiences, and learn from each other.";
const contactContent = "We always love to hear from our readers! If you have any questions, comments, or feedback, please don't hesitate to reach out to us. You can contact us by filling out the form on this page, and we'll do our best to get back to you as soon as possible. Alternatively, you can also connect with us on social media or send us an email. We appreciate your support and look forward to hearing from you!";

let app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect(process.env.DB_URL)
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err));
const composeSchema={
  title:String,
  bodyText:String
};
const Post=mongoose.model('Post',composeSchema);

app.get("/",function(req,res){
  Post.find().then(function(posts){

    res.render("home.ejs", {
      homeString:homeStartingContent,
      posts:posts
    }); 
  });
});
app.get("/about", function(req,res){
  res.render("about.ejs", {aboutString:aboutContent});
});
app.get("/compose", function(req,res){
  res.render("compose.ejs");
});
app.get("/contact", function(req,res){
  res.render("contact.ejs", {contactString:contactContent});
});

app.get('/posts/:postName', function(req, res){                 //making a dynamic website
  const requestedTitle=_.lowerCase(req.params.postName);
 // console.log(req.params);                                  //prints all parameters
  Post.find().then(function(posts){
    // posts.forEach(function(per){                         printing post title on console
    //   console.log(per.title);
    // });
    posts.forEach(function(post){                             //searching for a post in already made posts
      let storedTitle=_.lowerCase(post.title);
      if(storedTitle===requestedTitle){
      res.render("post.ejs",{postTitle: post.title, postContent: post.bodyText} );     //making separate page for each post 🌟
      }
    });
  }); 
});

app.post("/compose", function(req,res){
  const post={
    title:req.body.inputText, 
    content:req.body.textArea
  };
  const composedPost=new Post({
    title:post.title,
    bodyText:post.content
  });
  composedPost.save(); 
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});