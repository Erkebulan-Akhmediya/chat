"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
const chatRouter_1 = __importDefault(require("./routes/chatRouter"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const Chats_1 = __importDefault(require("./models/Chats"));
const GroupChats_1 = __importDefault(require("./models/GroupChats"));
const app = new app_1.default();
const io = new socket_io_1.Server(app.getServer());
io.on('connection', (socket) => {
    socket.on('message', async (message) => {
        const chat = await Chats_1.default.find({
            $and: [{ participants: message.from }, { participants: message.to }]
        });
        if (chat.length == 0) {
            await Chats_1.default.create({
                participants: [message.from, message.to],
                messages: {
                    author: message.from,
                    message: message.message,
                }
            });
        }
        await Chats_1.default.findOneAndUpdate({ $and: [{ participants: message.from }, { participants: message.to }] }, {
            $push: { messages: { author: message.from, message: message.message, } }
        });
        io.emit('message', {});
    });
    socket.on('groupChatMessage', async (message) => {
        await GroupChats_1.default.findByIdAndUpdate(message.to, { $push: { messages: {
                    author: message.from,
                    message: message.message,
                } } });
        io.emit('groupChatMessage', {});
    });
});
app.addRouter('/', authRouter_1.default);
app.addRouter('/', mainRouter_1.default);
app.addRouter('/', chatRouter_1.default);
app.start();
