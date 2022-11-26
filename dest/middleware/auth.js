"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    const token = req.cookies.token;
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!token) {
        res.redirect('/sign-in');
        return;
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, tokenSecret);
    const userData = decodedToken.split(' ');
    req.body.user = {
        _id: userData[4].slice(10, userData[4].length - 4),
        username: userData[7].slice(1, userData[7].length - 3),
        password: userData[10].slice(1, userData[10].length - 3),
    };
    next();
}
exports.default = auth;
