// jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: "String",
  content: "String"
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", (req, res)=>{
  res.send("test complete");
});


// REST GET PO DELETE PUT PATCH
// app.get("/articles", (req, res)=>{
//   // view all articles in the DB
//   Article.find((err, foundArticles)=>{
//     // Error Handling:
//     if (!err){
//       // found article documents
//       console.log(foundArticles);
//       res.send(foundArticles);
//     } else {
//       console.error("Unexpected error: " + err);
//       res.send(err);
//     };
//   });
// });

// POSTman, send data and test API without building a front-end
// app.post("/articles", (req, res)=>{
// // Once POSTman comes through we need req.body.fieldName
//   console.log(req.body.title);
//   console.log(req.body.content);
// // POSTman -> Body -> form encoded
// // C IN CRUD, saves to mongoose
//   const article = new Article ({
//     title: req.body.title,
//     content: req.body.content
//   });
//   article.save((err)=> {
//     if (!err) {
//       res.send("Successfully added a new article!");
//     } else {
//       res.send(err);
//     }
//   });
//   // Sends a response to the API
// });

// RESTful DELETE REQUEST, deletes all articles in the collections
// app.delete('/articles', (req, res)=>{
//   // modelName.deleteMany({conditions: to find}, (err)=>{});
//   Article.deleteMany((err)=>{
//     if (!err){
//       res.send("Successfully deleted all articles.");
//     } else {
//       res.send(err);
//     }
//   });
// });

// RESTful
// GET, POST, DELETE ALL ARTICLES
// ROUTING / ROUTER, chaining similiar routes
 app.route("/articles")
 .get((req, res)=>{
   // view all articles in the DB
   Article.find((err, foundArticles)=>{
     // Error Handling:
     if (!err){
       // found article documents
       console.log(foundArticles);
       res.send(foundArticles);
     } else {
       console.error("Unexpected error: " + err);
       res.send(err);
     };
   });
 })
 .post((req, res)=>{
 // Once POSTman comes through we need req.body.fieldName
   console.log(req.body.title);
   console.log(req.body.content);
 // POSTman -> Body -> form encoded
 // C IN CRUD, saves to mongoose
   const article = new Article ({
     title: req.body.title,
     content: req.body.content
   });
   article.save((err)=> {
     if (!err) {
       res.send("Successfully added a new article!");
     } else {
       res.send(err);
     }
   });
   // Sends a response to the API
 })
 .delete((req, res)=>{
   // modelName.deleteMany({conditions: to find}, (err)=>{});
   Article.deleteMany((err)=>{
     if (!err){
       res.send("Successfully deleted all articles.");
     } else {
       res.send(err);
     }
   });
 });

// GET A SPECIFIC ARTICLE
// Uses %20 due to URL-encoding instead of Kebab-case
// https://www.w3schools.com/tags/ref_urlencode.ASP
app.route("/articles/:articleTitle").get((req, res)=>{
  const title = req.params.articleTitle;
  console.log(title);
// R IN CRUD
  Article.findOne({title:req.params.articleTitle}, (err, foundArticle)=>{
    if (!err && foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found");
    }
  });
})
.put((req, res)=>{
  // Article.updateOne({filter: }, {updates: }, {overwrite: true}, (err, results)=>{})
  // if overwrite: true, use replaceOne() instead of updateOne()
  // overwrite if not "true", it only updates a particular field
  // PUT request, completely replaces the document instead of editing bits and pieces
  Article.replaceOne({
    title:req.params.articleTitle}, {
    title: req.body.title, content: req.body.content}, { //if no title parameter, the replacement will have no title
    overwrite: true},
    (err, article)=>{
      if (!err) {
        res.send("Successfully updated the article.");
      } else {
        console.error(err);
        res.send("Error: " + err)
      }
    }
  );
})
.patch((req, res)=>{
  // updates specific fields
  // U IN CRUD
  // Article.updateOne({conditions: }, {$set: {field name: update, field name: update}}, (err, updatedArticle)=>{})
  Article.updateOne({title:req.params.articleTitle},{$set: req.body},(err, updatedArticle)=>{
    if (!err) {
      res.send("Successfully updated the article.");
    } else {
      res.send(err);
    }
  })
})
.delete((req, res)=>{
  Article.deleteOne({title:req.params.articleTitle},(err, deletedArticle)=>{
if (!err) {
  res.send("Successfully deleted the article.");
} else {
  res.send(err)
}
});
});

app.listen(3000, ()=>{
  console.log("Server started on port: 3000");
})

// Remember a RESTful API uses GET, POST, PUT, PATCH, DELETE
