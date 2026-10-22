import { site } from '@/shared/config/site';

export const privacySeo = {
  title: 'Política de Privacidade | Monteiro Veloso Advogados',
  description:
    'Como o Monteiro Veloso Advogados trata dados pessoais no site, no formulário de contato e nos cookies de análise, com os direitos dos titulares.',
  path: '/politica-de-privacidade/',
  breadcrumb: [
    { name: 'Início', path: '/' },
    { name: 'Política de Privacidade', path: '/politica-de-privacidade/' },
  ],
};

export type PrivacySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export const privacyIntro =
  'Esta política explica como o Monteiro Veloso Advogados trata os dados pessoais informados neste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).';

export const privacyUpdatedAt = 'Outubro de 2026';

export const privacySections: PrivacySection[] = [
  {
    title: '1. Quem é o controlador',
    paragraphs: [
      `O controlador dos dados é ${site.legalName}, inscrita no CNPJ nº ${site.cnpj}, com endereço profissional em ${site.address.street}, ${site.address.number}, ${site.address.complement}, ${site.address.district}, ${site.address.city}-${site.address.state}, CEP ${site.address.postalCode}.`,
      `Para assuntos de privacidade, o contato é ${site.email}. O encarregado de dados pode ser contatado pelo mesmo canal.`,
    ],
  },
  {
    title: '2. Quais dados podem ser tratados',
    paragraphs: [
      'O site coleta apenas os dados necessários para as finalidades descritas abaixo. Você não é obrigado a enviar o formulário; o contato também pode ser feito pelo WhatsApp.',
      'Ao enviar o formulário, o seu próprio aplicativo de e-mail é aberto com a mensagem pronta. O envio parte da sua conta de e-mail, e é ela que transmite os dados ao escritório.',
    ],
    items: [
      'Dados de contato enviados no formulário: nome, número de WhatsApp e a situação informada sobre o veículo.',
      'Conteúdo da mensagem de e-mail que você envia ao escritório a partir do formulário.',
      'Registro do consentimento: versão do texto aceito e data e hora do aceite.',
      'Dados de atribuição: parâmetros de campanha (UTMs), identificadores de clique (como gclid e fbclid), página de entrada e referência.',
      'Dados técnicos de navegação: endereço IP, tipo de navegador, dispositivo, data e hora de acesso, registrados pela hospedagem para segurança e funcionamento do site.',
      'Dados de uso do site, somente se você autorizar o Google Analytics: páginas visitadas, tempo de permanência e interações, sem envio de nome ou telefone ao analytics.',
    ],
  },
  {
    title: '3. Para que os dados são usados',
    items: [
      'Responder à sua solicitação de contato e entender a situação relatada.',
      'Organizar o atendimento e, se houver contratação, cumprir obrigações contratuais e legais.',
      'Manter registros de consentimento e atender solicitações de titulares.',
      'Proteger o site contra abuso, spam e acessos indevidos.',
      'Entender, de forma agregada, como o site é utilizado, somente com o seu consentimento para análise.',
    ],
  },
  {
    title: '4. Bases legais',
    paragraphs: [
      'O tratamento pode se apoiar no consentimento (formulário e analytics), no cumprimento de obrigação legal ou regulatória, na execução de contrato ou em legítimo interesse para segurança e prevenção a fraudes, sempre limitado às finalidades informadas.',
    ],
  },
  {
    title: '5. Compartilhamento',
    paragraphs: [
      'Os dados podem ser tratados por fornecedores que apoiam a operação do site e do atendimento, como serviços de hospedagem, provedores de e-mail (o formulário abre o seu aplicativo de e-mail para o envio) e ferramentas do Google (mapas e analytics, quando autorizado). Se o formulário for configurado para envio automático, podem ser usados serviços de automação e armazenamento. Esses fornecedores atuam conforme instruções do escritório e obrigações de confidencialidade.',
      'O escritório não vende dados pessoais. O compartilhamento com autoridades ocorre apenas quando exigido por lei ou ordem competente.',
    ],
  },
  {
    title: '6. Transferência internacional',
    paragraphs: [
      'Alguns fornecedores podem processar dados fora do Brasil. Quando isso ocorrer, o escritório adota medidas contratuais e organizacionais para preservar os direitos dos titulares, conforme a LGPD.',
    ],
  },
  {
    title: '7. Retenção e eliminação',
    paragraphs: [
      'Os dados são mantidos pelo tempo necessário para responder à solicitação, cumprir obrigações legais, regulatórias ou contratuais e exercer direitos. Encerradas essas finalidades, os dados são eliminados ou anonimizados, ressalvadas as hipóteses de guarda obrigatória.',
    ],
  },
  {
    title: '8. Cookies e análise de uso',
    paragraphs: [
      'O site usa armazenamento estritamente necessário para lembrar a sua decisão de consentimento e preservar a atribuição da campanha durante a sessão. O Google Analytics só é carregado depois que você escolhe “Aceitar análise”.',
      'Você pode recusar ou mudar de ideia a qualquer momento em “Preferências de cookies”, no rodapé. A recusa não impede o acesso ao conteúdo nem o contato pelo WhatsApp.',
    ],
  },
  {
    title: '9. Direitos dos titulares',
    paragraphs: [
      'Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários, portabilidade, informação sobre compartilhamento e revogação do consentimento.',
      `Para exercer esses direitos, escreva para ${site.email}. A solicitação pode exigir confirmação de identidade para proteger os seus dados. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).`,
    ],
  },
  {
    title: '10. Segurança',
    paragraphs: [
      'O escritório adota medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, perda, alteração ou divulgação indevida. Nenhum ambiente é totalmente imune a incidentes; caso ocorra um incidente relevante, serão adotadas as providências previstas na LGPD.',
    ],
  },
  {
    title: '11. Alterações desta política',
    paragraphs: [
      'Esta política pode ser atualizada para refletir mudanças no site, nos fornecedores ou na legislação. A versão vigente é sempre a publicada nesta página, com a data de atualização indicada.',
    ],
  },
];
