import express from 'express'
import{} from ''
import{} from ''
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req,res)=> res.send('Hello there'))
app.listen(3030, ()=> console.log('Server ready at port 3030'))

// API for Bugs CRUDL

app.get('/api/bug', (req, res)=>{})
app.get('/api/bug/save', (req, res)=>{})
app.get('/api/bug/:bugId', (req, res)=>{})
app.get('/api/bug/:bugId/remove', (req, res)=>{})

