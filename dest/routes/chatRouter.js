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
const auth_1 = __importDefault(require("../middleware/auth"));
const Chats_1 = __importDefault(require("../models/Chats"));
const Users_1 = __importDefault(require("../models/Users"));
const GroupChats_1 = __importDefault(require("../models/GroupChats"));
const chatRouter = (0, express_1.Router)();
dotenv.config();
chatRouter.get('/chats', auth_1.default, async (req, res) => {
    let chats = await Chats_1.default.find({ participants: req.body.user._id }) || [];
    for (let i = 0; i < chats.length; i++) {
        chats[i] = chats[i].participants;
        let index = chats[i].indexOf(req.body.user._id);
        chats[i].splice(index, 1);
        chats[i] = {
            username: (await Users_1.default.findById(chats[i]))?.username,
            id: chats[i],
        };
    }
    let groupChats = await GroupChats_1.default.find({ participants: req.body.user._id }) || [];
    res.render('chats', { chats: chats, groupChats: groupChats });
});
chatRouter.get('/chats/:id', auth_1.default, async (req, res) => {
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
chatRouter.get('/new-group-chat', (req, res) => {
    res.render('newGroupChat');
});
chatRouter.post('/new-group-chat', auth_1.default, async (req, res) => {
    await GroupChats_1.default.create({
        name: req.body.chatName,
        participants: [req.body.user._id],
    });
    res.redirect('/chats');
});
chatRouter.get('/group-chat/:id', auth_1.default, async (req, res) => {
    const groupChat = await GroupChats_1.default.findById(req.params.id);
    let messages = groupChat?.messages;
    const sender = req.body.user._id;
    const receiver = req.params.id;
    for (let i = 0; i < messages?.length; i++) {
        messages[i].author = await Users_1.default.findById(messages[i].author);
    }
    res.render('groupChat', {
        groupChat: messages,
        sender: sender,
        receiver: receiver
    });
});
chatRouter.get('/group-chat/:id/add-new-user', async (req, res) => {
    const users = await Users_1.default.find();
    res.render('addNewUser', { users: users, id: req.params.id });
});
chatRouter.post('/group-chat/:id/add-new-user/:userID', async (req, res) => {
    await GroupChats_1.default.findByIdAndUpdate(req.params.id, {
        $push: { participants: req.params.userID }
    });
    res.redirect(`/group-chat/${req.params.id}/add-new-user`);
});
exports.default = chatRouter;
