import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RiSendPlaneFill, RiCustomerService2Line } from 'react-icons/ri';

export default function ContactUsPage() {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'مستخدم',
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messages: [{
          senderId: user.uid,
          senderName: user.displayName || 'مستخدم',
          message: formData.message,
          timestamp: serverTimestamp(),
          isAdmin: false
        }]
      });

      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
      setFormData({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      toast.error('حدث خطأ في إرسال الرسالة');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <RiCustomerService2Line className="text-6xl text-primary_app mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            تواصل معنا
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            نحن هنا لمساعدتك! أرسل لنا رسالة وسنتواصل معك في أقرب وقت
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                موضوع الرسالة
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary_app focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="اكتب موضوع رسالتك هنا..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                أولوية الرسالة
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary_app focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تفاصيل الرسالة
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary_app focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="اشرح مشكلتك أو استفسارك بالتفصيل..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary_app text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <RiSendPlaneFill />
                  إرسال الرسالة
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}