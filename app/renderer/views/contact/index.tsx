import React from 'react'
import { useNavigate } from 'react-router'

function contact() {
  const navigate = useNavigate()

  const goback = () => {
    navigate(-1)
  }

  return (
    <div>
      <h1>contact</h1>
      <a onClick={goback}>返回</a>
    </div>
  )
}

export default contact
