import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token
    const tokenSecret: any = process.env.TOKEN_SECRET

    if (!token) {
        res.redirect('/sign-in')
        return
    }

    const decodedToken = jwt.verify(token, tokenSecret)
    const userData = decodedToken.split(' ')
    req.body.user = {
        _id: userData[4].slice(10, userData[4].length-4),
        username: userData[7].slice(1, userData[7].length-3),
        password: userData[10].slice(1, userData[10].length-3),
    }

    next()
}

export default auth