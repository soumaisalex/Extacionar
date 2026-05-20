'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [bloco, setBloco] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloco, apartamento, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao efetuar login');
      }

      // Redireciona para o feed de busca de vagas após o login com sucesso
      router.push('/buscar');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 antialiased">
      {/* Topo / Branding */}
      <div className="flex flex-col items-center justify-center pt-12 pb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-200 mb-4">
          <span className="text-white font-black text-3xl tracking-tighter">X</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Extacionar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Controlo de Garagem • Alamedas Jardins
        </p>
      </div>

      {/* Formulário Principal */}
      <div className="flex-1 flex items-center max-w-sm w-full mx-auto">
        <form onSubmit={handleSubmit} className="w-full space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Aceder à app</h2>
            <p className="text-xs text-slate-400 mt-0.5">Introduza as credenciais do seu apartamento</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="bloco" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Bloco
              </label>
              <input
                id="bloco"
                type="text"
                required
                placeholder="Ex: A"
                value={bloco}
                onChange={(e) => setBloco(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="apartamento" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Apto
              </label>
              <input
                id="apartamento"
                type="text"
                required
                placeholder="Ex: 102"
                value={apartamento}
                onChange={(e) => setApartamento(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="senha" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all text-base flex items-center justify-center mt-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>

      {/* Rodapé Informativo */}
      <div className="text-center text-xs text-slate-400 pt-6">
        Primeiro acesso? Utilize a senha provisória da administração.
      </div>
    </div>
  );
}
