import type { Result } from '@/shared/domain/result';
import type { Lead, SubmitFailure, SubmitReceipt } from '../domain/lead';

export interface LeadGateway {
  submit(lead: Lead): Promise<Result<SubmitReceipt, SubmitFailure>>;
}
