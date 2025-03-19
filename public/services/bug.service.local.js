import { utilServiceLocal } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugsDB'

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
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      bugs = bugs.filter((bug) => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
      bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
    }

    return bugs
  })
}

function getById(bugId) {
  return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug)
  } else {
    return storageService.post(STORAGE_KEY, bug)
  }
}

function _createBugs() {
  // TODO Qustion - how can I make it work with loadFromStorage?
  // The problem is that Node.js don't have loadFromStorage
  // let bugs = utilServiceLocal.readJsonFile('data/bug.json')

  let bugs = utilServiceLocal.loadFromStorage(STORAGE_KEY)

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
  utilServiceLocal.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
  return { txt: '', minSeverity: 0 }
}
