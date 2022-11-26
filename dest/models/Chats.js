"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Message {
    author;
    message;
    constructor(author, message) {
        this.author = author;
        this.message = message;
    }
}
const chatSchema = new mongoose_1.Schema({
    participants: [String],
    messages: [Object],
});
exports.default = (0, mongoose_1.model)('Chats', chatSchema);
