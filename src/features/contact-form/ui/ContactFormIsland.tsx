import { useEffect, useId, useReducer, useRef, useState, type FormEvent } from 'react';
import { trackEvent } from '@/features/analytics';
import { readAttribution } from '@/features/attribution';
import { createId } from '@/shared/domain/id';
import type { LeadDeliveryMode } from '@/shared/config/env';
import { submitContactLead } from '../composition';
import type { LeadFormErrors, LeadFormInput, SubmitContext } from '../domain/lead';
import { formatPhoneInput } from '../domain/phone';
import { isVehicleSituation, VEHICLE_SITUATIONS, type VehicleSituation } from '../domain/situation';

type Props = {
  whatsappUrl: string;
  privacyUrl: string;
  formEnabled: boolean;
  consentVersion: string;
  page: string;
  delivery: LeadDeliveryMode;
  source: string;
  formTitle: string;
  formDescription: string;
  situationLabel: string;
};

type Values = {
  name: string;
  phone: string;
  situation: VehicleSituation | '';
  consent: boolean;
};

type State = {
  values: Values;
  errors: LeadFormErrors;
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
};

type Action =
  | { type: 'change'; field: keyof Values; value: string | boolean }
  | { type: 'submitting' }
  | {
      type: 'error';
      message: string;
      errors?: LeadFormErrors;
    }
  | { type: 'success' };

const initialState: State = {
  values: { name: '', phone: '', situation: '', consent: false },
  errors: {},
  status: 'idle',
  message: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'change': {
      const errors = { ...state.errors };
      delete errors[action.field as keyof LeadFormErrors];
      delete errors.form;
      return {
        ...state,
        status: state.status === 'error' ? 'idle' : state.status,
        message: state.status === 'error' ? '' : state.message,
        values: { ...state.values, [action.field]: action.value },
        errors,
      };
    }
    case 'submitting':
      return { ...state, status: 'submitting', errors: {}, message: '' };
    case 'error':
      return {
        ...state,
        status: 'error',
        message: action.message,
        errors: action.errors ?? {},
      };
    case 'success':
      return { ...state, status: 'success', errors: {}, message: '' };
    default:
      return state;
  }
}

function AlertIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5v5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.3" r="1.1" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8 12.2 2.5 2.5L16.2 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.33 4.94L2 22l5.35-1.4a9.9 9.9 0 0 0 4.69 1.2h.01c5.43 0 9.85-4.42 9.85-9.86A9.8 9.8 0 0 0 19 4.9 9.78 9.78 0 0 0 12.04 2Zm0 18.03h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.17.83.85-3.1-.2-.31a8.18 8.18 0 0 1-1.26-4.37 8.22 8.22 0 0 1 8.26-8.2 8.18 8.18 0 0 1 5.82 2.4 8.16 8.16 0 0 1 2.41 5.81 8.22 8.22 0 0 1-8.23 8.26Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

