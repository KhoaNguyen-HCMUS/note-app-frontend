import { FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className='bg-card-bg py-4 mt-auto'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='text-center md:text-left mb-4 md:mb-0'>
            <p className='text-text-body '> {t('footer.copyright', { year })}</p>
          </div>
          <div className='text-center md:text-right'>
            <p className='flex items-center justify-center md:justify-end gap-2 text-text-body '>
              {t('footer.madeBy')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
