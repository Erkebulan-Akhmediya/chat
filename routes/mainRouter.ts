import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import Chats from '../models/Chats'

const mainRouter = Router()
dotenv.config()
const tokenSecret: any = process.env.TOKEN_SECRET

mainRouter.get('/', (req: Request, res: Response) => {
    res.send('hi')
})

mainRouter.get('/profile', (req: Request, res: Response) => {
    const decodedToken = jwt.verify(req.cookies.token, tokenSecret)
    res.send(decodedToken)
})

mainRouter.get('/chats', (req: Request, res: Response) => {
    res.render('chats')
})

export default mainRouter