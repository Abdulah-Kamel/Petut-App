import React, { Fragment } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function NumberClientsChart() {
    const clientsData = [
        { month: 'Jan', clients: 20 },
        { month: 'Feb', clients: 35 },
        { month: 'Mar', clients: 28 },
        { month: 'Apr', clients: 40 },
        { month: 'May', clients: 32 },
        { month: 'Jun', clients: 45 },
        { month: 'July', clients: 50 },
        { month: 'Aug', clients: 55 },
        { month: 'May', clients: 40 },
        { month: 'aug', clients: 32 },
        { month: 'aag', clients: 45 },
        { month: 'sept', clients: 50 },
    ];
    return (
        <Fragment>
            <div className="col-md-12 mb-4">
                <h6>Number of clients per month</h6>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={clientsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip/>
                        <Bar dataKey="clients" fill="#D9A741" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    )
}
