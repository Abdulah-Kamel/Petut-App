import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../firebase.js'
import LoadingAnimation from "../common/LoadingAnimation.jsx";

const CustomerForm = () => {
    const [searchParams] = useSearchParams()
    const uid = searchParams.get('uid')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        phone: '',
        gender: '',
        role: 'customer'
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) {
            errors.fullName = "Full name is required";
        }
        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!/^(\+20|0)1[0125]\d{8}$/.test(formData.phone)) {
            errors.phone = "Please enter a valid Egyptian phone number";
        }
        if (!formData.gender) {
            errors.gender = "Gender is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return;

        setLoading(true)
        try {
            console.log(formData)
            await setDoc(doc(db, "users", uid), {
                uid,
                ...formData,
                createdAt: serverTimestamp()
            })
            navigate('/')
        } catch (err) {
            console.error(err)
            setError('Failed to complete profile')
        } finally {
            setLoading(false)
        }
    }
    const loadingHandler = ()=>{
        setLoading(true);
        setError('');
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    if(loading){
        return <LoadingAnimation/>
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#313340] p-6 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary_app">PET.CARE</h1>
                    <h2 className="mt-6 text-2xl font-bold dark:text-white">Complete your Customer profile</h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Full Name</label>
                            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange}
                                   className={`appearance-none block w-full px-3 py-3 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`}
                                   placeholder="Full Name" />
                            {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                                   className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm"
                                   placeholder="Email" disabled />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Phone</label>
                            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                   className={`appearance-none block w-full px-3 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm placeholder:text-white`}
                                   placeholder="Phone Number" />
                            {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary_app hover:bg-primary_app/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary_app disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                            {loading ? (
                                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Saving...
                </span>
                            ) : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CustomerForm