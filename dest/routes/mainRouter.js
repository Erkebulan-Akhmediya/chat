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
const dotenv = __importStar(require("dotenv"));
const Chats_1 = __importDefault(require("../models/Chats"));
const Users_1 = __importDefault(require("../models/Users"));
const auth_1 = __importDefault(require("../middleware/auth"));
const mainRouter = (0, express_1.Router)();
dotenv.config();
mainRouter.get('/', (req, res) => {
    res.send('hi');
});
mainRouter.get('/profile', auth_1.default, (req, res) => {
    const user = req.body.user;
    res.send(user);
});
mainRouter.get('/users', auth_1.default, async (req, res) => {
    const users = await Users_1.default.find({ _id: { $ne: req.body.user._id } });
    res.render('users', { users: users });
});
mainRouter.get('/chats', auth_1.default, async (req, res) => {
    let chats = await Chats_1.default.find({ participants: req.body.user._id }) || [];
    res.render('chats', { chats: chats });
});
mainRouter.get('/chats/:id', auth_1.default, async (req, res) => {
    const sender = req.body.user._id;
    const receiver = req.params.id;
    const messages = await Chats_1.default.findOne({ $and: [{ participants: sender }, { participants: receiver }] }, { messages: 1 });
    let messagesArray = messages?.messages || [];
    for (let i = 0; i < messagesArray?.length; i++) {
        messagesArray[i].author = await Users_1.default.findOne({ _id: messagesArray[i].author }, { _id: 0, username: 1 });
        messagesArray[i].author = messagesArray[i].author.username;
    }
    res.render('chat', { sender: sender, receiver: receiver, messages: messagesArray });
});
exports.default = mainRouter;
