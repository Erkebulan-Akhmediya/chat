import authRouter from './routes/authRouter'
import mainRouter from './routes/mainRouter'
import App from './app'
import { Server, Socket } from 'socket.io'
import Chats from './models/Chats'
import Users from './models/Users'

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
})

app.addRouter('/', authRouter)
app.addRouter('/', mainRouter)
app.start()