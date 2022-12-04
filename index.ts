import authRouter from './routes/authRouter'
import mainRouter from './routes/mainRouter'
import chatRouter from './routes/chatRouter'
import App from './app'
import { Server, Socket } from 'socket.io'
import Chats from './models/Chats'
import GroupChats from './models/GroupChats'

const app = new App()
const io = new Server(app.getServer())

io.on('connection', (socket: Socket) => {
    socket.on('message', async(message) => {
        const chat = await Chats.find({ 
            $and: [{ participants: message.from }, { participants: message.to }] 
        })

        if (chat.length == 0) {
            await Chats.create({
                participants: [message.from, message.to],
                messages: {
                    author: message.from,
                    message: message.message,
                }
            })
        }

        await Chats.findOneAndUpdate({ $and: [{ participants: message.from }, { participants: message.to }] }, { 
            $push: { messages: { author: message.from, message: message.message, } } 
        })

        io.emit('message', {})
    })

    socket.on('groupChatMessage', async(message) => {
        await GroupChats.findByIdAndUpdate(message.to, { $push: { messages: {
            author: message.from, 
            message: message.message,
        } } })
        io.emit('groupChatMessage', {})
    })
})

app.addRouter('/', authRouter)
app.addRouter('/', mainRouter)
app.addRouter('/', chatRouter)
app.start()