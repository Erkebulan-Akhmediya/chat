import { Schema, model } from 'mongoose'

interface IUsers {
    username: string,
    password: string,
}

const userSchema = new Schema<IUsers>({
    username: String,
    password: String,
})

export default model('Users', userSchema)