import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Smartphone, Tag } from 'lucide-react';
import { useBrands, useModels } from '../hooks/useSupabase';
import { useLanguage } from '../hooks/useLanguage';
import AddBrandModal from '../components/Modals/AddBrandModal';
import AddModelModal from '../components/Modals/AddModelModal';

const Brands: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  
  const { brands, loading: brandsLoading, addBrand } = useBrands();
  const { models, loading: modelsLoading, addModel } = useModels();

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredModels = selectedBrandId
    ? models.filter(model => model.brand_id === selectedBrandId)
    : models;

  const selectedBrand = selectedBrandId ? brands.find(b => b.id === selectedBrandId) : null;

  const handleAddBrand = async (brandName: string) => {
    try {
      await addBrand(brandName);
    } catch (error) {
      console.error('Error adding brand:', error);
      alert(t('common.error_occurred'));
    }
  };

  const handleAddModel = async (modelName: string, brandId: string) => {
    try {
      await addModel(modelName, brandId);
    } catch (error) {
      console.error('Error adding model:', error);
      alert(t('common.error_occurred'));
    }
  };

  const getModelCount = (brandId: string) => {
    return models.filter(model => model.brand_id === brandId).length;
  };

  if (brandsLoading || modelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('brands.title')}</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddBrandModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('brands.add_brand')}
          </button>
          
          {selectedBrandId && (
            <button
              onClick={() => setShowAddModelModal(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('brands.add_model')}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('brands.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brands List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Tag className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t('brands.brands')}</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredBrands.length}
              </span>
            </div>
          </div>

          <div className="p-6">
            {filteredBrands.length > 0 ? (
              <div className="space-y-3">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBrandId === brand.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedBrandId(brand.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                        <p className="text-sm text-gray-600">
                          {getModelCount(brand.id)} {t('brands.model_count')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('brands.no_brands')}</h3>
                <p className="text-gray-600 mb-6">{t('brands.add_brands_message')}</p>
                <button
                  onClick={() => setShowAddBrandModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  {t('brands.add_new_brand')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Models List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedBrand ? t('brands.models_for', { brand: selectedBrand.name }) : t('brands.models')}
              </h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredModels.length}
              </span>
            </div>
          </div>

          <div className="p-6">
            {selectedBrandId ? (
              filteredModels.length > 0 ? (
                <div className="space-y-3">
                  {filteredModels.map((model) => (
                    <div
                      key={model.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{model.name}</h3>
                          <p className="text-sm text-gray-600">{model.brand?.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('brands.no_models_for_brand', { brand: selectedBrand?.name })}
                  </h3>
                  <p className="text-gray-600 mb-6">{t('brands.add_models_message')}</p>
                  <button
                    onClick={() => setShowAddModelModal(true)}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    {t('brands.add_new_model')}
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('brands.select_brand')}</h3>
                <p className="text-gray-600">{t('brands.select_brand_message')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Brand Modal */}
      <AddBrandModal
        isOpen={showAddBrandModal}
        onClose={() => setShowAddBrandModal(false)}
        onAdd={handleAddBrand}
      />

      {/* Add Model Modal */}
      <AddModelModal
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onAdd={handleAddModel}
        selectedBrandId={selectedBrandId}
        brands={brands}
      />
    </div>
  );
};

export default Brands;