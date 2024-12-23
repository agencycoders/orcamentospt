import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, Building2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCustomers } from '../../hooks/useCustomers';
import type { CustomerFormData } from '../../types/customer';

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCustomer, updateCustomer, getCustomerById } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    type: 'individual',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    tax_id: '',
    company_name: '',
    trading_name: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    notes: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      loadCustomer(id);
    }
  }, [id]);

  const loadCustomer = async (customerId: string) => {
    try {
      const data = await getCustomerById(customerId);
      setFormData(data);
    } catch (error) {
      console.error('Error loading customer:', error);
      toast.error('Erro ao carregar dados do cliente');
      navigate('/clients');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateCustomer(id, formData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await addCustomer(formData);
        toast.success('Cliente adicionado com sucesso!');
      }
      navigate('/clients');
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {id ? 'Atualize as informações do cliente.' : 'Preencha as informações do novo cliente.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Type */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-base font-semibold text-gray-900">Tipo de Cliente</label>
              <p className="text-sm text-gray-500">Selecione o tipo de cliente.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.type === 'individual'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'individual' }))}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${
                      formData.type === 'individual' ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <User className={`h-6 w-6 ${
                        formData.type === 'individual' ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        formData.type === 'individual' ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        Cliente
                      </p>
                      <p className="text-xs text-gray-500">
                        Para clientes individuais
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.type === 'company'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'company' }))}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${
                      formData.type === 'company' ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <Building2 className={`h-6 w-6 ${
                        formData.type === 'company' ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        formData.type === 'company' ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        Empresa
                      </p>
                      <p className="text-xs text-gray-500">
                        Para empresas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">
            Informações Básicas
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
<label className="block text-sm font-medium text-gray-700">
  {formData.type === 'company' ? 'Nome da Empresa' : 'Nome'}
</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {formData.type === 'company' && (
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  name="trading_name"
                  value={formData.trading_name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}

            <div className="sm:col-span-3">
<label className="block text-sm font-medium text-gray-700">
  {formData.type === 'company' ? 'NIF' : 'NIF'}
</label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {formData.type === 'company' && (
              <>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">
            Endereço
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
<label className="block text-sm font-medium text-gray-700">
  Morada
</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
<label className="block text-sm font-medium text-gray-700">
  Código Postal
</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
<label className="block text-sm font-medium text-gray-700">
  Cidade
</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
<label className="block text-sm font-medium text-gray-700">
  Distrito
</label>
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact Person (for companies) */}
        {formData.type === 'company' && (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-6">
              Pessoa de Contato
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Email do Contato
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Telefone do Contato
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">
            Informações Adicionais
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Cliente ativo
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {id ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