export default function ContactFormIsland({
  whatsappUrl,
  privacyUrl,
  formEnabled,
  consentVersion,
  page,
  delivery,
  source,
  formTitle,
  formDescription,
  situationLabel,
}: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const uid = useId();
  const nameId = `${uid}-name`;
  const phoneId = `${uid}-phone`;
  const situationId = `${uid}-situation`;
  const consentId = `${uid}-consent`;
  const errorId = `${uid}-error`;
  const successRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const situationRef = useRef<HTMLSelectElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef(0);
  const idempotencyRef = useRef('');
  const submittingRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
    idempotencyRef.current = createId();
    formRef.current?.setAttribute('data-hydrated', 'true');
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (state.status === 'success') {
      successRef.current?.focus();
    }
    if (state.status === 'error') {
      const firstField = (['name', 'phone', 'situation', 'consent'] as const).find(
        (field) => state.errors[field],
      );
      const refs = {
        name: nameRef,
        phone: phoneRef,
        situation: situationRef,
        consent: consentRef,
      } as const;
      if (firstField) {
        refs[firstField].current?.focus();
      } else {
        alertRef.current?.focus();
      }
    }
  }, [state.status, state.errors]);

  function change(field: keyof Values, value: string | boolean) {
    dispatch({ type: 'change', field, value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    const input: LeadFormInput = {
      name: state.values.name,
      phone: state.values.phone,
      situation: state.values.situation,
      consent: state.values.consent,
      website: honeypotRef.current?.value ?? '',
      startedAt: startedAtRef.current,
    };

    const context: SubmitContext = {
      attribution: readAttribution(),
      idempotencyKey: idempotencyRef.current || createId(),
      source,
      page,
      consentVersion,
    };

    dispatch({ type: 'submitting' });

    try {
      const outcome = await submitContactLead(input, context);

      if (outcome.kind === 'success' || outcome.kind === 'ignored') {
        dispatch({ type: 'success' });
        trackEvent('form_submit', {
          status: 'success',
          situation: state.values.situation || undefined,
          page,
        });
        return;
      }

      dispatch({
        type: 'error',
        message: outcome.failure.message,
        errors: outcome.failure.fieldErrors,
      });
      trackEvent('form_submit', {
        status: 'error',
        situation: state.values.situation || undefined,
        page,
      });
    } catch {
      dispatch({
        type: 'error',
        message: 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.',
      });
    } finally {
      submittingRef.current = false;
    }
  }

  if (!formEnabled) {
    return (
      <div className="rounded-[2px] border border-border bg-paper p-6 sm:p-8">
        <h2 className="font-display text-3xl text-ink">Fale com a equipe</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-2">
          O formulário está temporariamente indisponível. Você pode falar diretamente pelo WhatsApp,
          com o mesmo cuidado e sigilo.
        </p>
        <a
          href={whatsappUrl}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-brand px-5 text-sm font-bold text-white transition hover:bg-navy-800"
          target="_blank"
          rel="noopener noreferrer"
          data-wa
          data-wa-location="final"
        >
          <WhatsAppIcon />
          Falar pelo WhatsApp
        </a>
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <div className="rounded-[2px] border border-blue-200 bg-paper p-6 sm:p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-blue-50 text-brand">
          <CheckIcon className="size-6" />
        </span>
        <h2
          ref={successRef}
          tabIndex={-1}
          className="mt-4 font-display text-3xl text-ink focus:outline-none"
        >
          {delivery === 'mailto' ? 'Falta só enviar o e-mail.' : 'Recebemos sua solicitação.'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-2" role="status">
          {delivery === 'mailto'
            ? 'Abrimos o seu aplicativo de e-mail com a mensagem pronta para o escritório. Confira os dados e toque em enviar. Se o aplicativo não abriu, fale com o escritório pelo WhatsApp.'
            : 'A equipe entrará em contato pelo WhatsApp informado. Se preferir adiantar, você também pode falar agora com o escritório.'}
        </p>
        <a
          href={whatsappUrl}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-brand px-5 text-sm font-bold text-white transition hover:bg-navy-800"
          target="_blank"
          rel="noopener noreferrer"
          data-wa
          data-wa-location="final"
        >
          <WhatsAppIcon />
          Falar pelo WhatsApp
        </a>
      </div>
    );
  }

  const hasErrors = state.status === 'error';

  return (
    <div className="rounded-[2px] border border-border bg-paper p-6 sm:p-8">
      <p className="text-sm font-medium text-blue-600">Contato inicial</p>
      <h2 className="mt-2 font-display text-3xl text-ink">{formTitle}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-2">
        {formDescription}
        {delivery === 'mailto' &&
          ' Ao enviar, abriremos o seu aplicativo de e-mail com a mensagem pronta para o escritório.'}
      </p>

      {hasErrors && (
        <div
          ref={alertRef}
          tabIndex={-1}
          className="mt-5 flex gap-3 rounded-[2px] border border-ink/20 bg-blue-50 p-3.5 text-sm text-ink"
          role="alert"
          id={errorId}
        >
          <AlertIcon className="mt-0.5 size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <form
        ref={formRef}
        className="mt-6 space-y-4"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={state.status === 'submitting'}
        aria-describedby={hasErrors ? errorId : undefined}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={nameId}>
              Nome
            </label>
            <input
              ref={nameRef}
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              className="field-input"
              placeholder="Seu nome"
              value={state.values.name}
              onChange={(event) => change('name', event.target.value)}
              aria-invalid={Boolean(state.errors.name)}
              aria-describedby={state.errors.name ? `${nameId}-error` : undefined}
              maxLength={80}
              required
            />
            {state.errors.name && (
              <p className="field-error" id={`${nameId}-error`}>
                <AlertIcon className="mt-0.5 size-4 shrink-0" />
                {state.errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor={phoneId}>
              WhatsApp
            </label>
            <input
              ref={phoneRef}
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="field-input"
              placeholder="(71) 99999-9999"
              value={state.values.phone}
              onChange={(event) => change('phone', formatPhoneInput(event.target.value))}
              aria-invalid={Boolean(state.errors.phone)}
              aria-describedby={state.errors.phone ? `${phoneId}-error` : undefined}
              maxLength={20}
              required
            />
            {state.errors.phone && (
              <p className="field-error" id={`${phoneId}-error`}>
                <AlertIcon className="mt-0.5 size-4 shrink-0" />
                {state.errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor={situationId}>
            {situationLabel}
          </label>
          <select
            ref={situationRef}
            id={situationId}
            name="situation"
            className="field-input"
            value={state.values.situation}
            onChange={(event) => {
              const value = event.target.value;
              change('situation', isVehicleSituation(value) ? value : '');
            }}
            aria-invalid={Boolean(state.errors.situation)}
            aria-describedby={state.errors.situation ? `${situationId}-error` : undefined}
            required
          >
            <option value="">Selecione uma opção</option>
            {VEHICLE_SITUATIONS.map((situation) => (
              <option key={situation.value} value={situation.value}>
                {situation.label}
              </option>
            ))}
          </select>
          {state.errors.situation && (
            <p className="field-error" id={`${situationId}-error`}>
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {state.errors.situation}
            </p>
          )}
        </div>

        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Não preencha este campo</label>
          <input
            ref={honeypotRef}
            id={`${uid}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor={consentId}
            className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-text-2"
          >
            <input
              ref={consentRef}
              id={consentId}
              name="consent"
              type="checkbox"
              className="mt-1 size-5 shrink-0 rounded border-field accent-brand"
              checked={state.values.consent}
              onChange={(event) => change('consent', event.target.checked)}
              aria-invalid={Boolean(state.errors.consent)}
              aria-describedby={state.errors.consent ? `${consentId}-error` : undefined}
              required
            />
            <span>
              Autorizo o contato do escritório para tratar desta solicitação e li a{' '}
              <a
                href={privacyUrl}
                className="font-semibold text-brand underline decoration-blue-200 underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade
              </a>
              .
            </span>
          </label>
          {state.errors.consent && (
            <p className="field-error" id={`${consentId}-error`}>
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {state.errors.consent}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-brand px-5 text-sm font-bold text-white transition hover:bg-navy-800 disabled:cursor-wait disabled:opacity-70"
          disabled={state.status === 'submitting' || !hydrated}
        >
          {state.status === 'submitting' ? (
            <>
              <SpinnerIcon />
              Enviando…
            </>
          ) : delivery === 'mailto' ? (
            'Enviar por e-mail'
          ) : (
            'Solicitar contato'
          )}
        </button>

        <noscript>
          <p className="mt-3 text-sm leading-relaxed text-text-2">
            O envio pelo formulário precisa de JavaScript. Fale com o escritório pelo{' '}
            <a
              href={whatsappUrl}
              className="font-semibold text-brand underline decoration-blue-200 underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            .
          </p>
        </noscript>
      </form>

      <p className="mt-4 text-xs leading-relaxed text-text-2">
        Seus dados são usados para retornar este contato. Não há promessa de resultado e o envio não
        cria relação advogado-cliente antes da contratação.
      </p>

      <a
        href={whatsappUrl}
        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand underline decoration-blue-200 underline-offset-4 hover:text-navy-800"
        target="_blank"
        rel="noopener noreferrer"
        data-wa
        data-wa-location="final"
      >
        <WhatsAppIcon />
        Prefiro falar pelo WhatsApp
      </a>
    </div>
  );
}
