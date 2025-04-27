import express from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/login", login);
Router.post("/register", register);
Router.get("/me", me);
Router.post("/logout", logout);

export default Router;
