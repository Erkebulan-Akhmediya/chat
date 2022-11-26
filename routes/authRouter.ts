import { Router, Request, Response } from 'express'
import Users from '../models/Users'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

const authRouter = Router()
dotenv.config()
const tokenSecret: any = process.env.TOKEN_SECRET

authRouter.get('/sign-up', (req: Request, res: Response) => {
    res.render('signUp')
})

authRouter.post('/sign-up', async(req: Request, res: Response) => {
    await Users.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.redirect('/sign-up')
})

authRouter.get('/sign-in', (req: Request, res: Response) => {
    res.render('signIn')
})

authRouter.post('/sign-in', async(req: Request, res: Response) => {
    const user = await Users.findOne({
        username: req.body.username,
        password: req.body.password,
    })
    
    if (!user) {
        res.redirect('/sign-in')
        return
    } 

    const token = jwt.sign(user.toString(), tokenSecret)
    res.clearCookie('token')
    res.cookie('token', token, { maxAge: 15 * 60 * 1000 })

    res.redirect('/profile')
})

export default authRouter