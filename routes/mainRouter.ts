import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import Chats from '../models/Chats'
import Users from '../models/Users'
import auth from '../middleware/auth'

const mainRouter = Router()
dotenv.config()
const tokenSecret: any = process.env.TOKEN_SECRET

mainRouter.get('/', (req: Request, res: Response) => {
    res.send('hi')
})

mainRouter.get('/profile', auth, (req: Request, res: Response) => {
    const user = req.body.user
    res.send(user)
})

mainRouter.get('/chats', auth, async(req: Request, res: Response) => {
    let users = await Users.find({ _id: { $ne: req.body.user._id } })
    res.render('chats', { users: users })
})

mainRouter.get('/chat', (req: Request, res: Response) => {
    res.render('chat')
})

export default mainRouter