"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
const app_1 = __importDefault(require("./app"));
const app = new app_1.default();
app.addRouter('/', authRouter_1.default);
app.addRouter('/', mainRouter_1.default);
app.start();
