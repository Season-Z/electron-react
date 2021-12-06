import React from 'react'
import { useNavigate } from 'react-router'

function Main() {
  const navigate = useNavigate()

  const gotoContact = () => {
    navigate('/contact')
  }

  return (
    <div>
      <h1>main</h1>
      <a onClick={gotoContact}>前往contact</a>
    </div>
  )
}

export default Main
