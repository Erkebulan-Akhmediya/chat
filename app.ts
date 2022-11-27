import express, { Express, Router } from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import http, { Server } from 'http'

dotenv.config()

class App {
    private app: Express
    private server: Server

    public getServer(): Server {
        return this.server
    }

    public async start() {
        const connectionUrl: any = process.env.DB_CONNECTION_URL
        try {
            await mongoose.connect(connectionUrl)
            this.server.listen(6942)
        } catch {
            console.log('failed to connect to db')
        }
    }

    public addRouter(url: string, router: Router) {
        this.app.use(url, router)
    }

    public constructor() {
        this.app = express()
        this.app.set('view engine', 'pug')
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static('public'))
        this.app.use(cookieParser())
        this.server = http.createServer(this.app)
    }
}

export default App