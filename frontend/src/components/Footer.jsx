import { useTranslation } from 'react-i18next';

export default function Footer() {
  // We will add translation keys for this later, for now it's in English
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} MedAI. All rights reserved.
        </p>
        <p className="text-xs text-red-500 font-medium max-w-md text-center md:text-right">
          Disclaimer: This AI is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </footer>
  );
}