import fs from 'fs'
import { utilService } from './util.service'
import { resolve } from 'path'

// maybe I need to put the users on let instead of const
const users = utilService.readJsonFile('data/user.json')
console.log('users: ', users)

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  add
}

function query() {
  const usersToReturn = users.map((user) => ({
    _id: user._id,
    fullname: user.fullname
  }))
  return Promise.resolve(usersToReturn)
}

function getById(userId) {
  let user = user.find((user) => user._id === userId)
  if (!user) return Promise.reject('User not found!')

  // breakpoint - break the address not to effect the usersDB
  user = { ...user }
  delete user.password

  return Promise.resolve(user)
}

function getByUsername(username) {
  const user = users.find((user) => user.username === username)
  return Promise.resolve(user)
}

function remove(userId) {
  // maybe I need to put the users on let instead of const
  users = users.filter((user) => user._id !== userId)
  return _saveUsersToFile()
}

function add(user) {
  return getByUsername(user.username).then((existingUser) => {
    if (!existingUser) return Promise.reject('Username taken')

    user._id = utilService.makeId()
    users.push(user)

    return _saveUsersToFile().then(() => {
      user = { ...user }
      delete user.password
      return user
    })
  })
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const usersStr = JSON.stringify(users, null, 2)
    fs.writeFile('data/user.json', usersStr, (err) => {
      if (err) {
        return console.log(err)
      }
      resolve()
    })
  })
}
