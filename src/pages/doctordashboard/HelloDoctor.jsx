import React, { Fragment } from 'react'
import image from '../../assets/hello-doctor.jpg'
export default function HelloDoctor() {
  return (
    <Fragment>
      <img src={image} alt="Hello Doctor" style={{backgroundSize: 'cover', width: '100%', height: 'calc(100vh - 100px)'}} />
    </Fragment>
  )
}
