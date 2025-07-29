import React, { Fragment, useEffect, useState } from 'react'
import governorates from '../governorates&cities/governorates.json'
import cities from '../governorates&cities/cities.json'

export default function Address({ onAddressChange }) {
    const [governorate, setGovernorate] = useState('');
    const [city, setCity] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);

    useEffect(() => {
        if (governorate) {
            const citiesInGov = cities.filter((city) => city.governorate_id === governorate);
            setFilteredCities(citiesInGov);
            setCity('');
        }
    }, [governorate]);

    useEffect(() => {
        if (governorate && city && onAddressChange) {
            const govName = governorates.find((gov) => gov.id === governorate)?.governorate_name_en;

            onAddressChange({
                governorate: govName || '',
                city: city,
            });
        }
    }, [governorate, city, onAddressChange]);
    return (
        <Fragment>
            <div className="d-flex align-items-center gap-3 mb-3">
                <label className="form-label mb-0 ">Governorate</label>
                <select
                    className="form-select w-50"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                >
                    <option value="">Select Governorate</option>
                    {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                            {gov.governorate_name_en}
                        </option>
                    ))}
                </select>
            </div>
            {governorate && (
                <div className="d-flex align-items-center  gap-3 mb-3">
                    <label className="form-label  mb-0 ">City</label>
                    <select
                        className="form-select w-50"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <option value="">Select City</option>
                        {filteredCities.map((city) => (
                            <option key={city.id} value={city.city_name_en}>
                                {city.city_name_en}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </Fragment>
    )
}
