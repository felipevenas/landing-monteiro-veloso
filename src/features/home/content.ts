import type { FaqItem } from '@/shared/seo/json-ld';
import { site } from '@/shared/config/site';

export const homeSeo = {
  title: 'Monteiro Veloso Advogados | Advocacia em Salvador',
  description:
    'Escritório de advocacia em Salvador, com atuação em Direito Bancário e defesa de pessoas físicas nas relações com bancos. Atendimento presencial e online.',
  path: '/',
};

export const homeHero = {
  eyebrow: 'Monteiro Veloso Advogados',
  titleBefore: 'Advocacia com ',
  titleHighlight: 'escuta',
  titleAfter: ', clareza e estratégia.',
  subtitle:
    'Atuação concentrada em Direito Bancário, na defesa de pessoas físicas nas relações com instituições financeiras. Análise de contratos, encargos e cobranças que possam ser discutidos, no escritório em Salvador ou online em todo o Brasil.',
  primaryCta: 'Falar pelo WhatsApp',
  secondaryCta: 'Conhecer o escritório',
  imageAlt:
    'Retrato da advogada Roberta Veloso com os braços cruzados, em frente a uma parede de madeira',
  imageCaption: 'Dra. Roberta Veloso',
  imageRole: 'Advogada',
};

export const homeTrust = [
  { icon: 'lucide:building-2', label: 'Presencial e online' },
  { icon: 'lucide:heart-handshake', label: 'Atendimento humano' },
  { icon: 'lucide:shield-check', label: 'Sigilo profissional' },
  { icon: 'lucide:file-text', label: 'Orientação clara' },
];

export const homeAreas = {
  eyebrow: 'Áreas de atuação',
  title: 'Questões que pedem atenção e contexto',
  description:
    'O escritório concentra a atuação em temas de direito bancário e financiamento de veículo, com análise individualizada de cada contrato e processo.',
  items: [
    {
      icon: 'lucide:shield-alert',
      title: 'Busca e apreensão de veículo',
      text: 'Defesa em processos de busca e apreensão, com análise da regularidade da medida e dos documentos do financiamento.',
      href: '#contato',
      cta: 'Falar sobre este tema',
    },
    {
      icon: 'lucide:calculator',
      title: 'Revisional de financiamento',
      text: 'Estudo de cláusulas e encargos do contrato de financiamento de veículo para identificar eventuais cobranças que mereçam discussão.',
      href: '#contato',
      cta: 'Falar sobre este tema',
    },
    {
      icon: 'lucide:handshake',
      title: 'Orientação em cobrança',
      text: 'Orientação sobre a situação da dívida e os caminhos possíveis antes de assumir novos compromissos.',
      href: '#contato',
      cta: 'Falar sobre este tema',
    },
  ],
};

export const homeAbout = {
  eyebrow: 'O escritório',
  title: 'Técnica com atenção ao que importa para você',
  paragraphs: [
    'Monteiro Veloso Advogados é um escritório de advocacia sediado em Salvador, com atuação concentrada em Direito Bancário e na defesa de pessoas físicas nas relações com instituições financeiras.',
    'A atuação se apoia na leitura técnica do contrato, dos encargos e das cobranças, para identificar o que pode ser discutido. O atendimento parte da escuta: entender o que aconteceu, quais documentos existem e o que já foi feito. A partir daí, o cenário é explicado com clareza, sem prometer resultados que não dependem apenas do escritório.',
    'O escritório fica no Comércio, em Salvador, e o atendimento online alcança todo o Brasil. Para visitar, combine o horário com a equipe pelo WhatsApp.',
  ],
  cta: 'Falar com a equipe',
  ctaHref: '#contato',
};

export const homeProcess = {
  eyebrow: 'Como funciona',
  title: 'Do primeiro contato ao acompanhamento, sem etapas escondidas',
  description:
    'Você sabe o que acontece em cada momento e o que precisa ser decidido, da conversa inicial até o acompanhamento do caso.',
  steps: [
    {
      number: '01',
      title: 'Primeiro contato',
      text: 'Você conta o que aconteceu pelo WhatsApp, pelo e-mail ou pelo formulário. A equipe organiza a conversa e define a melhor forma de seguir.',
    },
    {
      number: '02',
      title: 'Leitura do caso',
      text: 'Com os documentos disponíveis, são examinados o contrato, o processo e a situação da dívida.',
    },
    {
      number: '03',
      title: 'Orientação',
      text: 'Você recebe uma explicação sobre os caminhos possíveis, com transparência sobre limites e riscos.',
    },
    {
      number: '04',
      title: 'Acompanhamento',
      text: 'Havendo contratação, o caso segue com acompanhamento pelo canal combinado com a equipe.',
    },
  ],
};

