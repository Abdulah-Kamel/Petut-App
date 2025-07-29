import React, { Fragment } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function RevenuesChart() {
    // الأرباح شهريًا
    const revenueData = [
        { month: 'Jan', revenue: 750 },
        { month: 'Feb', revenue: 1000 },
        { month: 'Mar', revenue: 1500 },
        { month: 'Apr', revenue: 1000 },
        { month: 'May', revenue: 900 },
        { month: 'Jun', revenue: 2000 },
        { month: 'Jun', revenue: 800 },
        { month: 'Jun', revenue: 1100 },
        { month: 'Jun', revenue: 1200 },
        { month: 'Jun', revenue: 2000 },
        { month: 'Jun', revenue: 2500 },
        { month: 'Jun', revenue: 1900 },
    ];
    return (
        <Fragment>
            <div className="col-md-12 mb-4">
                <h6>Revenues per month</h6>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#D9A741" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    )
}
