import { FaRegStickyNote } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function EmptyNotes() {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-center justify-center py-12 text-primary '>
      <FaRegStickyNote className='w-16 h-16 mb-4' />
      <h5 className='text-xl font-semibold mb-2'> {t('emptyNotes.title')}</h5>
      <p className='text-text-body '>{t('emptyNotes.description')}</p>
    </div>
  );
}
