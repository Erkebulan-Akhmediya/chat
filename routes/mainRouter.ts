import { Router, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import auth from '../middleware/auth'
import Users from '../models/Users'

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

export default mainRouter