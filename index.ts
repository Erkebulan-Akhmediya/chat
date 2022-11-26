import authRouter from './routes/authRouter'
import mainRouter from './routes/mainRouter'
import App from './app'

const app = new App()
app.addRouter('/', authRouter)
app.addRouter('/', mainRouter)
app.start()