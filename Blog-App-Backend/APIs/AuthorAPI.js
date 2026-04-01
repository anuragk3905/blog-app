import express from "express";
import { authenticate, register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { UserTypeModel } from "../models/UserModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import {upload} from '../config/multer.js';
export const authorRoute = express.Router();

//Register author (public)
authorRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      let userObj = req.body;

      //  Step 1: upload image to cloudinary from memoryStorage (if exists)
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // Step 2: call existing register()
      const newUserObj = await register({
        ...userObj,
        role: "AUTHOR",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "author created",
        payload: newUserObj,
      });
    } catch (err) {
      // Step 3: rollback
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err); // send to your error middleware
    }
  },
);
//Create article (protected route)
authorRoute.post('/articles', verifyToken("AUTHOR"), async(req,res)=>{
    //get article from req
    let article = req.body;
    //create article document
    let newArticleDoc = new ArticleModel(article);
    //save
    let createdArticleDoc = await newArticleDoc.save();
    //send res
    res.status(201).json({message : "article created", payload : createdArticleDoc})
})
//Read articles of author (protected route)
authorRoute.get('/articles/:authorId', verifyToken("AUTHOR"), async(req,res)=>{
    //get author id
    let authorId = req.params.authorId;
    //read articles by this author
    let articles = await ArticleModel.find({author : authorId, isArticleActive : true}).populate("author","firstName email ")
    //send res
    res.status(200).json({message : "articles", payload : articles})
})
//Edit article (protected route)
authorRoute.put('/articles', verifyToken("AUTHOR"), async(req,res)=>{
    //get modified article from req
    let {author, articleId, title, category, content} = req.body;
    //find article
    let articleOfDb = await ArticleModel.findOne({_id : articleId, author : author});
    if(!articleOfDb){
        return res.status(401).json({message : "Article not found"});
    }
    //update the article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId, {
        $set : {title,category,content}
    },
    {new : true}
)
    //send res
    return res.status(200).json({message : "articles", payload : updatedArticle})
})
//Delete(soft delete) article (protected route)
authorRoute.patch('/articles/:articleId/author/:authorId', verifyToken("AUTHOR"), async (req,res) => {
    //get the article id from the url
    let articleId = req.params.articleId
    let authorId = req.params.authorId
    const { isArticleActive } = req.body;

    const article = await ArticleModel.findById(articleId)
    if(!article){
        return res.status(404).json({message: "Article not found."})
    }

    // AUTHOR can only modify their own articles
    if(req.user.role === "AUTHOR" &&  article.author.toString() !== req.user.userId){
        return res.status(403).json({message: "Forbidden. You can modify only your articles."})
    }

    // already in requested state
    if(article.isArticleActive === isArticleActive){
        return res.status(400).json({message : `Article is already ${isArticleActive ? "active" : "deleted"}`})
    }

    //find the article and update the isArticleActive field
    article.isArticleActive = isArticleActive
    await article.save()

    //send res
    res.status(200).json({message:`Article ${isArticleActive ? "restored" : "deleted"}`, payload : article})
})