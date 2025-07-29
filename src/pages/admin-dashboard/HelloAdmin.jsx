import React, { Fragment } from 'react'
import image from '../../assets/hello-admin.jpg'
export default function HelloAdmin() {
  return (
    <Fragment>
      <img src={image} alt="Hello Admin" style={{backgroundSize: 'cover', width: '100%', height: 'calc(100vh - 100px)'}} />
    </Fragment>
  )
}
