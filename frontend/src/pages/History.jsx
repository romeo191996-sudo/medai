import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, Search, ChevronRight, Pill, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function History() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log("Fetching history...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No user logged in.");
          setHistory([]);
          setLoading(false);
          return;
        }

        console.log("Logged in user ID:", session.user.id);

        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
            console.error("Database Error:", error);
            throw error;
        }
        
        console.log("Fetched History Data:", data);
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching history:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex-grow max-w-4xl mx-auto w-full p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold text-medical-dark mb-2 flex items-center justify-center md:justify-start gap-3">
          <Clock className="text-medical-blue w-8 h-8" />
          {t('historyPage.title')}
        </h1>
        <p className="text-gray-500 text-lg">{t('historyPage.subtitle')}</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-medical-blue" />
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-6">{t('historyPage.empty')}</p>
          <Link to="/" className="bg-medical-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-medical-accent transition-colors">
            {t('historyPage.searchNow')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                <div className="bg-blue-50 p-4 rounded-full">
                  <Pill className="w-6 h-6 text-medical-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-medical-dark capitalize">{item.medicine_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <Link 
                to={`/result?med=${item.medicine_name}`}
                className="flex items-center gap-2 text-medical-blue font-semibold hover:text-medical-accent transition-colors bg-blue-50 px-5 py-2.5 rounded-lg group-hover:bg-medical-blue group-hover:text-white"
              >
                {t('historyPage.viewDetails')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}