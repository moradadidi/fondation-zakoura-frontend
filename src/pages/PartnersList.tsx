import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, ChevronRight, Search, RotateCw } from 'lucide-react';
import { Eye, Pencil } from "lucide-react";
import { AddEditPartnerModal } from '../components/partners/AddEditPartnerModal';

import { PartnersTable, PartnerDetailsModal } from '../components/partners/PartnersTable';
import type { Partner, FilterOption } from '../types/partners';
import {
  useGetPartnersQuery,
  useAddPartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnersMutation,
  useGetOptionsQuery,
} from '../features/partnersApi';
import { DataTable } from "../components/ui/data-table";
import type { Column } from "../components/ui/data-table";// --- IMPROVED FILTER BAR COMPONENT ---
const FilterBar: React.FC<{
  onFilterChange: (filters: Record<string, unknown>) => void;
  filterOptions: Record<string, FilterOption[]>;
}> = ({ onFilterChange, filterOptions }) => {
  const [search, setSearch] = useState('');
  const [nature, setNature] = useState('');
  const [type, setType] = useState('');
  const [structure, setStructure] = useState('');
  const [phase, setPhase] = useState('');

  const handleReset = () => {
    setSearch('');
    setNature('');
    setType('');
    setStructure('');
    setPhase('');
  };

useEffect(() => {
  const handler = setTimeout(() => {
    onFilterChange({
      partner_name: search,
      nature_partner_id: nature,
      partner_type: type,
      structure_partner_id: structure,
      status_id: phase,
    });
  }, 400);
  return () => clearTimeout(handler);
}, [search, nature, type, structure, phase, onFilterChange]);
  const FilterSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: FilterOption[]; placeholder: string }> = ({ label, value, onChange, options, placeholder }) => (
    <div>
        <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <select
            id={label.toLowerCase()}
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={value}
            onChange={onChange}
        >
            <option value="">{placeholder}</option>
            {options?.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
        </select>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 rounded-xl mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
            <div className="sm:col-span-2 lg:col-span-4 xl:col-span-2">
                <label htmlFor="search-partner" className="block text-sm font-medium text-gray-600 mb-1">Nom du Partenaire</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                        id="search-partner"
                        className="w-full border border-gray-300 rounded-md shadow-sm pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            
            <FilterSelect label="Nature du partenaire" value={nature} onChange={e => setNature(e.target.value)} options={filterOptions.natures} placeholder="Toute nature" />
            <FilterSelect label="Type du partenaire" value={type} onChange={e => setType(e.target.value)} options={filterOptions.types} placeholder="Tout type" />
            <FilterSelect label="Structure du partenaire" value={structure} onChange={e => setStructure(e.target.value)} options={filterOptions.structures} placeholder="Toute structure" />
            
            <div className="sm:col-span-full xl:col-span-1">
              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition text-sm font-medium"
              >
                <RotateCw size={14} /> Réinitialiser
              </button>
            </div>
        </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const PartnersListPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({});
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPartnerForDetails, setSelectedPartnerForDetails] = useState<Partner | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);

  // RTK Query hooks
  const { data, error: fetchError, isLoading, refetch } = useGetPartnersQuery({ filters, page: currentPage });
  const [addPartner] = useAddPartnerMutation();
  const [updatePartner] = useUpdatePartnerMutation();
  const [deletePartners] = useDeletePartnersMutation();

  // Fetch filter options (using RTK Query or fallback to API)
  useEffect(() => {
    const fetchAllOptions = async () => {
      const typeOptions: FilterOption[] = [
        { id: 'National', name: 'National' },
        { id: 'International', name: 'International' }
      ];
      const endpoints = {
        natures: '/nature-partners',
        structures: '/structure-partners',
        statuts: '/status-partners'
      };
      try {
        const api = (await import('../services/api')).api;
        const results = await Promise.all(Object.values(endpoints).map(endpoint => api.getOptions(endpoint)));
        setFilterOptions({ natures: results[0], structures: results[1], statuts: results[2], types: typeOptions });
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchAllOptions();
  }, []);

  // Partners data
  const partners = data?.data || [];
  const meta = data?.meta || {};

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleOpenAddModal = () => {
    setEditingPartner(null);
    setEditModalOpen(true);
  };

  const handleOpenEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setEditModalOpen(true);
  };

  const handleSavePartner = async (formData: FormData, id?: number) => {
    setIsSaving(true);
    try {
      if (id) {
        await updatePartner({ id, data: formData }).unwrap();
      } else {
        await addPartner(formData).unwrap();
      }
      setEditModalOpen(false);
      refetch();
    } catch {
      // handle errors if needed
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = (ids: number[]) => {
    setPendingDeleteIds(ids);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deletePartners(pendingDeleteIds).unwrap();
    setSelectedRows(new Set());
    setConfirmOpen(false);
    setPendingDeleteIds([]);
    refetch();
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteIds([]);
  };

  const handleViewDetails = (partner: Partner) => setSelectedPartnerForDetails(partner);
  const onSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedRows(e.target.checked ? new Set(partners.map(p => p.id)) : new Set());
  const onSelectRow = (id: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const columns: Column<Partner>[] = [
    {
      key: "partner_logo",
      header: "Logo",
      render: (row) =>
        row.partner_logo || row.logo_url ? (
          <img
            src={row.partner_logo || row.logo_url}
            alt={row.partner_name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span className="text-xs">{row.partner_name?.[0] || "?"}</span>
          </div>
        ),
      width: 60,
      align: "center",
    },
    { key: "partner_name", header: "Nom" },
    { key: "abbreviation", header: "Abbr." },
    { key: "country", header: "Pays" },
    { key: "partner_type", header: "Type" },
    { key: "nature_partner", header: "Nature" },
    { key: "structure_partner", header: "Structure" },
    { key: "status", header: "Phase" },
    { key: "created_at", header: "Créé le", render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 rounded hover:bg-green-50 text-green-600"
            title="Voir"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1 rounded hover:bg-blue-50 text-blue-600"
            title="Éditer"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => handleDeleteRequest([row.id])}
            className="p-1 rounded hover:bg-red-50 text-red-600"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
      <div className="max-w-screen-2xl mx-auto mt-10">
        <header className="mb-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500">
              <li><a href="#" className="hover:underline">Partenariat</a></li>
              <li><ChevronRight size={16} /></li>
              <li><a href="#" className="hover:underline">Prospection</a></li>
              <li><ChevronRight size={16} /></li>
              <li><span className="font-medium text-gray-700">Partenaires</span></li>
            </ol>
          </nav>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Partenaires</h1>
              <p className="text-base text-gray-600 mt-1">
                {meta.total ? `Total de ${meta.total} partenaires.` : 'Chargement des partenaires...'}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0 shrink-0">
              {selectedRows.size > 0 && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleDeleteRequest(Array.from(selectedRows))}
                >
                  <Trash2 size={18} /> Supprimer ({selectedRows.size})
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#008c95] text-white rounded-lg shadow-sm hover:bg-[#00727a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#008c95] focus:ring-offset-2"
                onClick={handleOpenAddModal}
              >
                <Plus size={18} /> Ajouter un partenaire
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-md">
          <FilterBar onFilterChange={handleFilterChange} filterOptions={filterOptions} />
          {fetchError && (
            <div className="mx-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Erreur</p>
              <p>{String(fetchError)}</p>
            </div>
          )}
          <DataTable
            columns={columns}
            data={partners}
            emptyText={isLoading ? "Chargement..." : "Aucun partenaire trouvé"}
          />
        </div>
      </div>

      <AddEditPartnerModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSavePartner}
        partner={editingPartner}
        options={filterOptions}
        serverErrors={{}} // You may want to handle errors from RTK Query mutation here
        isLoading={isSaving}
      />
      <PartnerDetailsModal
        isOpen={!!selectedPartnerForDetails}
        onClose={() => setSelectedPartnerForDetails(null)}
        partner={selectedPartnerForDetails}
      />

      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 p-2 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
              <div className="mt-2 text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer {pendingDeleteIds.length > 1 ? `${pendingDeleteIds.length} partenaires` : 'ce partenaire'} ?<br />
                Cette action est réversible (soft delete).
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition" onClick={handleConfirmDelete}>
                Confirmer
              </button>
              <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition" onClick={handleCancelDelete}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersListPage;