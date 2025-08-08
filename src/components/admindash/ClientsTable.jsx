import React, { Fragment, useEffect, useState } from 'react'
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import EditClientModal from './EditClientModal';

import { BiSearchAlt2 } from "react-icons/bi";
import ConfirmModal from '../ConfirmModal';
import { FaEye } from "react-icons/fa";
import ViewClientModal from './ViewClientModal';



export default function Clientstable({ clients, setClients, fetchClients, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');


    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);


    //get clients from firestore
    useEffect(() => {
        fetchClients();
    }, [])

    // delete client from firestore
    const handleDeleteClient = async (clientId) => {
        try {
            await deleteDoc(doc(db, 'users', clientId));
            setClients(clients => clients.filter(client => client.id != clientId))
            toast.success('Client deleted successfully', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to delete client, error:" + err.message, { autoClose: 3000 });
        }
    }

    // filter clients by name and email
    const filteredClients = clients.filter((client) => {
        const nameMatch = client.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = client.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const genderMatch = genderFilter === 'all' || client.gender === genderFilter;
        return (nameMatch || emailMatch) && genderMatch;
    });

    return (
        <Fragment>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="search-box w-50 position-relative">
                    <input
                        className="form-control pe-5"
                        type="text"
                        placeholder="Search by name, email, or specialization"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        size={20}
                        className="position-absolute"
                        style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
                    />
                </div>
                <select className="form-select w-25" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                    <option value="all" >All</option>
                    <option value="male" >Male</option>
                    <option value="female" >Female</option>
                </select>
            </div>
            {loading ? <h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3> : clients.length === 0 ? <h3 className='text-center mt-5'>No clients found</h3> : filteredClients.length === 0 ? <h3 className='text-center mt-5'>No Match clients found</h3> : (
                <div className="patient-table mt-4 bg-white shadow rounded w-100" style={{ maxHeight: '395px', overflowY: 'auto' }}>
                    <table className="table">
                        <thead className="table-light py-3  position-sticky top-0">
                            <tr className="">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Gender</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients?.map(client => (
                                <tr key={client.id}>
                                    <td className="px-4 py-3">{client.fullName}</td>
                                    <td className="px-4 py-3">{client.email}</td>
                                    <td className="px-4 py-3">{client.phone}</td>
                                    <td className="px-4 py-3" ><span style={{ color: 'white', backgroundColor: client.gender === 'male' ? '#007BFF ' : '#E91E63 ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 '>{client.gender}</span></td>
                                    <td className="px-4 py-3 d-flex align-items-center gap-2">
                                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#viewclient-${client.id}`}>
                                            <FaEye cursor={"pointer"} />
                                        </button>
                                        <ViewClientModal client={client} modalId={client.id} />
                                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#editclient-${client.id}`}>
                                            <TbEdit size={20} className='' />
                                        </button>
                                        <EditClientModal client={client} setClients={setClients} modalId={client.id} />
                                        <MdDelete cursor={"pointer"} size={20} className='text-danger' onClick={() => {
                                            setShowConfirm(true);
                                            setSelectedClientId(client.id);
                                        }} />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    {showConfirm && (<ConfirmModal onDelete={() => handleDeleteClient(selectedClientId)} setShowConfirm={setShowConfirm} selectedId={selectedClientId} whatDelete="client" />)}
                </div>
            )



            }

        </Fragment >
    )
}
