import React, { Fragment } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function NumberClinicsChart() {
    // عدد العيادات حسب التخصص
    const clinicsData = [
        { name: 'Dermatology', value: 5 },
        { name: 'Cardiology', value: 8 },
        { name: 'Dentistry', value: 6 },
        { name: 'Pediatrics', value: 4 },
    ];
    const COLORS = ['#D9A741', '#8884d8', '#82ca9d', '#FF8042'];

    return (
        <Fragment>
            <div className="col-md-12 mx-auto mb-4">
                <h6>Number of clinics by specialty</h6>
                <ResponsiveContainer width="100%" height={400} >
                    <PieChart className='border-0'>
                        <Pie

                            data={clinicsData}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        // label
                        >
                            {clinicsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    )
}
