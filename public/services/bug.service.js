import { utilServiceLocal } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BUG_KEY = 'bugsDB'
const BASE_URL = '/api/bug/'

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
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data)
  // .then((bugs) => {
  //   if (filterBy.txt) {
  //     const regExp = new RegExp(filterBy.txt, 'i')
  //     bugs = bugs.filter((bug) => regExp.test(bug.title))
  //   }

  //   if (filterBy.minSeverity) {
  //     bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
  //   }

  //   return bugs
  // })
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data)
  // .then((bug) => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function save(bug) {
  const url = BASE_URL
  const method = bug._id ? 'put' : 'post'

  return axios[method](url, bug)
    .then((res) => res.data)
    .catch((err) => {
      console.log('err: ', err)
      throw err
    })

  // let queryParams = `?title=${bug.title}&severity=${bug.severity}`
  // if (bug._id) queryParams += `&_id=${bug._id}`
  // return axios
  //   .get(url + queryParams)
  //   .then((res) => res.data)
  //   .catch((err) => console.log('err: ', err))
}

function getEmptyBug(txt = '', minSeverity = '') {
  return { txt, minSeverity }
}

function getDefaultFilter() {
  return { txt: '', minSeverity: '', pageIdx: undefined }
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
  let bugs = utilServiceLocal.loadFromStorage(BUG_KEY)

  if (bugs && bugs.length > 0) return

  bugs = [
    {
      _id: 'bug001',
      title: 'Login page not loading',
      description: 'The login page keeps showing a blank screen',
      severity: 2,
      createdAt: 1710451200000,
      labels: ['urgent', 'frontend', 'UI']
    },
    {
      _id: 'bug002',
      title: 'Password reset email not sent',
      description: 'Users are not receiving password reset emails',
      severity: 3,
      createdAt: 1710447600000,
      labels: ['backend', 'auth', 'email']
    },
    {
      _id: 'bug003',
      title: 'App crashes on startup',
      description: 'The mobile app crashes immediately after launch',
      severity: 1,
      createdAt: 1710444000000,
      labels: ['critical', 'mobile', 'crash']
    }
  ]
  utilServiceLocal.saveToStorage(BUG_KEY, bugs)
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
