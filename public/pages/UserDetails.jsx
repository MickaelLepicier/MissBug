import { userService } from '../services/user.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function UserDetails() {
  const [user, setUser] = useState(null)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [params.userId])

  function loadUser() {
    userService
      .getById(params.userId)
      .then(setUser)
      .catch((err) => {
        console.log('err: ', err)
        navigate('/')
      })
  }

  function onBack() {
    navigate('/')
  }

  if (!user) return <div>Loading...</div>

  return (
    <section className="user-details">
      <h1>User {user.fullname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore dolore
        voluptatum expedita placeat et ipsam, hic unde fuga, quam libero quia
        reprehenderit aspernatur tenetur minus ullam adipisci sapiente sequi
        voluptas.
      </p>
      <button onClick={onBack}>Back</button>
    </section>
  )
}
