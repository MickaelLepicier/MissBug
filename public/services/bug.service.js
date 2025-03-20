import { utilServiceLocal } from './util.service.js'
import { storageService } from './async-storage.service.js'


const BUG_KEY = 'bugsDB'
const BASE_URL = '/api/bug/'
// const BASE_URL = 'http://localhost:3030/api/bug/'

_createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
  getEmptyBug,
  getDefaultFilter,
  getFilterFromSearchParams
}

function query(filterBy) {
  return axios
    .get(BASE_URL)
    .then((res) => res.data)
    .then((bugs) => {

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
  console.log('bugId: ',bugId)
  
  return axios
    .get(BASE_URL + bugId)
    .then((res) => res.data)
    .then((bug) => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return axios.get(BASE_URL + bugId + '/remove').then((res) => res.data)
}

function save(bug) {
  const url = BASE_URL + 'save'
  let queryParams = `?title=${bug.title}&severity=${bug.severity}`
  if (bug._id) queryParams += `&_id=${bug._id}`
  return axios
    .get(url + queryParams)
    .then((res) => res.data)
    .catch((err) => console.log('err: ', err))
}

function getEmptyBug(txt = '', minSeverity = '') {
  return { txt, minSeverity }
}

function getDefaultFilter() {
  return { txt: '', minSeverity: '' }
}

function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  const minSeverity = searchParams.get('minSeverity') || ''
  return {
    txt,
    minSeverity
  }
}

function _createBugs() {
  // TODO Qustion - how can I make it work with loadFromStorage?
  // The problem is that Node.js don't have loadFromStorage
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

// function getDefaultFilter() {
//   return { txt: '', minSeverity: 0 }
// }

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
