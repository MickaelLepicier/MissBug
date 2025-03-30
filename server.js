import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// App Configuration
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Read
app.get('/api/bug', (req, res) => {
  const queryOption = parseQueryParams(req.query)
// console.log('queryOption: ',queryOption)
  bugService
    .query(queryOption)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot get bugs')
    })
})

function parseQueryParams(queryParams) {
  const filterBy = {
    txt: queryParams.txt || '',
    minSeverity: +queryParams.minSeverity || 0,
    labels: queryParams.labels || []
  }

  const sortBy = {
    sortField: queryParams.sortField || '',
    sortDir: +queryParams.sortDir || 1
  }

  const pagination = {
    pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
    pageSize: +queryParams.pageSize || 3
  }

  return { filterBy, sortBy, pagination }
}

// Get / Read by id
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

	const { visitedBugCount = [] } = req.cookies

  if (visitedBugCount.length >= 3) {
    return res.status(403).send('Usage limit reached! Please try again in a moment.')
  }

  if (!visitedBugCount.includes(bugId)) {
    visitedBugCount.unshift(bugId)
  }
  
  res.cookie('visitedBugCount', visitedBugCount, { maxAge: 7 * 1000 })
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot get bug', err)
      res.status(400).send('Cannot get bug')
    })
})

// Create
app.post('/api/bug', (req, res) => {
  loggerService.debug('req.query', req.query)

  const { title, description, severity, labels } = req.body

  if (!title || severity === undefined) return res.status(400).send('Missing required fields')

  const bug = {
    title,
    description,
    severity: +severity || 1,
    labels: labels || []
  }

  bugService
    .save(bug)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot add bug', err)
      res.status(400).send('Cannot add bug')
    })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
  loggerService.debug('req.query', req.query)

  const { title, description, severity, labels, _id } = req.body

  if (!_id || !title || severity === undefined) res.status(400).send('Missing required field')

  const bugToSave = {
    _id,
    title,
    description,
    severity: +severity || 1,
    labels: labels || []
  }

  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot update bug', err)
      res.status(400).send('Cannot update bug')
    })
})

// Remove / Delete
app.delete('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

  bugService
    .remove(bugId)
    .then(() => {
      loggerService.info(`Bug ${bugId} removed`)
      res.send('Bug Removed')
    })
    .catch((err) => {
      loggerService.error('Cannot remove bug', err)
      res.status(400).send('Cannot remove bug')
    })
})

// log - backend
app.get('/api/logs', (req, res) => {
  res.sendFile(process.cwd() + '/logs/backend.log')
})

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () => console.log(`Server ready at: http://127.0.0.1:${port}`))
