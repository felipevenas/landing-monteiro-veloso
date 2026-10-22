import { loadEnv } from 'vite';
import { configFields, site } from '../src/shared/config/site';
import { isPending } from '../src/shared/config/field';

const allowPlaceholders = process.argv.includes('--allow-placeholders');
const env = loadEnv('production', process.cwd(), '');
const formEnabled = (env.PUBLIC_FORM_ENABLED ?? 'true').toLowerCase() !== 'false';
const webhook = (env.PUBLIC_N8N_WEBHOOK_URL ?? '').trim();
const gtm = (env.PUBLIC_GTM_ID ?? '').trim();
const delivery = (env.PUBLIC_LEAD_DELIVERY ?? '').trim().toLowerCase();
const leadDelivery =
  delivery === 'webhook' || delivery === 'mailto' ? delivery : webhook ? 'webhook' : 'mailto';

const errors: string[] = [];
const warnings: string[] = [];

for (const entry of configFields) {
  const pending = isPending(entry.field) || entry.field.value.includes('[PREENCHER]');
  if (!pending) continue;

  const detail = `${entry.path}: ${entry.field.label}`;
  if (entry.field.required) {
    errors.push(`Campo obrigatório pendente: ${detail}`);
  } else {
    warnings.push(`Campo opcional pendente: ${detail}`);
  }
}

if (formEnabled && leadDelivery === 'webhook' && !webhook) {
  errors.push(
    'PUBLIC_N8N_WEBHOOK_URL está vazio com PUBLIC_LEAD_DELIVERY=webhook. Configure o webhook, use o envio por e-mail (mailto) ou defina PUBLIC_FORM_ENABLED=false.',
  );
}

if (formEnabled && leadDelivery === 'mailto' && !site.email) {
  errors.push('site.email está vazio: o envio por e-mail precisa de um destinatário.');
}

if (!gtm) {
  warnings.push('PUBLIC_GTM_ID vazio: o analytics ficará em modo Noop.');
}

if (site.lawyer.oab.value && !/^\d{4,8}$/.test(site.lawyer.oab.value.replace(/\D/g, ''))) {
  warnings.push('OAB/BA deve conter apenas o número de inscrição (4 a 8 dígitos).');
}

if (warnings.length > 0) {
  console.log('\nAvisos de lançamento:');
  for (const warning of warnings) console.log(`  • ${warning}`);
}

if (errors.length > 0) {
  console.log('\nPendências obrigatórias:');
  for (const error of errors) console.log(`  ✗ ${error}`);
  console.log(
    allowPlaceholders
      ? '\nPreview permitido: os placeholders continuam no build e NÃO devem ir para produção.'
      : '\nBuild de produção bloqueado. Preencha os campos ou use "npm run build:preview".',
  );
  if (!allowPlaceholders) process.exitCode = 1;
} else {
  console.log(
    `\ncheck:launch OK: dados obrigatórios preenchidos e entrega de lead em modo "${leadDelivery}".`,
  );
}
