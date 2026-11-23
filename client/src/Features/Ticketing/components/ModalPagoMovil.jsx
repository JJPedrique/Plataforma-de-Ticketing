import { useEffect, useRef, useState } from "react";
import { Building2, Calendar, Check, Copy, Hash, Phone } from "lucide-react";
import Modal from "../../../shared/components/Modal";
import SelectInput from "../../../shared/components/SelectInput";

// Datos de la cuenta receptora: sustituir por la configuración real cuando esté disponible.
const DESTINATION_ACCOUNTS = [
  { id: 'bov', bank: 'Banco de Venezuela', rif: 'J-12345678-9', phone: '0412-1234567' },
  { id: 'banesco', bank: 'Banesco', rif: 'J-12345678-9', phone: '0414-9876543' },
  { id: 'provincial', bank: 'Banco Provincial', rif: 'J-12345678-9', phone: '0424-4567890' },
];

const ORIGIN_BANKS = [
  'Banco de Venezuela',
  'Banesco',
  'Banco Provincial',
  'Mercantil',
  'Bancamiga',
  'Banco Occidental de Descuento',
  'Venezolano de Crédito',
];

const OPERATOR_CODES = ['0412', '0414', '0424', '0416', '0426', '0422'];
const PHONE_PATTERN = /^\d{7}$/;
const REFERENCE_PATTERN = /^\d{6,16}$/;

const inputClassName = 'w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';

function getToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  return (
    <button type="button" onClick={handleCopy} title={label} aria-label={label}
      className="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer">
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700">Copiado</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copiar</span>
        </>
      )}
    </button>
  );
}

function DataRow({ label, value, copyLabel }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="font-mono text-sm text-gray-800 break-all">{value}</p>
      </div>
      <CopyButton value={value} label={copyLabel} />
    </div>
  );
}

function ModalPagoMovil({ isOpen, onClose = () => {}, onSubmit, amount = 0 }) {
  const [destinationId, setDestinationId] = useState(DESTINATION_ACCOUNTS[0].id);
  const [form, setForm] = useState(() => ({
    originBank: '',
    operatorCode: OPERATOR_CODES[0],
    phone: '',
    date: getToday(),
    reference: '',
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const destination = DESTINATION_ACCOUNTS.find((account) => account.id === destinationId) ?? DESTINATION_ACCOUNTS[0];
  const amountText = Number(amount || 0).toFixed(2);
  const today = getToday();

  const isValid = Boolean(
    form.originBank &&
    PHONE_PATTERN.test(form.phone) &&
    form.date &&
    REFERENCE_PATTERN.test(form.reference)
  );

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleDestinationChange = (bank) => {
    const account = DESTINATION_ACCOUNTS.find((item) => item.bank === bank);
    if (account) setDestinationId(account.id);
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitError('');
    setSubmitting(true);
    try {
      await onSubmit?.({
        bancoDestino: destination.bank,
        rifDestino: destination.rif,
        telefonoDestino: destination.phone,
        bancoOrigen: form.originBank,
        codigoOperadora: form.operatorCode,
        telefonoOrigen: `${form.operatorCode}${form.phone}`,
        fechaPago: form.date,
        referencia: form.reference,
        monto: Number(amount || 0),
        moneda: 'USD',
      });
    } catch (error) {
      setSubmitError(error.message || 'No se pudo confirmar el pago. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Pago Móvil" preventCloseOnOverlayClick={submitting}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-orange-700">Monto a pagar</p>
            <p className="text-2xl font-bold text-orange-700">
              ${amountText} <span className="text-xs font-semibold">USD</span>
            </p>
          </div>
          <CopyButton value={amountText} label="Copiar monto" />
        </div>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-orange-500" /> Realiza tu pago móvil a
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <SelectInput
              label="Banco receptor"
              values={DESTINATION_ACCOUNTS.map((account) => account.bank)}
              initialValue={DESTINATION_ACCOUNTS[0].bank}
              setValue={handleDestinationChange}
              autoFocus
            />
            <DataRow label="RIF" value={destination.rif} copyLabel="Copiar RIF" />
            <DataRow label="Teléfono" value={destination.phone} copyLabel="Copiar teléfono" />
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="h-4 w-4 text-orange-500" /> Ingresa los datos de tu pago móvil
          </h4>

          <SelectInput label="Banco de origen" values={ORIGIN_BANKS} setValue={(value) => updateField('originBank', value)} />

          <div className="grid grid-cols-[minmax(0,7rem)_1fr] gap-3">
            <SelectInput
              label="Código"
              values={OPERATOR_CODES}
              initialValue={OPERATOR_CODES[0]}
              setValue={(value) => updateField('operatorCode', value)}
            />
            <div>
              <label htmlFor="paymovil-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="paymovil-phone" name="phone" type="tel" inputMode="numeric" required
                  pattern="\d{7}" minLength={7} maxLength={7} placeholder="1234567"
                  title="Ingresa los 7 dígitos de tu teléfono, sin el código de operadora"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 7))}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="paymovil-date" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha del pago</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="paymovil-date" name="date" type="date" required max={today}
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="paymovil-reference" className="block text-sm font-medium text-gray-700 mb-1.5">Referencia</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="paymovil-reference" name="reference" type="text" inputMode="numeric" required
                pattern="\d{6,16}" minLength={6} maxLength={16} placeholder="123456"
                title="Ingresa la referencia bancaria: entre 6 y 16 dígitos, sin espacios ni guiones"
                value={form.reference}
                onChange={(e) => updateField('reference', e.target.value.replace(/\D/g, '').slice(0, 16))}
                className={`${inputClassName} font-mono`}
              />
            </div>
          </div>
        </section>

        {submitError && (
          <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm" role="alert">
            {submitError}
          </div>
        )}

        <button type="submit" disabled={!isValid || submitting}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Validando...' : 'Confirmar pago'}
        </button>
      </form>
    </Modal>
  );
}

export default ModalPagoMovil;
