import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  const goto = () => {
    navigate('/main')
  }

  return (
    <div>
      <div>NotFound</div>
      <button onClick={goto}>go to main</button>
    </div>
  )
}

export default NotFound
