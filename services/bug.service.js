import { utilService } from './util.service.js'
import fs from 'fs'

export const bugService = {
  query,
  getById,
  remove,
  save
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(queryOptions) {
  const { filterBy, sortBy, pagination } = queryOptions
  let bugsToReturn = [...bugs]

  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    bugsToReturn = bugsToReturn.filter((bug) => regExp.test(bug.title))
  }

  if (filterBy.minSeverity) {
    bugsToReturn = bugsToReturn.filter((bug) => bug.severity >= filterBy.minSeverity)
  }

  if (filterBy.labels && filterBy.labels.length > 0) {
    bugsToReturn = bugsToReturn.filter((bug) => {
      filterBy.labels.some((label) => bug?.labels?.includes(label))
    })
  }

  if (sortBy.sortField === 'severity' || sortBy.sortField === 'createdAt') {
    const { sortField } = sortBy

    bugsToReturn.sort((bug1, bug2) => {
      return (bug1[sortField] - bug2[sortField]) * sortBy.sortDir
    })
  } else if (sortBy.sortField === 'title') {
    bugsToReturn.sort((bug1, bug2) => {
      return bug1.title.localeCompare(bug2.title) * sortBy.sortDir
    })
  }

  //   const isDescending = filterBy.sortDir === true || filterBy.sortDir === 'true'

  //   if (filterBy.sortBy === 'title') {
  //     bugsToReturn = bugsToReturn.sort((a, b) => {
  //       return isDescending
  //         ? b.title.localeCompare(a.title)
  //         : a.title.localeCompare(b.title)
  //     })
  //   }

  //   if (filterBy.sortBy === 'severity' || filterBy.sortBy === 'createdAt') {
  //     const type = filterBy.sortBy
  //     bugsToReturn = bugsToReturn.sort((a, b) => {
  //       return isDescending ? b[type] - a[type] : a[type] - b[type]
  //     })
  //   }

  if (filterBy.pageIdx !== undefined) {
    const { pageIdx, pageSize } = pagination

    const startIdx = pageIdx * pageSize
    bugsToReturn = bugsToReturn.slice(startIdx, startIdx + pageSize)
  }

  return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
  if (bugIdx === -1) return Promise.reject('Cannot remove bug - ' + bugId)
  bugs.splice(bugIdx, 1)
  return _saveBugsToFile()
}

function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex((b) => b._id === bug._id)
    bugs[idx] = { ...bugs[idx], ...bug }
  } else {
    bug._id = utilService.makeId()
    bug.createdAt = Date.now()
    bugs.unshift(bug)
  }

  return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile('data/bug.json', data, (err) => {
      if (err) {
        loggerService.error('Cannot write to bugs file', err)
        return reject(err)
      }
      console.log('The file was saved!')
      resolve()
    })
  })
}