export const homeDifferentials = {
  eyebrow: 'Por que Monteiro Veloso',
  title: 'Técnica com atenção ao contexto de cada pessoa',
  description:
    'A forma de explicar importa tanto quanto a técnica. O atendimento é conduzido para que você entenda o que está sendo feito e por quê.',
  items: [
    {
      icon: 'lucide:scale',
      title: 'Atuação concentrada',
      text: 'O escritório concentra a prática em direito bancário e financiamento de veículo, em vez de atuar em todas as áreas.',
    },
    {
      icon: 'lucide:message-square-text',
      title: 'Explicação sem juridiquês',
      text: 'Você entende o que está sendo feito, o que ainda depende de decisão e quais são os riscos envolvidos.',
    },
    {
      icon: 'lucide:lock-keyhole',
      title: 'Sigilo profissional',
      text: 'As informações do seu caso são tratadas com sigilo e de acordo com a Lei Geral de Proteção de Dados.',
    },
    {
      icon: 'lucide:video',
      title: 'Presencial e online',
      text: 'Atendimento no escritório, no Comércio, com horário combinado, ou online, por videochamada, para clientes de todo o Brasil.',
    },
  ],
};

export const homeFaq: FaqItem[] = [
  {
    question: 'Como funciona o primeiro contato?',
    answer:
      'Você pode falar pelo WhatsApp, enviar um e-mail ou preencher o formulário do site. A equipe responde para entender a situação e organizar os próximos passos. O contato inicial não cria, por si só, uma relação de contratação.',
  },
  {
    question: 'Preciso ter documentos em mãos para ser atendido?',
    answer:
      'Não. Ter o contrato, as notificações e o número do processo ajuda a tornar a análise mais objetiva, mas a conversa pode começar sem eles. Os documentos são reunidos ao longo do atendimento.',
  },
  {
    question: 'O atendimento é presencial ou online?',
    answer:
      'Os dois. O escritório fica no Comércio, em Salvador, com atendimento presencial mediante hora combinada. Também há atendimento online, por WhatsApp, e-mail ou videochamada, para clientes de todo o Brasil.',
  },
  {
    question: 'Meus dados ficam protegidos?',
    answer:
      'Sim. O tratamento das informações segue o sigilo profissional e a Lei Geral de Proteção de Dados (LGPD). Os detalhes estão na Política de Privacidade do site.',
  },
  {
    question: 'Os honorários são combinados antes da contratação?',
    answer:
      'Sim. As condições são apresentadas com transparência antes de qualquer contratação, conforme as normas da OAB. Nenhum resultado é garantido.',
  },
  {
    question: 'Como chegar ao escritório?',
    answer: `O escritório fica na ${site.address.street}, ${site.address.number}, ${site.address.complement}, no Comércio, em Salvador. O atendimento presencial é feito com hora combinada; fale com a equipe antes de visitar.`,
  },
];

export const homeLocation = {
  eyebrow: 'Onde estamos',
  title: 'No Comércio, em Salvador',
  description:
    'A sede fica na Rua Portugal, 17, Ed. Regente Feijó. O atendimento presencial é feito com hora combinada, e o atendimento online alcança todo o Brasil.',
  address: `${site.address.street}, ${site.address.number}, ${site.address.complement}`,
  district: `${site.address.district}, ${site.address.city}-${site.address.state}`,
  postalCode: `CEP ${site.address.postalCode}`,
};

export const homeContact = {
  source: 'home',
  eyebrow: 'Fale com o escritório',
  title: 'Uma conversa pode organizar o próximo passo.',
  description:
    'Se o seu veículo foi apreendido, você recebeu uma notificação ou está com parcelas atrasadas, fale com a equipe. O retorno é feito com sigilo e atenção ao seu contexto.',
  benefits: [
    'Presencial em Salvador ou online em todo o Brasil',
    'Sigilo profissional em todas as etapas',
    'Análise individualizada, sem promessa de resultado',
  ],
  formTitle: 'Solicitar contato',
  formDescription:
    'Preencha os dados abaixo e a equipe retorna pelo WhatsApp informado, com sigilo.',
  situationLabel: 'Qual é a sua situação?',
};

export const homeCoverage = {
  eyebrow: 'Atendimento',
  title: 'Online em todo o Brasil, com base em Salvador',
  description:
    'O escritório fica no Comércio, em Salvador, e o atendimento online alcança todos os estados. Documentos, reuniões e acompanhamento acontecem por WhatsApp, e-mail ou videochamada, com o mesmo sigilo do atendimento presencial.',
  points: [
    'Documentos recebidos por canal digital e sigiloso',
    'Reuniões por videochamada, quando preferir',
    'Acompanhamento pelo canal combinado com a equipe',
    'Presencial no Comércio, para quem está em Salvador',
  ],
  legendOffice: 'Sede: Salvador, Bahia',
  legendOnline: 'Atendimento online: todos os estados',
  cta: 'Falar pelo WhatsApp',
};
