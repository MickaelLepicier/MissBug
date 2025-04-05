import { authService } from '../services/auth.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

const { useState } = React
const { useNavigate } = ReactRouter

export function LoginSignup({ setLoggedinUser }) {
  const [isSignup, setIsSignup] = useState(false)
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

  const navigate = useNavigate()

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials((prevVreds = { ...prevVreds, [field]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    isSignup ? signup(credentials) : login(credentials)
  }

  function signup(credentials) {
    authService
      .signup(credentials)
      .then((user) => {
        setLoggedinUser(user)
        showSuccessMsg('Signed in successfully')
        navigate('/bug')
      })
      .catch((err) => {
        console.log('err: ', err)
        showErrorMsg(`Couldn't signup...`)
      })
  }

  function login(credentials) {
    authService
      .login(credentials)
      .then((user) => {
        setLoggedinUser(user)
        showSuccessMsg('Logged in Successfully')
        navigate('/bug')
      })
      .catch((err) => {
        console.log('err: ', err)
        showErrorMsg(`Couldn't login`)
      })
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={credentials.username}
          placeholder="Username"
          onChange={handleChange}
          required
          autoFocus
        />

        <input
          type="password"
          name="password"
          value={credentials.password}
          placeholder="Password"
          onChange={handleChange}
          required
          autoComplete="off"
        />

        {isSignup && (
          <input
            type="text"
            name="fullname"
            value={credentials.fullname}
            placeholder="Full name"
            onChange={handleChange}
            required
          />
        )}

        <button>{isSignup ? 'Signup' : 'Login'}</button>
      </form>

      <div className="btns-login">
        <a href="#" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already a member? Login' : 'New user ? Signup here'}
        </a>
      </div>
    </div>
  )
}
