// MapModal.jsx

import React, { Fragment, useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'react-toastify';
import 'leaflet/dist/leaflet.css';
import { BeatLoader } from 'react-spinners';

// 💡 تأكد من أن هذه الأسطر موجودة كما هي
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder'; 
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';

export default function MapModal({ onLocationConfirmed, onClose, initialLocation }) {
    const mapRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [loading, setLoading] = useState(false);

    const [position, setPosition] = useState(initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : null);

useEffect(() => {
    const modalElement = document.getElementById('map-modal');
    if (modalElement) {
        const modal = new Modal(modalElement, {
            keyboard: false,
            // 💡 أضف هذا السطر لجعل الخلفية ثابتة
            backdrop: 'static'
        });
        modal.show();
    }
}, []);

    useEffect(() => {
        if (!mapRef.current) {
            setLoading(true);
            const initialCoords = initialLocation ? [initialLocation.latitude, initialLocation.longitude] : [30.0444, 31.2357];
            const map = L.map('map-container').setView(initialCoords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const geocoder = L.Control.Geocoder.nominatim();
            const control = L.Control.geocoder({
                geocoder: geocoder,
                defaultMarkGeocode: false
            }).on('markgeocode', function (e) {
                const latlng = e.geocode.center;
                map.setView(latlng, 16);
                handleMarkerUpdate(latlng.lat, latlng.lng);
            }).addTo(map);

            let marker = L.marker(initialCoords).addTo(map);
             
            const handleMarkerUpdate = async (lat, lng) => {
                setLoading(true);
                marker.setLatLng([lat, lng]);
                
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await response.json();
                    
                    const address = data.address;
                    setSelectedLocation({
                        latitude: lat,
                        longitude: lng,
                        governorate: address.state || address.province || '',
                        city: address.city || address.town || address.village || '',
                        street: address.road || address.street || ''
                    });
                } catch (error) {
                    toast.error("Failed to get address: " + error.message, { autoClose: 3000 });
                } finally {
                    setLoading(false);
                }
            };
            
            map.on('click', (e) => {
                handleMarkerUpdate(e.latlng.lat, e.latlng.lng);
            });

            mapRef.current = map;
            setLoading(false);
        }
    }, []);

    return (
        <div className="modal fade" id="map-modal" tabIndex={-1} aria-labelledby="mapModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog modal-xl">
                <div className="modal-content" style={{ height: '90vh' }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="mapModalLabel">Select Clinic Location</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading && (
                            <div className="d-flex justify-content-center align-items-center position-absolute w-100 h-100" >
                                <BeatLoader color="#007bff" />
                            </div>
                        )}
                        <div id="map-container" style={{ height: '100%', width: '100%' }}></div>
                        {selectedLocation && (
                            <div className="mt-3">
                                <p><strong>Selected Address:</strong> {selectedLocation.governorate}, {selectedLocation.city}, {selectedLocation.street}</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer mt-5">
                        <button type="button" className="btn btn-secondary" onClick={onClose} data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn custom-button" onClick={() => onLocationConfirmed(selectedLocation)} data-bs-dismiss="modal" disabled={loading}>
                            Confirm Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}