import type { Attribution } from '@/shared/domain/attribution';
import type { VehicleSituation } from './situation';

export type LeadField = 'name' | 'phone' | 'situation' | 'consent';

export type LeadFormErrors = Partial<Record<LeadField | 'form', string>>;

export type LeadFormInput = {
  name: string;
  phone: string;
  situation: VehicleSituation | '';
  consent: boolean;
  website: string;
  startedAt: number;
};

export type Lead = {
  name: string;
  phoneE164: string;
  phoneDisplay: string;
  situation: VehicleSituation;
  consent: {
    accepted: true;
    version: string;
    acceptedAt: string;
  };
  attribution: Attribution;
  source: string;
  page: string;
  submittedAt: string;
  idempotencyKey: string;
};

export type SubmitFailureCode =
  'validation' | 'network' | 'timeout' | 'server' | 'rate_limited' | 'disabled' | 'bot';

export type SubmitFailure = {
  code: SubmitFailureCode;
  message: string;
  fieldErrors?: LeadFormErrors;
};

export type SubmitReceipt = {
  id: string;
  receivedAt: string;
};

export type SubmitOutcome =
  | { kind: 'success'; receipt: SubmitReceipt }
  | { kind: 'ignored' }
  | { kind: 'error'; failure: SubmitFailure };

export type SubmitContext = {
  attribution: Attribution;
  idempotencyKey: string;
  source: string;
  page: string;
  consentVersion: string;
};
