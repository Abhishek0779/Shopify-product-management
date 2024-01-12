import { useState, useEffect } from 'react'
import Datatable from '../components/childComponents/Datatable'

function MainDashboard () {
  const [token, setToken] = useState('')
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setToken(localStorage.getItem('access_token'))
    }
  }, [])

  return <Datatable token={token} />
}

export default MainDashboard
