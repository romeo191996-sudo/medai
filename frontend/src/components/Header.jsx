import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if user is logged in on load and when auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'text-medical-blue font-bold' : 'text-medical-dark hover:text-medical-blue transition-colors';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-2">
            <Activity className="text-medical-blue w-8 h-8" />
            <span className="text-xl font-bold text-medical-dark">MedAI</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={isActive('/')}>{t('nav.home')}</Link>
            <Link to="/history" className={isActive('/history')}>{t('nav.history')}</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="text-sm font-medium text-medical-dark border border-medical-light px-3 py-1.5 rounded-md hover:bg-medical-light transition-colors"
            >
              {i18n.language === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English'}
            </button>
            
            {user ? (
              // If logged in, show user name and logout
              <div className="flex items-center gap-4">
                <span className="hidden md:flex items-center gap-2 text-medical-dark font-medium">
                  <User className="w-4 h-4" />
                  {user.user_metadata?.full_name || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              // If NOT logged in, show Register and Login
              <>
                <Link to="/register" className="hidden md:block text-medical-blue font-semibold hover:text-medical-accent">
                  {t('nav.register')}
                </Link>
                <Link to="/login" className="bg-medical-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-medical-accent transition-colors">
                  {t('nav.login')}
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}