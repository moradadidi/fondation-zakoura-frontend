import React, { useState, useEffect } from 'react';
import type { Partner, PersonneContact, FilterOption } from '../../types/partners';
import {
  X, Building, Globe, MapPin, Flag, Text, HeartHandshake, User, Mail, Phone, UploadCloud,
  Loader2, Save, Network, ClipboardList, Briefcase, PencilLine
} from 'lucide-react';

interface AddEditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData, id?: number) => void;
  partner: Partner | null;
  options: Record<string, FilterOption[]>;
  serverErrors: Record<string, string[]>;
  isLoading: boolean;
}

const FieldWrapper: React.FC<{ children: React.ReactNode, error?: string[] }> = ({ children, error }) => (
  <div>{children}{error && error.map((msg, i) => <p key={i} className="text-xs text-red-600 mt-1">{msg}</p>)}</div>
);

const InputField: React.FC<any> = ({ label, name, required = false, icon: Icon, value, onChange, serverErrors, ...props }) => (
  <FieldWrapper error={serverErrors?.[name]}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={name}
        name={name}
        required={required}
        className={`block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-[#008c95] focus:ring-[#008c95] sm:text-sm ${serverErrors?.[name] ? 'border-red-500' : ''}`}
        {...props}
        value={value || ''}
        onChange={onChange}
      />
    </div>
  </FieldWrapper>
);

const SelectField: React.FC<any> = ({ label, name, required = false, icon: Icon, options, value, onChange, serverErrors, ...props }) => (
  <FieldWrapper error={serverErrors?.[name]}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <select
        id={name}
        name={name}
        required={required}
        className={`block w-full appearance-none rounded-md border-gray-300 pl-10 pr-8 shadow-sm focus:border-[#008c95] focus:ring-[#008c95] sm:text-sm ${serverErrors?.[name] ? 'border-red-500' : ''}`}
        {...props}
        value={value || ''}
        onChange={onChange}
      >
        <option value="">Sélectionnez...</option>
        {options.map((opt: FilterOption) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
      </select>
    </div>
  </FieldWrapper>
);

const TextAreaField: React.FC<any> = ({ label, name, value, onChange, serverErrors, ...props }) => (
  <FieldWrapper error={serverErrors?.[name]}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008c95] focus:ring-[#008c95] sm:text-sm"
      {...props}
      value={value || ''}
      onChange={onChange}
    />
  </FieldWrapper>
);

export const AddEditPartnerModal: React.FC<AddEditPartnerModalProps> = ({
  isOpen, onClose, onSave, partner, options, serverErrors, isLoading
}) => {
  const [formData, setFormData] = useState<Partial<Partner & PersonneContact>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const firstContact = partner?.contact_people?.[0];
    if (partner) {
      setFormData({
        ...partner,
        contact_last_name: firstContact?.last_name || '',
        contact_first_name: firstContact?.first_name || '',
        contact_position: firstContact?.position || '',
        contact_email: firstContact?.email || '',
        contact_phone: firstContact?.phone || '',
        contact_address: firstContact?.address || '',
        partner_type: partner.partner_type || 'National',
      });
    } else {
      setFormData({});
    }
    setLogoFile(null);
  }, [partner, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });

    data.append('partner_name', formData.partner_name);
    data.append('abbreviation', formData.abbreviation);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('partner_type', formData.partner_type);
    data.append('nature_partner_id', formData.nature_partner_id);
    data.append('structure_partner_id', formData.structure_partner_id);
    data.append('status_id', formData.status_id);
    data.append('address', formData.address);
    data.append('country', formData.country);
    data.append('note', formData.note);
    if (logoFile) data.append('partner_logo', logoFile);

    if (partner?.id) {
      data.append('_method', 'PUT');
    }

    onSave(data, partner?.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl transform transition-all max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">{partner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* Informations Générales */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium text-[#008c95] mb-4">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Partner Name" name="partner_name" required icon={Building} value={formData.partner_name} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Abbreviation" name="abbreviation" required icon={Text} value={formData.abbreviation} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Country" name="country" required icon={Flag} value={formData.country} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Phone" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Email" name="email" type="email" icon={Mail} value={formData.email} onChange={handleChange} serverErrors={serverErrors} />
                <div className="md:col-span-3"><InputField label="Address" name="address" icon={MapPin} value={formData.address} onChange={handleChange} serverErrors={serverErrors} /></div>
              </div>
            </div>

            {/* Classification */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium text-[#008c95] mb-4">Classification & Phase</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SelectField label="Nature" name="nature_partner_id" options={options.natures || []} required icon={HeartHandshake} value={formData.nature_partner_id} onChange={handleChange} serverErrors={serverErrors} />
                <SelectField
                  label="Type"
                  name="partner_type"
                  options={[
                    { id: 'National', name: 'National' },
                    { id: 'International', name: 'International' }
                  ]}
                  required
                  icon={Globe}
                  value={formData.partner_type}
                  onChange={handleChange}
                  serverErrors={serverErrors}
                />
                <SelectField label="Structure" name="structure_partner_id" options={options.structures || []} required icon={Network} value={formData.structure_partner_id} onChange={handleChange} serverErrors={serverErrors} />
                <SelectField label="Phase" name="status_id" options={options.statuts || []} required icon={ClipboardList} value={formData.status_id} onChange={handleChange} serverErrors={serverErrors} />
              </div>
            </div>

            {/* Personne de Contact */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium text-[#008c95] mb-4">Personne de Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Prénom du contact" name="contact_first_name" required icon={User} value={formData.contact_first_name} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Nom du contact" name="contact_last_name" required icon={User} value={formData.contact_last_name} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Poste du contact" name="contact_position" required icon={Briefcase} value={formData.contact_position} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Email du contact" name="contact_email" type="email" required icon={Mail} value={formData.contact_email} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Téléphone du contact" name="contact_phone" required icon={Phone} value={formData.contact_phone} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Adresse du contact (facultative)" name="contact_address" icon={MapPin} value={formData.contact_address} onChange={handleChange} serverErrors={serverErrors} />
              </div>
            </div>

            {/* Autres Informations */}
            <div>
              <h3 className="text-lg font-medium text-[#008c95] mb-4">Autres Informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextAreaField label="Note" name="note" rows={4} value={formData.note} onChange={handleChange} serverErrors={serverErrors} />
                <InputField label="Actions" name="actions" icon={PencilLine} value={formData.actions} onChange={handleChange} serverErrors={serverErrors} />
                <FieldWrapper>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoChange} />
                  {logoFile && <img src={URL.createObjectURL(logoFile)} alt="Preview" className="mt-2 h-24 object-contain" />}
                </FieldWrapper>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100" disabled={isLoading}>Annuler</button>
            <button type="submit" style={{ backgroundColor: '#008c95' }} className="flex items-center justify-center w-36 px-6 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={16} className="mr-2" />Sauvegarder</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
