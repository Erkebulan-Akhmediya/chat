import { Schema, model } from 'mongoose'

class Message {
    author: string
    message: string

    constructor(author: string, message: string) {
        this.author = author
        this.message = message
    }
}

interface IGroupChats {
    name: string,
    participants: string[],
    messages: Message[]
}

const groupChatSchema = new Schema<IGroupChats>({
    name: String,
    participants: [String], 
    messages: [Object],
})

export default model('GroupChats', groupChatSchema)