import React, { Fragment } from 'react'

import NumberClientsChart from '../../components/admindash/NumberClientsChart';
import NumberClinicsChart from '../../components/admindash/NumberClinicsChart';
import RevenuesChart from '../../components/admindash/RevenuesChart';
export default function Charts() {



    return (
        <Fragment>
            <div className="container charts mt-5">
                <h3 className="mb-4">Dashboard Charts</h3>
                <div className="row g-4">

                    <NumberClientsChart />

                    <hr />
                    <NumberClinicsChart />
                    <hr />
                    <RevenuesChart />
                </div>
            </div>
        </Fragment>
    )
}
