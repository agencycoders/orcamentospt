import React, { useState } from 'react';
import { Save, Loader2, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SMTPSettings {
  host: string;
  port: string;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  encryption: 'none' | 'tls' | 'ssl';
  enabled: boolean;
}

const SMTPSettings = () => {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState<SMTPSettings>({
    host: '',
    port: '',
    username: '',
    password: '',
    from_email: '',
    from_name: '',
    encryption: 'tls',
    enabled: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement SMTP settings update logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);

    try {
      // TODO: Implement test email logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      toast.success('Email de teste enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar email de teste');
      console.error('Error sending test email:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Configurações de Email
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure as configurações SMTP para envio de emails.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
          <div className="p-6">
            <div className="space-y-6">
              {/* Server Settings */}
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Configurações do Servidor
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Servidor SMTP
                    </label>
                    <input
                      type="text"
                      name="host"
                      value={settings.host}
                      onChange={handleChange}
                      placeholder="smtp.exemplo.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Porta
                    </label>
                    <input
                      type="text"
                      name="port"
                      value={settings.port}
                      onChange={handleChange}
                      placeholder="587"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Usuário
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={settings.username}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={settings.password}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Criptografia
                    </label>
                    <select
                      name="encryption"
                      value={settings.encryption}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="none">Nenhuma</option>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sender Settings */}
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Configurações do Remetente
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Email do Remetente
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      value={settings.from_email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome do Remetente
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={settings.from_name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Enable/Disable */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={settings.enabled}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Habilitar envio de emails
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testing || !settings.enabled}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Enviar Email de Teste
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default SMTPSettings;
