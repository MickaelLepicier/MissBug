import { authService } from '../services/auth.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

export function AppHeader({ loggedinUser, setLoggedinUser }) {
  const navigate = useNavigate()

  function onLogout() {
    authService
      .logout()
      .then(() => {
        setLoggedinUser(null)
        navigate('/auth')
      })
      .catch((err) => {
        console.log(err)
        showErrorMsg(`Couldn't logout`)
      })
  }

  return (
    <header className="app-header main-content single-row">
      <h1>Miss Bug</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/bug">Bugs</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      {!loggedinUser ? (
        <NavLink to="/auth">Login</NavLink>
      ) : (
        <div className="user-signup">
          <Link to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</Link>
          <button onClick={onLogout}>logout</button>
        </div>
      )}
    </header>
  )
}
