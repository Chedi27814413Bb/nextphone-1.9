import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, Wrench, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AddRepairModal from '../components/Modals/AddRepairModal';
import { useRepairRequests, useSpareParts } from '../hooks/useSupabase';
import { useLanguage } from '../hooks/useLanguage';

const Repairs: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { repairs, loading, addRepair, updateRepairStatus, deleteRepair } = useRepairRequests();
  const { refetch: refetchSpareParts } = useSpareParts();

  const handleAddRepair = async (newRepair: any) => {
    try {
      const repairData = {
        customer_name: newRepair.customer_name,
        customer_phone: newRepair.customer_phone,
        device_brand_id: newRepair.device_brand_id,
        device_model_id: newRepair.device_model_id,
        issue_type: newRepair.issue_type,
        description: newRepair.description,
        labor_cost: newRepair.labor_cost,
        total_cost: newRepair.total_cost,
        profit: newRepair.profit,
        status: newRepair.status as 'pending' | 'in_progress' | 'completed' | 'archived'
      };

      const usedParts = newRepair.used_parts?.map((part: any) => ({
        spare_part_id: part.spare_part_id,
        quantity_used: part.quantity,
        price_at_time: part.price
      }));

      await addRepair(repairData, usedParts);
      // تحديث قطع الغيار لإظهار الكميات الجديدة
      refetchSpareParts();
    } catch (error) {
      console.error('Error adding repair:', error);
      alert(t('common.error_occurred'));
    }
  };

  const handleStatusChange = async (repairId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'archived') => {
    try {
      await updateRepairStatus(repairId, newStatus);
    } catch (error) {
      console.error('Error updating repair status:', error);
      alert(t('common.error_occurred'));
    }
  };

  const handleDeleteRepair = async (repairId: string) => {
    if (window.confirm(t('common.confirm_delete'))) {
      try {
        await deleteRepair(repairId);
        refetchSpareParts(); // تحديث المخزون بعد الحذف
      } catch (error) {
        console.error('Error deleting repair:', error);
        alert(t('common.error_occurred'));
      }
    }
  };

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = 
      repair.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.customer_phone.includes(searchTerm) ||
      repair.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.model?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: t('repairs.pending'), class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      in_progress: { label: t('repairs.in_progress'), class: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      completed: { label: t('repairs.completed'), class: 'bg-green-100 text-green-800', icon: CheckCircle },
      archived: { label: t('repairs.archived'), class: 'bg-gray-100 text-gray-800', icon: FileText }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getStatusActions = (repair: any) => {
    const actions = [];
    
    if (repair.status === 'pending') {
      actions.push(
        <button
          key="start"
          onClick={() => handleStatusChange(repair.id, 'in_progress')}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          {t('repairs.start_work')}
        </button>
      );
    }
    
    if (repair.status === 'in_progress') {
      actions.push(
        <button
          key="complete"
          onClick={() => handleStatusChange(repair.id, 'completed')}
          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
        >
          {t('repairs.complete')}
        </button>
      );
    }
    
    if (repair.status === 'completed') {
      actions.push(
        <button
          key="archive"
          onClick={() => handleStatusChange(repair.id, 'archived')}
          className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
        >
          {t('repairs.archive')}
        </button>
      );
    }
    
    return actions;
  };

  if (loading) {
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
        <h1 className="text-2xl font-bold text-gray-900">{t('repairs.title')}</h1>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('repairs.new_repair')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">{t('repairs.pending')}</p>
              <p className="text-2xl font-bold text-yellow-800">
                {repairs.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">{t('repairs.in_progress')}</p>
              <p className="text-2xl font-bold text-blue-800">
                {repairs.filter(r => r.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">{t('repairs.completed')}</p>
              <p className="text-2xl font-bold text-green-800">
                {repairs.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('repairs.archived')}</p>
              <p className="text-2xl font-bold text-gray-800">
                {repairs.filter(r => r.status === 'archived').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('repairs.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('repairs.all_statuses')}</option>
              <option value="pending">{t('repairs.pending')}</option>
              <option value="in_progress">{t('repairs.in_progress')}</option>
              <option value="completed">{t('repairs.completed')}</option>
              <option value="archived">{t('repairs.archived')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repairs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRepairs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.customer')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.device')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.issue')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.used_parts')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.cost')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.profit')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.status')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.date')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('repairs.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRepairs.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{repair.customer_name}</p>
                        <p className="text-sm text-gray-600">{repair.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{repair.brand?.name}</p>
                        <p className="text-sm text-gray-600">{repair.model?.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{repair.issue_type}</p>
                      {repair.description && (
                        <p className="text-sm text-gray-600 mt-1">{repair.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {repair.repair_parts && repair.repair_parts.length > 0 ? (
                        <div className="space-y-1">
                          {repair.repair_parts.map((part, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-gray-900">{part.spare_part?.name || t('repairs.no_parts')}</span>
                              <span className="text-gray-600"> × {part.quantity_used}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">{t('repairs.no_parts')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{repair.total_cost} {t('common.currency')}</p>
                        {repair.labor_cost > 0 && (
                          <p className="text-sm text-gray-600">{t('repairs.labor_cost')}: {repair.labor_cost} {t('common.currency')}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-green-600">{repair.profit} {t('common.currency')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getStatusBadge(repair.status)}
                        <div className="flex gap-1">
                          {getStatusActions(repair)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {new Date(repair.created_at).toLocaleDateString('ar-EG')}
                        </p>
                        {repair.completed_at && (
                          <p className="text-xs text-green-600">
                            {t('repairs.completed_date')}: {new Date(repair.completed_at).toLocaleDateString('ar-EG')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRepair(repair.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('repairs.no_repairs')}</h3>
            <p className="text-gray-600 mb-6">{t('repairs.add_first_repair')}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('repairs.add_new_repair')}
            </button>
          </div>
        )}
      </div>

      {/* Add Repair Modal */}
      <AddRepairModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddRepair}
      />
    </div>
  );
};

export default Repairs;