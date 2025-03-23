import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())

// Read
app.get('/api/bug', (req, res) => {
  const filterBy = {
    txt: req.query.txt || '',
    minSeverity: +req.query.minSeverity || 0
  }

  bugService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot load bugs')
    })
})

// Create / Edit
app.get('/api/bug/save', (req, res) => {
  loggerService.debug('req.query', req.query)

  console.log('req.query: ', req.query)

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

  let visitedBugCount = req.cookies.visitedBugCount || []

  if (visitedBugCount.length >= 3) {
    return res.status(403).send('Usage limit reached! Please try again in a moment.')
  }

  if (!visitedBugCount.includes(bugId)) {
    visitedBugCount.unshift(bugId)
    res.cookie('visitedBugCount', visitedBugCount, { maxAge: 7 * 1000 })
  }

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
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
app.listen(port, () => console.log(`Server ready at: http://127.0.0.1:${port}`))
