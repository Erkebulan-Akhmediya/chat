"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Users_1 = __importDefault(require("../models/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const authRouter = (0, express_1.Router)();
dotenv.config();
const tokenSecret = process.env.TOKEN_SECRET;
authRouter.get('/sign-up', (req, res) => {
    res.render('signUp');
});
authRouter.post('/sign-up', async (req, res) => {
    await Users_1.default.create({
        username: req.body.username,
        password: req.body.password,
    });
    res.redirect('/sign-up');
});
authRouter.get('/sign-in', (req, res) => {
    res.render('signIn');
});
authRouter.post('/sign-in', async (req, res) => {
    const user = await Users_1.default.findOne({
        username: req.body.username,
        password: req.body.password,
    });
    if (!user) {
        res.redirect('/sign-in');
        return;
    }
    const token = jsonwebtoken_1.default.sign(user.toString(), tokenSecret);
    res.clearCookie('token');
    res.cookie('token', token, { maxAge: 15 * 60 * 1000 });
    res.redirect('/profile');
});
exports.default = authRouter;
