function PagoCard2() {
    return ( <>
    
      )}
              {(metodoSeleccionado === 'zelle' || metodoSeleccionado === 'pagomovil' || metodoSeleccionado === 'binance' || metodoSeleccionado === 'paypal') && (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm text-gray-700 mb-2">Instrucciones de pago</p>
                  <p className="text-xs text-gray-600">Se generará un código o enlace de pago al confirmar</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Conexión segura y encriptada</span>
              </div>
              
              <button
                type="submit"
                disabled={procesando || tiempoRestante === 0}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  procesando || tiempoRestante === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                }`}
              >
                {procesando ? 'Procesando pago...' : tiempoRestante === 0 ? 'Tiempo expirado' : `Confirmar y pagar $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </>

   
    
    </> );
}

export default PagoCard2;