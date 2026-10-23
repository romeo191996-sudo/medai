import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Activity, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Import Supabase

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // If successful, go to the Home page
      navigate('/');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl max-w-md w-full border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-3 rounded-full">
            <Activity className="w-8 h-8 text-medical-blue" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-medical-dark mb-2">
          {t('auth.loginTitle')}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {t('auth.loginSubtitle')}
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-medical-dark mb-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-medical-blue outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-medical-dark mb-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-medical-blue outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center bg-medical-blue text-white py-3 rounded-xl font-bold text-lg hover:bg-medical-accent transition-colors shadow-lg hover:shadow-medical-blue/30 mt-4 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('auth.loginButton')}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-medical-blue font-bold hover:underline">
            {t('auth.switchToRegister')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}