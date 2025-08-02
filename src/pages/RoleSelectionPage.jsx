import { useNavigate, useSearchParams } from 'react-router-dom';

const RoleSelectionPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const uid = searchParams.get('uid');

    const handleRoleSelection = (role) => {
        if (uid) {
            navigate(`/complete-profile?uid=${uid}&role=${role}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#313340] p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-primary_app">One Last Step!</h1>
                <h2 className="mt-4 text-xl font-bold dark:text-white">Tell us who you are</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Please select your role to help us customize your experience.
                </p>
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => handleRoleSelection('customer')}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary_app hover:bg-primary_app/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        I'm a Pet Owner
                    </button>
                    <button
                        onClick={() => handleRoleSelection('doctor')}
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-white bg-white dark:bg-[#313340] hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        I'm a Doctor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
