import { useEffect, useMemo, useState } from 'react';
import { Ban, Check, CreditCard, Search, X } from 'lucide-react';
import { payMethodsApi } from '../../../shared/api/adminApi';

export default function GestionMetodosPago() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changingId, setChangingId] = useState(null);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => {
      const status = m.is_active ? 'activo' : 'inactivo';
      return [m.name, m.description, status].some((val) => String(val || '').toLowerCase().includes(q));
    });
  }, [items, search]);

  const load = async () => {
    try { setLoading(true); setError(''); setItems(await payMethodsApi.list({ includeInactive: true })); }
    catch (e) { setError(e.message || 'No se pudieron cargar los métodos de pago.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (m) => {
    if (changingId !== null) return;
    try {
      setChangingId(m.id);
      setError('');
      const updated = await payMethodsApi.setStatus(m.id, !m.is_active);
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      setError(e.message || 'No se pudo cambiar el estado del método de pago.');
    } finally {
      setChangingId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Métodos de Pago</h1>
          <p className="text-gray-600 mt-1">Activa o desactiva los métodos registrados para completar órdenes de compra.</p>
        </div>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando métodos de pago...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No hay métodos de pago registrados</h2>
          <p className="text-gray-600 mt-1">Los métodos registrados aparecerán aquí para activarlos o desactivarlos.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, descripción o estado..." className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                {search && (<button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500" aria-label="Limpiar búsqueda"><X className="w-4 h-4" /></button>)}
              </div>
              <p className="text-sm text-gray-600">Mostrando <span className="font-medium text-gray-900">{filteredItems.length}</span> de <span className="font-medium text-gray-900">{items.length}</span></p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-900 font-medium">No se encontraron resultados</p>
              <p className="text-gray-600 mt-1">Prueba con otro término de búsqueda o limpia el filtro.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700"><tr>
                    <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                    <th className="text-left px-4 py-3 font-semibold">Descripción</th>
                    <th className="text-left px-4 py-3 font-semibold">Estado</th>
                    <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                  </tr></thead>
                  <tbody>
                    {filteredItems.map((m) => (
                      <tr key={m.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-900 font-medium">{m.name}</td>
                        <td className="px-4 py-3 text-gray-700">{m.description || '—'}</td>
                        <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-md ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{m.is_active ? 'Activo' : 'Inactivo'}</span></td>
                        <td className="px-4 py-3"><div className="flex justify-end">
                          <button type="button" onClick={() => changeStatus(m)} disabled={changingId !== null} title={m.is_active ? 'Desactivar método de pago' : 'Activar método de pago'} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors disabled:opacity-60 ${m.is_active ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                            {m.is_active ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            {m.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
