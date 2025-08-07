import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [oobCode, setOobCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('oobCode');

    if (code) {
      setOobCode(code);
      // Verify the password reset code.
      verifyPasswordResetCode(auth, code)
        .then(email => {
          setLoading(false);
        })
        .catch(err => {
          setError('The reset link is invalid or has expired. Please try again.');
          setLoading(false);
        });
    } else {
      setError('Invalid password reset link.');
      setLoading(false);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
    }

    setVerifying(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      setError('Failed to reset password. The link may be expired.');
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Reset Password</h2>
        {error ? (
          <p className="text-red-500 text-center mb-4">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary_app focus:border-primary_app dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary_app focus:border-primary_app dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-primary_app text-white py-2 px-4 rounded-md hover:bg-primary_app/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary_app disabled:opacity-50"
            >
              {verifying ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
