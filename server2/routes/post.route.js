import express from "express";
import { createPost, deletePost, getAllPosts, getOnePost, updatePost, updatePostImage } from "../controllers/post.controller.js";
const Router = express.Router();

Router.get("/posts", getAllPosts);
Router.get("/posts/:id", getOnePost);
Router.post("/posts", createPost);
Router.patch("/posts/:id", updatePost);
Router.delete("/posts/:id", deletePost);
Router.patch("/posts/:id/updateImage", updatePostImage);

export default Router;
