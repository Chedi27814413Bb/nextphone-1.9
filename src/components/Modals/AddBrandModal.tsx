import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (brandName: string) => Promise<void>;
}

const AddBrandModal: React.FC<AddBrandModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { t } = useLanguage();
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandName.trim()) {
      setError(t('modal.brand_name_required'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAdd(brandName.trim());
      setBrandName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBrandName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('modal.add_brand')}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="form-group">
            <label className="form-label">{t('modal.brand_name')} *</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className={`form-input ${error ? 'border-red-500' : ''}`}
              placeholder={t('modal.brand_name_placeholder')}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !brandName.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('modal.adding') : t('modal.add_brand_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrandModal;