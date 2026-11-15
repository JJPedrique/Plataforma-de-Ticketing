import { Link } from 'react-router-dom';
import { Shield, Database, Eye, Lock, ArrowLeft, Server, UserCheck, Mail,CheckCircle2} from "lucide-react";

function PrivacyPolicy() {
  return (
    <div className="w-full max-w-5xl mx-auto pb-24 px-4 md:px-0">
      
      {/* NAVEGACIÓN */}
      <div className="pt-8 mb-4">
        <Link 
          to="/Inicio" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver al inicio
        </Link>
      </div>

      {/* SECCIÓN HERO */}
      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"></div>
            <Shield className="relative size-20 text-white bg-linear-to-br from-orange-500 to-orange-600 p-4 rounded-full shadow-lg shadow-orange-500/30" />
          </div>
        </div>
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 mb-4 leading-tight">
          Políticas de <span className="text-orange-600">Privacidad</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tu confianza es lo más importante para nosotros. Conoce cómo protegemos, gestionamos y utilizamos tu información personal.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Última actualización: Noviembre 2026
        </p>
      </div>

      {/* RESUMEN DE COMPROMISOS (Tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-20">
        <div className="p-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:border-orange-200 transition-all">
          <div className="inline-flex p-3 bg-orange-100 rounded-xl mb-4">
            <Lock className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Cifrado Total</h3>
          <p className="text-sm text-gray-700 leading-relaxed">Tus datos de pago y personales están protegidos con encriptación de grado bancario.</p>
        </div>
        <div className="p-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:border-orange-200 transition-all">
          <div className="inline-flex p-3 bg-orange-100 rounded-xl mb-4">
            <Eye className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Transparencia</h3>
          <p className="text-sm text-gray-700 leading-relaxed">Solo recopilamos lo estrictamente necesario para garantizar tu acceso a los eventos.</p>
        </div>
        <div className="p-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:border-orange-200 transition-all">
          <div className="inline-flex p-3 bg-orange-100 rounded-xl mb-4">
            <UserCheck className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Tú tienes el control</h3>
          <p className="text-sm text-gray-700 leading-relaxed">Puedes solicitar, modificar o eliminar tu información en cualquier momento.</p>
        </div>
      </div>

      {/* CONTENIDO DETALLADO DE POLÍTICAS */}
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Bloque 1 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Database className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">1. Información que recopilamos</h2>
          </div>
          <div className="prose prose-orange max-w-none text-gray-600 space-y-4">
            <p>
              Para brindarte la mejor experiencia al comprar tus boletos, necesitamos recopilar cierta información. Nos limitamos a pedir únicamente los datos necesarios para procesar tus compras y garantizar la seguridad de tu cuenta.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span><strong>Datos de identidad y contacto:</strong> Nombre completo, correo electrónico, número de teléfono y dirección de facturación.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span><strong>Datos financieros:</strong> Detalles parciales de tu tarjeta de crédito/débito. <em>Nota: No almacenamos los números completos de tus tarjetas, estos son procesados directamente por pasarelas de pago seguras.</em></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, zona horaria y sistema operativo para prevenir fraudes.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Server className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">2. Cómo usamos tu información</h2>
          </div>
          <div className="prose prose-orange max-w-none text-gray-600 space-y-4">
            <p>
              Utilizamos la información recopilada principalmente para procesar tus transacciones y enviarte tus boletos digitales de manera eficiente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Servicio Principal</h4>
                <p className="text-sm text-gray-600">Procesar pagos, emitir boletos digitales con códigos QR y gestionar reembolsos o cancelaciones de eventos.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Comunicación</h4>
                <p className="text-sm text-gray-600">Enviarte confirmaciones de compra, cambios de horario en los recintos o alertas de seguridad importantes.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Prevención de Fraude</h4>
                <p className="text-sm text-gray-600">Verificar la autenticidad de las compras para proteger tanto a los usuarios como a los organizadores.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Mejora de Experiencia</h4>
                <p className="text-sm text-gray-600">Recordar tus preferencias para recomendarte eventos similares en tu ciudad.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 3 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">3. Terceros y Organizadores</h2>
          </div>
          <div className="prose prose-orange max-w-none text-gray-600 space-y-4">
            <p>
              Nosotros <strong>no vendemos tus datos personales</strong> a terceros. Sin embargo, para cumplir con el servicio, compartimos información estrictamente necesaria con:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-orange-500">
              <li><strong>Organizadores del Evento:</strong> Compartimos tu nombre e email para fines de control de acceso y notificaciones específicas del show.</li>
              <li><strong>Proveedores de Pago:</strong> Entidades financieras que procesan y encriptan tu transacción.</li>
              <li><strong>Autoridades legales:</strong> Únicamente cuando sea requerido por ley para la prevención de fraudes o delitos cibernéticos.</li>
            </ul>
          </div>
        </div>

        {/* Contacto / Footer Call to action */}
        <div className="mt-16 bg-linear-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">¿Tienes dudas sobre tus datos?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Nuestro equipo de privacidad está disponible para responder cualquier inquietud sobre cómo manejamos tu información personal.
          </p>
          <a 
            href="mailto:privacidad@tusboletos.com" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
          >
            <Mail className="h-5 w-5" />
            Contactar a Soporte
          </a>
        </div>

      </div>
    </div>
  )
}

export default PrivacyPolicy