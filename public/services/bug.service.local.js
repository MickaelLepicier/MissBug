// import { utilServiceLocal } from './util.service.js'
import { utilServiceLocal } from '../../services/util.service.js'
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
    return storageService.query(STORAGE_KEY)
    .then(bugs => {

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugs = bugs.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
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
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053"
        }
    ]
    utilServiceLocal.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}