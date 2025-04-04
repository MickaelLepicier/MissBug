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
  getLabels,
  getFilterFromSearchParams
}




function query(queryOptions) {
  return axios.get(BASE_URL, { params: queryOptions }).then((res) => res.data)
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId)
}

function save(bug) {
  const method = bug._id ? 'put' : 'post'
  const bugId = bug._id || ''

  return axios[method](BASE_URL + bugId, bug)
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
      labels: ['urgent', 'frontend']
    },
    {
      _id: 'bug003',
      title: 'App crashes on startup',
      description: 'The mobile app crashes immediately after launch',
      severity: 3,
      createdAt: 1710444000000,
      labels: ['critical', 'backend', 'fixed']
    },
    {
      _id: 'bug004',
      title: 'Data not saving',
      description: 'Changes made to user profile are not saved',
      severity: 4,
      createdAt: 1710440400000,
      labels: ['critical', 'in progress']
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

function getLabels() {
  return ['backend', 'frontend', 'critical', 'fixed', 'in progress', 'stuck']
}
