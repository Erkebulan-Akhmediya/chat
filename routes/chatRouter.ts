import { Router, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import auth from '../middleware/auth'
import Chats from '../models/Chats'
import Users from '../models/Users'
import GroupChats from '../models/GroupChats'

const chatRouter = Router()
dotenv.config()

chatRouter.get('/chats', auth, async(req: Request, res: Response) => {
    let chats: any = await Chats.find({ participants: req.body.user._id }) || []
    
    for (let i = 0; i < chats.length; i++) {
        chats[i] = chats[i].participants
        let index = chats[i].indexOf(req.body.user._id)
        chats[i].splice(index, 1)
        chats[i] = {
            username: (await Users.findById(chats[i]))?.username,
            id: chats[i],
        }
    }
    

    let groupChats: any = await GroupChats.find({ participants: req.body.user._id }) || []
    
    res.render('chats', { chats: chats, groupChats: groupChats, user: req.body.user })
})

chatRouter.get('/chats/:id', auth, async(req: Request, res: Response) => {
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

chatRouter.get('/new-group-chat', (req: Request, res: Response) => {
    res.render('newGroupChat')
})

chatRouter.post('/new-group-chat', auth, async(req: Request, res: Response) => {
    await GroupChats.create({
        name: req.body.chatName,
        participants: [req.body.user._id],
    })

    res.redirect('/chats')
})

chatRouter.get('/group-chat/:id', auth, async(req: Request, res: Response) => {
    const groupChat = await GroupChats.findById(req.params.id)
    let messages: any = groupChat?.messages || []
    const sender = req.body.user._id
    const receiver = req.params.id

    for (let i = 0; i < messages?.length; i++) {
        messages[i].author = await Users.findById(messages[i].author)
    }

    res.render('groupChat', { 
        groupChat: messages, 
        sender: sender, 
        receiver: receiver 
    })
})

chatRouter.get('/group-chat/:id/add-new-user', async(req: Request, res: Response) => {
    const users = await Users.find()
    res.render('addNewUser', { users: users, id: req.params.id })
})

chatRouter.post('/group-chat/:id/add-new-user/:userID', async(req: Request, res: Response) => {
    await GroupChats.findByIdAndUpdate(req.params.id, {
        $push: { participants: req.params.userID }
    })
    res.redirect(`/group-chat/${req.params.id}/add-new-user`)
})

export default chatRouter