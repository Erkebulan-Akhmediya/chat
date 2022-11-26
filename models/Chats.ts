import { Schema, model } from 'mongoose'

class Message {
    author: string
    message: string

    constructor(author: string, message: string) {
        this.author = author
        this.message = message
    }
}

interface IChats {
    participants: [string, string],
    messages: Message[],
}

const chatSchema = new Schema<IChats>({
    participants: [String],
    messages: [Object],
})

export default model('Chats', chatSchema)