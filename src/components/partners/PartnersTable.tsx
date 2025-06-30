import React, { useState, useMemo } from 'react';
import { 
    Loader2, 
    Pencil, 
    Trash2, 
    Eye, 
    X, 
    AlertTriangle, 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight,
    Building,
    User,
    Mail,
    Phone
} from 'lucide-react';


// --- 1. CORRECTED TYPE DEFINITIONS (to match your data) ---

export type ContactPerson = {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
};

export type Partner = {
    id: number;
    partner_name: string;
    abbreviation: string | null;
    phone: string | null; // The organization's general phone
    email: string | null; // The organization's general email
    address: string | null;
    country: string | null;
    nature_partner: string | null;
    partner_type: string | null;
    structure_partner: string | null;
    status: string | null;
    actions: string | null;
    note: string | null;
    logo_url: string | null;
    created_at: string | null;
    contact_people: ContactPerson[]; // Partner has an array of contacts
};


// --- 2. SUB-COMPONENTS ---

/**
 * Status Badge Component (No changes needed)
 */
const StatusBadge: React.FC<{ text: string | null; className?: string }> = ({ text, className = '' }) => {
    const status = text?.toLowerCase() || '';
    let colorClasses = 'bg-gray-100 text-gray-800';
    if (status.includes('prospect')) colorClasses = 'bg-blue-100 text-blue-800';
    if (status.includes('contrat actif')) colorClasses = 'bg-green-100 text-green-800';
    if (status.includes('convention signée')) colorClasses = 'bg-teal-100 text-teal-800';
    if (status.includes('en discussion')) colorClasses = 'bg-yellow-100 text-yellow-800';
    if (status.includes('archivé')) colorClasses = 'bg-gray-200 text-gray-700';
    if (status.includes('national')) colorClasses = 'bg-indigo-100 text-indigo-800';
    if (status.includes('international')) colorClasses = 'bg-purple-100 text-purple-800';
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colorClasses} ${className}`}>{text || 'N/A'}</span>;
};


/**
 * Partner Details Modal (FIXED to show a list of contacts)
 */
export const PartnerDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; partner: Partner | null; }> = ({ isOpen, onClose, partner }) => {
    if (!isOpen || !partner) return null;

    const DetailItem = ({ label, value, isBadge = false }: { label: string; value: string | null | undefined; isBadge?: boolean }) => {
        if (!value && !isBadge) return null;
        return (
            <div>
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                {isBadge ? <dd className="mt-1"><StatusBadge text={value}/></dd> : <dd className="mt-1 text-base text-gray-900">{value}</dd>}
            </div>
        );
    };
    
    const FullWidthDetailItem = ({ label, value }: { label: string; value: string | null | undefined; }) => {
        if (!value) return null;
        return (
            <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-base text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">{value}</dd>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start p-4 transition-opacity duration-300 animate-fade-in overflow-y-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-5">
                             <img className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md" src={partner.logo_url || `https://ui-avatars.com/api/?name=${partner.partner_name?.replace(/\s/g, "+")}&background=0D9488&color=FFFFFF&size=128`} alt={`Logo de ${partner.partner_name}`} />
                             <div>
                                <h3 className="text-3xl font-bold text-gray-900">{partner.partner_name}</h3>
                                <p className="text-lg text-gray-500">{partner.abbreviation}</p>
                             </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X size={28} /></button>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* --- Section 1: Partner Details --- */}
                    <div className="lg:col-span-3 bg-gray-50/70 p-5 rounded-lg border">
                         <div className="flex items-center gap-3 mb-5"><Building className="w-6 h-6 text-[#008c95]"/><h4 className="text-xl font-bold text-gray-800">Informations sur le Partenaire</h4></div>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <DetailItem label="Nature" value={partner.nature_partner} /><DetailItem label="Structure" value={partner.structure_partner} />
                            <DetailItem label="Type" value={partner.partner_type} isBadge /><DetailItem label="Phase" value={partner.status} isBadge />
                            <DetailItem label="Pays" value={partner.country} /><DetailItem label="Téléphone (Général)" value={partner.phone} />
                            <div className="md:col-span-2"><DetailItem label="Courriel (Général)" value={partner.email} /></div>
                            <FullWidthDetailItem label="Adresse" value={partner.address} />
                            <FullWidthDetailItem label="Actions/Projets" value={partner.actions} />
                            <FullWidthDetailItem label="Note" value={partner.note} />
                        </dl>
                    </div>

                    {/* --- Section 2: Contact Person list --- */}
                    <div className="lg:col-span-2 bg-blue-50/40 p-5 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3 mb-5"><User className="w-6 h-6 text-blue-600"/><h4 className="text-xl font-bold text-gray-800">Personnes de Contact</h4></div>
                        <div className="space-y-4">
                            {partner.contact_people && partner.contact_people.length > 0 ? (
                                partner.contact_people.map(contact => (
                                    <div key={contact.id} className="p-4 bg-white/60 rounded-lg border border-gray-200">
                                        <p className="font-bold text-lg text-gray-900">{contact.first_name} {contact.last_name}</p>
                                        {contact.position && <p className="text-sm text-blue-800 font-medium">{contact.position}</p>}
                                        <div className="mt-3 space-y-2 text-sm">
                                            {contact.email && <p className="flex items-center gap-2 text-gray-700"><Mail size={14}/> {contact.email}</p>}
                                            {contact.phone && <p className="flex items-center gap-2 text-gray-700"><Phone size={14}/> {contact.phone}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center text-center text-gray-500 h-full py-10"><span>Aucune personne de contact n'a été ajoutée.</span></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeInScale{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}.animate-fade-in{animation:fadeIn .2s ease-out forwards}.animate-fade-in-scale{animation:fadeInScale .2s ease-out forwards}`}</style>
        </div>
    );
};

/**
 * Confirmation Modal (No changes needed)
 */
const ConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center"><div className="w-12 h-12 rounded-full bg-red-100 p-2 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-600" /></div><h3 className="text-lg font-medium text-gray-900">{title}</h3><div className="mt-2 text-sm text-gray-500">{children}</div></div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg"><button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={onConfirm}>Confirmer</button><button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>Annuler</button></div>
            </div>
        </div>
    );
};


/**
 * Advanced Pagination Controls (No changes needed)
 */
interface PaginationControlsProps { currentPage: number; totalPages: number; onPageChange: (page: number) => void; totalItems: number; itemsPerPage: number; }
const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const pageNumbers = useMemo(() => {
        const delta = 1, range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) range.push(i);
        if (currentPage - delta > 2) range.unshift('...');
        if (currentPage + delta < totalPages - 1) range.push('...');
        range.unshift(1);
        if (totalPages > 1) range.push(totalPages);
        return range;
    }, [currentPage, totalPages]);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-600">Résultats <span className="font-semibold">{startItem}</span>-<span className="font-semibold">{endItem}</span> sur <span className="font-semibold">{totalItems}</span></div>
            <nav className="flex items-center gap-1"><button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" aria-label="Première page"><ChevronsLeft className="h-5 w-5" /></button><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" aria-label="Page précédente"><ChevronLeft className="h-5 w-5" /></button><div className="flex items-center gap-1">{pageNumbers.map((page, index) => typeof page === 'number' ? (<button key={index} onClick={() => onPageChange(page)} className={`px-4 py-2 text-sm rounded-md ${currentPage === page ? 'bg-[#008c95] text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>{page}</button>) : (<span key={index} className="px-4 py-2 text-sm text-gray-500">{page}</span>))}</div><button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" aria-label="Page suivante"><ChevronRight className="h-5 w-5" /></button><button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" aria-label="Dernière page"><ChevronsRight className="h-5 w-5" /></button></nav>
        </div>
    );
};

// --- 3. MAIN PARTNERS TABLE COMPONENT (FIXED to handle new data structure) ---

interface PartnersTableProps {
    partners: Partner[];
    loading: boolean;
    selectedRows: Set<number>;
    onSelectRow: (id: number) => void;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: (partner: Partner) => void;
    onRequestDelete: (ids: number[]) => void;
    onViewDetails: (partner: Partner) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export const PartnersTable: React.FC<PartnersTableProps> = ({
    partners, loading, selectedRows, onSelectAll, onSelectRow, onEdit, onRequestDelete, onViewDetails, currentPage, totalPages, onPageChange, totalItems, itemsPerPage,
}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
    const handleDeleteClick = (ids: number[]) => { setPendingDeleteIds(ids); setConfirmOpen(true); };
    const handleConfirmDelete = () => { onRequestDelete(pendingDeleteIds); setConfirmOpen(false); setPendingDeleteIds([]); };
    const handleCancelDelete = () => { setConfirmOpen(false); setPendingDeleteIds([]); };

    if (loading) return <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-lg border"><Loader2 className="h-12 w-12 animate-spin text-[#008c95]" /><p className="mt-4 text-gray-600">Chargement des partenaires...</p></div>;
    if (!loading && partners.length === 0) return <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border"><h3 className="text-lg font-medium">Aucun partenaire trouvé</h3><p className="mt-1">Vérifiez vos filtres ou ajoutez un nouveau partenaire.</p></div>;
    
    const tableHeaders = ["Partenaire", "Contact Principal", "Type", "Statut", "Créé le", "Actions"];

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4 w-12"><input type="checkbox" onChange={onSelectAll} className="h-4 w-4 rounded border-gray-300 text-[#008c95] focus:ring-[#008c95] focus:ring-offset-0" checked={selectedRows.size > 0 && selectedRows.size === partners.length} ref={input => { if (input) input.indeterminate = selectedRows.size > 0 && selectedRows.size < partners.length; }}/></th>
                            {tableHeaders.map((header, index) => (<th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${index === tableHeaders.length - 1 ? 'text-right' : ''}`}>{header}</th>))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {partners.map(partner => {
                            const primaryContact = partner.contact_people?.[0]; // Get the first contact person, if they exist
                            return (
                                <tr key={partner.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200 last:border-b-0">
                                    <td className="p-4 w-12"><input type="checkbox" checked={selectedRows.has(partner.id)} onChange={() => onSelectRow(partner.id)} className="h-4 w-4 rounded border-gray-300 text-[#008c95] focus:ring-[#008c95] focus:ring-offset-0"/></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-11 w-11"><img className="h-11 w-11 rounded-full object-cover" src={partner.logo_url || `https://ui-avatars.com/api/?name=${partner.partner_name.replace(/\s/g, "+")}&background=E6F3F4&color=008C95`} alt={`Logo de ${partner.partner_name}`}/></div>
                                            <div className="ml-4"><div className="text-sm font-bold text-gray-900">{partner.partner_name}</div><div className="text-xs text-gray-500">{partner.abbreviation}</div></div>
                                        </div>
                                    </td>
                                    {/* --- FIXED: Contact Column --- */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {primaryContact ? (
                                            <>
                                                <div className="text-sm font-medium text-gray-800">{primaryContact.first_name} {primaryContact.last_name}</div>
                                                <div className="text-xs text-gray-500">{primaryContact.email || <span className="text-gray-400">N/A</span>}</div>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-400">Aucun contact</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge text={partner.partner_type} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge text={partner.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{partner.created_at ? new Date(partner.created_at).toLocaleDateString('fr-FR') : <span className="text-gray-400">N/A</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                            <button onClick={() => onViewDetails(partner)} className="text-gray-400 hover:text-green-600" title="Voir les détails"><Eye className="h-5 w-5" /></button>
                                            <button onClick={() => onEdit(partner)} className="text-gray-400 hover:text-blue-600" title="Modifier"><Pencil className="h-5 w-5" /></button>
                                            <button onClick={() => handleDeleteClick([partner.id])} className="text-gray-400 hover:text-red-600" title="Supprimer"><Trash2 className="h-5 w-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} totalItems={totalItems} itemsPerPage={itemsPerPage}/>)}
            <ConfirmationModal isOpen={confirmOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} title="Confirmer la suppression">Êtes-vous sûr de vouloir supprimer {pendingDeleteIds.length > 1 ? 'ces partenaires' : 'ce partenaire'} ? Cette action est réversible.</ConfirmationModal>
        </div>
    );
};