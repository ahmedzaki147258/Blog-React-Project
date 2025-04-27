import express from "express";
import { updateUser, updateUserImage, updateUserPassword } from "../controllers/user.controller.js";
const Router = express.Router();

Router.patch("/users/:id", updateUser);
Router.patch("/users/:id/updateImage", updateUserImage);
Router.patch("/users/:id/updatePassword", updateUserPassword);

export default Router;
