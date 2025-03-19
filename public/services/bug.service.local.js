import { utilServiceLocal } from './util.service.js'
import { storageService } from './async-storage.service.js'

// TODO QUESTION is there a way to succeed without the cors Module?
// and that the BASE_URL will be just '/api/bug/'?

const BUG_KEY = 'bugsDB'
// const BASE_URL = '/api/bug/'
const BASE_URL = 'http://localhost:3030/api/bug/'

_createBugs()

export const bugServiceLocal = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter
}

function query(filterBy) {
  return storageService.query(STORAGE_KEY).then((bugs) => {
    if (filterBy.title) {
      const regExp = new RegExp(filterBy.txt, 'i')
      bugs = bugs.filter((bug) => regExp.test(bug.title))
    }

    if (filterBy.severity) {
      bugs = bugs.filter((bug) => bug.severity >= filterBy.severity)
    }

    return bugs
  })
}

function getById(bugId) {
  return storageService.get(STORAGE_KEY, bugId).then((bug) => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  // TODO check if everything is working and add the funcions:
  // getEmptyBug & getDefaultFilter & getFilterFromSearchParams

  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug)
  } else {
    return storageService.post(STORAGE_KEY, bug)
  }
}

function _createBugs() {
  // let bugs = utilServiceLocal.readJsonFile('data/bug.json')

  let bugs = utilServiceLocal.loadFromStorage(BUG_KEY)

  if (bugs && bugs.length > 0) return

  bugs = [
    {
      _id: 'BUG12345',
      title: 'Unexpected App Crash',
      description: 'App crashes when clicking the submit button',
      severity: 3,
      createdAt: 1678901234567
    },
    {
      _id: 'X1Y2Z3A4',
      title: 'Login Failure',
      description: 'Users unable to log in with correct credentials',
      severity: 5,
      createdAt: 1689054321789
    },
    {
      _id: '5GD67890',
      title: 'UI Glitch on Mobile',
      description: 'Navbar overlaps content on small screens',
      severity: 2,
      createdAt: 1690123456789
    }
  ]
  utilServiceLocal.saveToStorage(BUG_KEY, bugs)
}

function getDefaultFilter() {
  return { txt: '', minSeverity: 0 }
}

function _setNextPrevBugId(bug) {
  return storageService.query(BUG_KEY).then((bugs) => {
    const bugIdx = bugs.findIndex((currCar) => currCar._id === bug._id)
    const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
    const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
    bug.nextCarId = nextBug._id
    bug.prevCarId = prevBug._id
    return bug
  })
}
