import express from "express";
import { authenticate, register } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkUser } from "../middlewares/checkUser.js";
import { ArticleModel } from "../models/ArticleModel.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import {upload} from '../config/multer.js';
export const userRoute = express.Router();

//Register user
userRoute.post(
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
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
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
//Read all articles (protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  //read articles by this author
  let articles = await ArticleModel.find()
  .populate(
    "comments.user",
    "firstName email",
  )
  //send res
  res.status(200).json({ message: "articles", payload: articles });
});
//Add comment to an article (protected route)
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  let { userId, articleId, comment } = req.body;

  // check user(req.user)
  if (userId != req.user.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  //find the article and update
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $push: { comments: { user: userId, comment: comment } },
    },
    { new: true, runValidators: true },
  ).populate(
    "comments.user",
    "firstName email",
  )

  // if article not found
  if (!updatedArticle) {
    return res.status(404).json({ message: "Article not found" });
  }

  return res
    .status(200)
    .json({ message: "comment added successfully", payload: updatedArticle });
});
