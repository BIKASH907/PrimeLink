import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '../lib/i18n';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </LanguageProvider>
  );
}
