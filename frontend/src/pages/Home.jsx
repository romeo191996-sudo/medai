import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Camera, Type, Languages, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/result?med=${query}&lang=${i18n.language}`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the image to Python
      const response = await fetch(`http://127.0.0.1:8000/api/scan-image?language=${i18n.language}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image scan failed');
      
      const data = await response.json();
      
      // The AI will return text with MEDICINE_NAME: XXXX
      // We extract the name to navigate to the Result page
      const nameMatch = data.result.match(/MEDICINE_NAME:\s*([^\n]+)/);
      const detectedName = nameMatch ? nameMatch[1].trim() : 'Unknown Medicine';
      
      // Navigate to Result page, passing the detected medicine name
      navigate(`/result?med=${detectedName}&lang=${i18n.language}`);
      
    } catch (err) {
      alert("Error scanning image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full flex-grow flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-medical-light to-white animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto px-4 pt-20 pb-12 flex flex-col items-center text-center z-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-medical-dark mb-6 tracking-tight">
          {t('hero.title').split(' ').map((word, i) => (
            <span key={i} className={word === 'AI' ? 'text-medical-blue' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          {t('hero.subtitle')}
        </p>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-gray-100">
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-medical-light focus:border-medical-blue outline-none text-lg transition-colors"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-medical-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-medical-accent transition-all shadow-lg hover:shadow-medical-blue/30"
            >
              {t('hero.searchButton')}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 font-medium text-sm">{t('hero.or')}</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* HIDDEN FILE INPUT */}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
          />

          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-dashed border-medical-accent text-medical-blue py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Scanning Image...
              </>
            ) : (
              <>
                <Camera className="w-6 h-6" />
                {t('hero.uploadPhoto')}
              </>
            )}
          </button>

        </div>
      </motion.div>

      {/* FEATURES SECTION */}
      <div className="w-full max-w-5xl mx-auto px-4 py-20 z-10">
        <h2 className="text-3xl font-bold text-center text-medical-dark mb-12">
          {t('features.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Type className="text-medical-blue w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-medical-dark mb-3">{t('features.textSearch')}</h3>
            <p className="text-gray-600">{t('features.textSearchDesc')}</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="text-medical-blue w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-medical-dark mb-3">{t('features.imageSearch')}</h3>
            <p className="text-gray-600">{t('features.imageSearchDesc')}</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Languages className="text-medical-blue w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-medical-dark mb-3">{t('features.bilingual')}</h3>
            <p className="text-gray-600">{t('features.bilingualDesc')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}