import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Pill, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Result() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const medicineName = searchParams.get('med') || '';

  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        setLoading(true);
        setError(null);
        setAiData(null); 

        console.log("1. Starting fetch for:", medicineName, "in language:", i18n.language);

        // 1. Get AI Text
        const response = await fetch('http://127.0.0.1:8000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            medicine_name: medicineName,
            language: i18n.language 
          })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from AI');
        }
        
        const data = await response.json();
        setAiData(data.result);
        console.log("2. AI Text received!");

        // 2. Save to History (Wrapped in its own try/catch so it doesn't break the page)
        if (i18n.language === 'en') {
            try {
                console.log("3. Attempting to save to Supabase...");
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                  console.log("User is logged in:", session.user.id);
                  
                  const { error: dbError } = await supabase.from('search_history').insert([
                    {
                      user_id: session.user.id,
                      medicine_name: medicineName,
                    }
                  ]);
                  
                  if (dbError) {
                      console.error("❌ Supabase Database Error:", dbError.message);
                  } else {
                      console.log("✅ Successfully saved to history!");
                  }
                } else {
                    console.log("⚠️ User is not logged in. History not saved.");
                }
            } catch (dbErr) {
                console.error("❌ Database connection failed:", dbErr);
            }
        }

      } catch (err) {
        console.error("AI Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (medicineName) fetchAI();
  }, [medicineName, i18n.language]); 

  return (
    <div className="flex-grow max-w-4xl mx-auto w-full p-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-medical-blue font-semibold hover:underline mb-6">
        <ArrowLeft className="w-5 h-5" />
        {t('results.backToSearch')}
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-medical-blue p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Pill className="w-10 h-10 text-blue-200" />
            <h1 className="text-4xl font-bold capitalize">{medicineName}</h1>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-medical-blue">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-xl font-medium">{t('results.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p className="text-xl font-bold">Error loading data.</p>
              <p>{error}</p>
            </div>
          ) : (
            <motion.div 
              key={i18n.language} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-6 text-lg text-gray-700 leading-relaxed whitespace-pre-wrap"
            >
              {aiData}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}