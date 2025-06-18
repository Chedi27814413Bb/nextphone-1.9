import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { useBrands, useModels } from '../../hooks/useSupabase';
import { useLanguage } from '../../hooks/useLanguage';
import { getPartTypes, getScreenQualities } from '../../translations';

interface AddSparePartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sparePart: any) => void;
}

const AddSparePartModal: React.FC<AddSparePartModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { brands } = useBrands();
  const { models } = useModels();
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    part_type: 'شاشة',
    screen_quality: '',
    brand_id: '',
    model_id: '',
    quantity: 0,
    purchase_price: 0,
    selling_price: 0,
    low_stock_alert: 5
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredModels, setFilteredModels] = useState(models);

  const partTypes = getPartTypes(language);
  const screenQualities = getScreenQualities(language);

  React.useEffect(() => {
    if (formData.brand_id) {
      setFilteredModels(models.filter(model => model.brand_id === formData.brand_id));
      setFormData(prev => ({ ...prev, model_id: '' }));
    } else {
      setFilteredModels(models);
    }
  }, [formData.brand_id, models]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t('modal.part_name_required');
    if (!formData.brand_id) newErrors.brand_id = t('modal.brand_required');
    if (!formData.model_id) newErrors.model_id = t('modal.model_required');
    if (formData.quantity < 0) newErrors.quantity = t('modal.quantity_required_error');
    if (formData.purchase_price <= 0) newErrors.purchase_price = t('modal.purchase_price_required_error');
    if (formData.selling_price <= 0) newErrors.selling_price = t('modal.selling_price_required_error');
    if (formData.selling_price <= formData.purchase_price) {
      newErrors.selling_price = t('modal.selling_price_validation_error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedBrand = brands.find(b => b.id === formData.brand_id);
    const selectedModel = models.find(m => m.id === formData.model_id);

    const newSparePart = {
      ...formData,
      brand: selectedBrand,
      model: selectedModel
    };

    onAdd(newSparePart);
    
    // Reset form
    setFormData({
      name: '',
      part_type: 'شاشة',
      screen_quality: '',
      brand_id: '',
      model_id: '',
      quantity: 0,
      purchase_price: 0,
      selling_price: 0,
      low_stock_alert: 5
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('modal.add_spare_part')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">{t('modal.part_name')} *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder={t('modal.part_name_placeholder')}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('modal.part_type')} *</label>
              <select
                value={formData.part_type}
                onChange={(e) => setFormData({...formData, part_type: e.target.value})}
                className="form-select"
              >
                {partTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {formData.part_type === 'شاشة' && (
              <div className="form-group">
                <label className="form-label">{t('modal.screen_quality')}</label>
                <select
                  value={formData.screen_quality}
                  onChange={(e) => setFormData({...formData, screen_quality: e.target.value})}
                  className="form-select"
                >
                  <option value="">{t('modal.select_screen_quality')}</option>
                  {screenQualities.map(quality => (
                    <option key={quality.value} value={quality.value}>{quality.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{t('modal.brand_name')} *</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                className={`form-select ${errors.brand_id ? 'border-red-500' : ''}`}
              >
                <option value="">{t('modal.select_brand')}</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {errors.brand_id && <p className="text-red-500 text-sm mt-1">{errors.brand_id}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('modal.model_name')} *</label>
              <select
                value={formData.model_id}
                onChange={(e) => setFormData({...formData, model_id: e.target.value})}
                className={`form-select ${errors.model_id ? 'border-red-500' : ''}`}
                disabled={!formData.brand_id}
              >
                <option value="">{t('modal.select_model')}</option>
                {filteredModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
              {errors.model_id && <p className="text-red-500 text-sm mt-1">{errors.model_id}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('modal.quantity')} *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                className={`form-input ${errors.quantity ? 'border-red-500' : ''}`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('modal.purchase_price')} *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({...formData, purchase_price: parseFloat(e.target.value) || 0})}
                className={`form-input ${errors.purchase_price ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.purchase_price && <p className="text-red-500 text-sm mt-1">{errors.purchase_price}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('modal.selling_price')} *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({...formData, selling_price: parseFloat(e.target.value) || 0})}
                className={`form-input ${errors.selling_price ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.selling_price && <p className="text-red-500 text-sm mt-1">{errors.selling_price}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('modal.low_stock_alert')}</label>
              <input
                type="number"
                min="1"
                value={formData.low_stock_alert}
                onChange={(e) => setFormData({...formData, low_stock_alert: parseInt(e.target.value) || 5})}
                className="form-input"
                placeholder="5"
              />
              <p className="text-sm text-gray-600 mt-1">{t('modal.low_stock_description')}</p>
            </div>
          </div>

          {formData.purchase_price > 0 && formData.selling_price > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                {t('modal.expected_profit', {
                  profit: (formData.selling_price - formData.purchase_price).toFixed(2),
                  percentage: (((formData.selling_price - formData.purchase_price) / formData.purchase_price) * 100).toFixed(1)
                })}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('modal.add_part_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSparePartModal;