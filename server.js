import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'

import {bugService} from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'


// TODO: the link - http://127.0.0.1:3030/#/bug
// keep going with the cookies
// cookieParser - check the inClass and the video

// inClass - server.js line 83: 
/*

TODO listen to the video and check with chat GPT 

app.get('/cookies', (req, res) => {
    let visitedCount = req.cookies.visitedCount || 0
    visitedCount++
    console.log('visitedCount:', visitedCount)
    res.cookie('visitedCount', visitedCount, { maxAge: 5 * 1000 })
    // console.log('visitedCount:', visitedCount)
    res.send('Hello Puki')
})

*/



const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())

// app.get('/', (req, res) => res.send('Hello there'))


// API for Bugs CRUDL

// Read
app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot load bugs')
    })
})

// Create / Edit
app.get('/api/bug/save', (req, res) => {
    console.log('req.query: ',req.query)
  const bugToSave = {
    _id: req.query._id,
    title: req.query.title,
    severity: +req.query.severity
  }

  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(500).send('Cannot save bug')
    })
})

// Get / Read by id
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

  let visitedBugCount = req.cookies.visitedBugCount || 0
  let visitedBugs = req.cookies.visitedBugs || []

  if(visitedBugCount >= 3){
    // loggerService.error('Cannot save bug')
    return res.status(403).send('Usage limit reached! Please try again later.')
  }

  if(visitedBugs.length >= 3){
    return res.status(401).send('Wait for a bit')
  }

  bugService
    .getById(bugId)
    .then((bug) =>{
        visitedBugCount++
        res.cookie('visitedBugCount', visitedBugCount,{maxAge: 10 * 1000} )
      
        if(!visitedBugs.includes(bugId)){
           visitedBugs.unshift(bugId)
           res.cookie('visitedBugs', visitedBugs, {maxAge: 7 * 1000})
       }
        
        // console.log('visitedBugCount: ',visitedBugCount)
        console.log('User visited at the following bugs: ',visitedBugs)
        res.send(bug)
    
})
    .catch((err) => {
      loggerService.error('Cannot get bug', err)
      res.status(500).send('Cannot load bug')
    })
})

// Remove / Delete
app.get('/api/bug/:bugId/remove', (req, res) => {
  const { bugId } = req.params

  bugService
    .remove(bugId)
    .then(() => res.send('Bug Removed'))
    .catch((err) => {
      loggerService.error('Cannot remove bug', err)
      res.status(500).send('Cannot remove bug')
    })
})


app.get('/api/logs', (req, res) => {
  res.sendFile(process.cwd() + '/logs/backend.log')
})

const port = 3030
app.listen(port, () => console.log(`Server ready at: http://localhost:${port}`))
