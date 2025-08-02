import React, { Fragment } from 'react'
import image from '../../assets/petut.png'
export default function HelloDoctor() {
  return (
    <Fragment>
      <img src={image} alt="Hello Doctor" style={{backgroundSize: 'cover', width: '580px', height: '580px',textAlign: 'center' ,marginLeft: 'auto', marginRight: 'auto'}} />
    </Fragment>
  )
}
