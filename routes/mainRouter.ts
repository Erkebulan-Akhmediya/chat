import { Router, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import Chats from '../models/Chats'
import Users from '../models/Users'
import auth from '../middleware/auth'

const mainRouter = Router()
dotenv.config()

mainRouter.get('/', (req: Request, res: Response) => {
    res.send('hi')
})

mainRouter.get('/profile', auth, (req: Request, res: Response) => {
    const user = req.body.user
    res.send(user)
})

mainRouter.get('/users', auth, async(req: Request, res: Response) => {
    const users = await Users.find({ _id: { $ne: req.body.user._id } })
    res.render('users', { users: users })
})

mainRouter.get('/chats', auth, async(req: Request, res: Response) => {
    let chats = await Chats.find({ participants: req.body.user._id }) || []
    res.render('chats', { chats: chats })
})

mainRouter.get('/chats/:id', auth, async(req: Request, res: Response) => {
    const sender = req.body.user._id
    const receiver = req.params.id
    const messages = await Chats.findOne({ $and: [{ participants: sender }, { participants: receiver }] }, { messages: 1 })
    let messagesArray: any = messages?.messages || []

    for (let i = 0; i < messagesArray?.length; i++) {
        messagesArray[i].author = await Users.findOne({ _id: messagesArray[i].author }, { _id: 0, username: 1 })
        messagesArray[i].author = messagesArray[i].author.username
    }

    res.render('chat', { sender: sender, receiver: receiver, messages: messagesArray })
})

export default mainRouter