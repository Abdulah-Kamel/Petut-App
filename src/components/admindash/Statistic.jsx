import React, { Fragment } from 'react'

export default function Statistic({ title, count, icon }) {
  return (
    <Fragment>
      <div className="clinic p-4 col-5 d-flex align-items-center justify-content-between" style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
        <div className="left">
          <h1 className='fw-bold fs-5'>{title}</h1>
          <h1 className='mb-0'>{count}</h1>
        </div>
        <div className="right p-5 bg-light rounded-circle">
          {icon}
        </div>
      </div>
    </Fragment>
  )
}
