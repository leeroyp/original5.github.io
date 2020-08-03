// App.js
import React from 'react'
import { useAlert } from 'react-alert'

const Alert = () => {
  const alert = useAlert()

  return (

    <button className="joinin-btn"
      onClick={(e) => {
        alert.show('You have successfully joined!')
      }}
    >
      Join In
    </button>
  )
}

export default Alert