import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Plus,
  Loader2,
  DollarSign,
  Percent,
  CalendarDays
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCustomers } from '../../hooks/useCustomers';
import type { Customer } from '../../types/customer';

const ClientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCustomerById, deleteCustomer } = useCustomers();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadCustomer(id);
    }
  }, [id]);

  const loadCustomer = async (customerId: string) => {
    try {
      const data = await getCustomerById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error('Error loading customer:', error);
      toast.error('Erro ao carregar dados do cliente');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;

    if (window.confirm(`Tem certeza que deseja excluir o cliente ${customer.name}?`)) {
      setDeleting(true);
      try {
        await deleteCustomer(customer.id);
        toast.success('Cliente excluído com sucesso!');
        navigate('/clients');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Erro ao excluir cliente');
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Cliente não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div className={`rounded-lg p-2 ${
              customer.type === 'company' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {customer.type === 'company' ? (
                <Building2 className="h-6 w-6 text-purple-600" />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900 sm:truncate">
                {customer.name}
              </h2>
              {customer.type === 'company' && customer.trading_name && (
                <p className="text-sm text-gray-500">{customer.trading_name}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
          <Link
            to={`/budgets/new?customer=${customer.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Novo Orçamento
          </Link>
          <Link
            to={`/clients/${customer.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Edit className="-ml-1 mr-2 h-5 w-5" />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="-ml-1 mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="-ml-1 mr-2 h-5 w-5" />
            )}
            Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Informações Básicas
              </h3>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Tipo
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {customer.type === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                    </div>
                  </dd>
                </div>

                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    {customer.type === 'company' ? 'CNPJ' : 'CPF'}
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{customer.tax_id || '-'}</div>
                  </dd>
                </div>

                {customer.type === 'company' && (
                  <>
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Razão Social
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{customer.name}</div>
                      </dd>
                    </div>

                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Nome Fantasia
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{customer.trading_name || '-'}</div>
                      </dd>
                    </div>
                  </>
                )}

                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Status
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Informações de Contato
              </h3>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Email
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {customer.email ? (
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {customer.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </dd>
                </div>

                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Telefone
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {customer.phone ? (
                        <a
                          href={`tel:${customer.phone}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          {customer.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </dd>
                </div>

                {customer.type === 'company' && (
                  <>
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Website
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">
                          {customer.website ? (
                            <a
                              href={customer.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              {customer.website}
                            </a>
                          ) : (
                            '-'
                          )}
                        </div>
                      </dd>
                    </div>

                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Pessoa de Contato
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">
                          {customer.contact_name ? (
                            <div className="space-y-2">
                              <div>{customer.contact_name}</div>
                              {customer.contact_email && (
                                <a
                                  href={`mailto:${customer.contact_email}`}
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  {customer.contact_email}
                                </a>
                              )}
                              {customer.contact_phone && (
                                <a
                                  href={`tel:${customer.contact_phone}`}
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <Phone className="h-4 w-4 mr-1" />
                                  {customer.contact_phone}
                                </a>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </div>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Endereço
              </h3>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Endereço Completo
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {customer.address ? (
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div>{customer.address}</div>
                            {(customer.city || customer.state) && (
                              <div className="text-gray-500">
                                {[customer.city, customer.state]
                                  .filter(Boolean)
                                  .join(' - ')}
                              </div>
                            )}
                            {customer.postal_code && (
                              <div className="text-gray-500">
                                CEP: {customer.postal_code}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6 sm:p-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Observações
                </h3>
                <div className="mt-6 text-gray-700 whitespace-pre-wrap">
                  {customer.notes}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Estatísticas
              </h3>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100">
                <div className="pt-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Total de Orçamentos
                  </dt>
                  <dd className="mt-1">
                    <div className="flex items-baseline">
                      <div className="flex items-center text-2xl font-semibold text-gray-900">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        0
                      </div>
                    </div>
                  </dd>
                </div>

                <div className="pt-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Valor Total
                  </dt>
                  <dd className="mt-1">
                    <div className="flex items-baseline">
                      <div className="flex items-center text-2xl font-semibold text-gray-900">
                        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                        R$ 0,00
                      </div>
                    </div>
                  </dd>
                </div>

                <div className="pt-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Margem Média
                  </dt>
                  <dd className="mt-1">
                    <div className="flex items-baseline">
                      <div className="flex items-center text-2xl font-semibold text-gray-900">
                        <Percent className="h-5 w-5 text-gray-400 mr-2" />
                        0%
                      </div>
                    </div>
                  </dd>
                </div>

                <div className="pt-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Último Orçamento
                  </dt>
                  <dd className="mt-1">
                    <div className="flex items-baseline">
                      <div className="flex items-center text-gray-900">
                        <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
                        Nenhum orçamento
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Recent Budgets */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Orçamentos Recentes
                </h3>
                <Link
                  to={`/budgets?customer=${customer.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver todos
                </Link>
              </div>
              <div className="text-center py-6 text-gray-500">
                Nenhum orçamento encontrado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
