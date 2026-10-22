import type { FaqItem } from '@/shared/seo/json-ld';
import { site } from '@/shared/config/site';

export const landingSeo = {
  title: 'Busca e apreensão de veículo em Salvador | Advogada',
  description:
    'Veículo apreendido ou em risco de busca e apreensão? Entenda seus direitos e fale com uma advogada, presencial em Salvador ou online em todo o Brasil.',
  path: '/defesa-busca-e-apreensao-veiculo/',
  breadcrumb: [
    { name: 'Início', path: '/' },
    { name: 'Busca e apreensão de veículo', path: '/defesa-busca-e-apreensao-veiculo/' },
  ],
};

export const hero = {
  eyebrow: 'Advocacia bancária em Salvador',
  titleBefore: 'Seu carro foi apreendido ou está em risco de ',
  titleHighlight: 'busca e apreensão',
  titleAfter: '?',
  subtitle:
    'Entenda o que está acontecendo, quais são os prazos e como se defender, com atendimento humano, sigiloso e individualizado, presencial em Salvador ou online em todo o Brasil.',
  primaryCta: 'Falar pelo WhatsApp',
  secondaryCta: 'Entender o processo',
  imageAlt: 'Advogada Roberta Veloso em pé, segurando um tablet, em frente a uma parede de madeira',
  imageCaption: 'Dra. Roberta Veloso',
  imageRole: 'Advogada',
  trust: ['Sigilo profissional', 'Análise individualizada', 'Sem promessa de resultado'],
};

export const trustItems = [
  { icon: 'lucide:building-2', label: 'Presencial e online' },
  { icon: 'lucide:heart-handshake', label: 'Atendimento humano' },
  { icon: 'lucide:shield-check', label: 'Sigilo profissional' },
  { icon: 'lucide:file-text', label: 'Orientação clara' },
];

export const empathy = {
  eyebrow: 'Entenda a situação',
  title: 'A apreensão do veículo não é o fim da história.',
  description:
    'Receber uma notificação ou descobrir que o carro foi apreendido costuma gerar dúvidas e decisões precipitadas. Antes de agir, é importante entender o contrato, a situação das parcelas e o que o processo permite.',
  cards: [
    {
      icon: 'lucide:file-search',
      title: 'O que pode ter acontecido',
      text: 'Na alienação fiduciária, o veículo funciona como garantia do financiamento. Em caso de inadimplência, o credor pode buscar a apreensão conforme o contrato e a lei. Cada caso tem particularidades.',
    },
    {
      icon: 'lucide:hand',
      title: 'O que evitar',
      text: 'Não assine acordos ou faça pagamentos sem entender o que está sendo cobrado. Também evite entregar documentos por canais informais ou decidir apenas com base em mensagens de cobrança.',
    },
    {
      icon: 'lucide:folder-open',
      title: 'O que reunir',
      text: 'Contrato de financiamento, notificações, número do processo (se houver), comprovantes de pagamento e documentos do veículo ajudam na análise inicial.',
    },
  ],
};

export const bio = {
  eyebrow: 'Quem conduz o atendimento',
  title: 'Escuta antes de qualquer resposta.',
  paragraphs: [
    'Roberta Victoria Monteiro Veloso Santos é advogada com atuação concentrada em Direito Bancário e na defesa de pessoas físicas nas relações com instituições financeiras.',
    'O escritório fica no Comércio, em Salvador, e o atendimento online alcança clientes de todo o Brasil. O cuidado é o mesmo: entender o contexto de cada pessoa, o que aconteceu, o que já foi feito e quais documentos existem.',
    'O compromisso é explicar o cenário com clareza, sem prometer resultados que não dependem apenas do escritório.',
  ],
  quote:
    'Cada história tem detalhes que só aparecem quando alguém para para ouvir. É por aí que começa uma orientação responsável.',
  imageAlt:
    'Retrato da advogada Roberta Veloso, com a mão no queixo, em frente a uma parede de madeira',
};

export const education = {
  eyebrow: 'O básico, sem juridiquês',
  title: 'Busca e apreensão: o que você precisa saber',
  description:
    'Três pontos para chegar à conversa com mais clareza. Este conteúdo é informativo e não substitui a análise do seu caso.',
  cards: [
    {
      icon: 'lucide:scale',
      title: 'O que é',
      text: 'É uma medida judicial que pode ser pedida pelo credor quando o contrato de financiamento com garantia de veículo prevê a busca e apreensão e há inadimplência. O veículo pode ser apreendido e, conforme o caso, consolidado em favor do credor.',
    },
    {
      icon: 'lucide:calendar-clock',
      title: 'Quando pode acontecer',
      text: 'Após o atraso no pagamento, o credor pode iniciar o procedimento previsto no contrato e na legislação. Notificações e prazos variam; por isso, a leitura do processo é importante.',
    },
    {
      icon: 'lucide:route',
      title: 'O que fazer',
      text: 'Procure orientação antes de entregar o veículo, assinar documentos ou pagar valores sem entender a origem da cobrança. Reúna os documentos e busque uma análise individualizada.',
    },
  ],
};

export const services = {
  eyebrow: 'Como o escritório pode ajudar',
  title: 'Atuação focada no seu caso',
  description:
    'O primeiro passo é entender o contrato e o processo. A partir daí, são avaliados os caminhos possíveis, sempre com transparência sobre limites e riscos.',
  items: [
    {
      icon: 'lucide:shield-alert',
      title: 'Defesa em busca e apreensão',
      text: 'Análise do processo e da medida, com atuação para discutir a regularidade da apreensão e proteger os direitos do proprietário.',
      href: '#contato',
      cta: 'Conversar sobre defesa',
    },
    {
      icon: 'lucide:calculator',
      title: 'Revisional de financiamento',
      text: 'Estudo das cláusulas e encargos do contrato de financiamento de veículo para identificar eventuais cobranças que mereçam discussão.',
      href: '#contato',
      cta: 'Conversar sobre revisional',
    },
    {
      icon: 'lucide:handshake',
      title: 'Orientação em cobrança e negociação',
      text: 'Orientação sobre a situação da dívida e sobre os caminhos possíveis antes de assumir novos compromissos.',
      href: '#contato',
      cta: 'Conversar sobre a dívida',
    },
  ],
  note: 'Cada serviço depende de análise prévia e contratação formal. Nenhum resultado é garantido.',
};

export const checklist = {
  eyebrow: 'Para adiantar',
  title: 'Separe estas informações antes do contato',
  description:
    'Não é necessário ter tudo em mãos para conversar. Se tiver, estes itens ajudam a tornar a análise mais objetiva.',
  items: [
    'Contrato de financiamento do veículo',
    'Notificações, cartas ou mensagens de cobrança',
    'Número do processo, se houver',
    'Comprovantes de pagamento das parcelas',
    'Documentos pessoais e do veículo (CRLV)',
  ],
  note: 'Não envie documentos por redes sociais. Combine com a equipe um canal seguro.',
};

export const process = {
  eyebrow: 'Como funciona',
  title: 'Um caminho claro, do primeiro contato ao acompanhamento',
  description:
    'Sem etapas escondidas. Você sabe o que acontece em cada momento e o que precisa ser decidido.',
  steps: [
    {
      number: '01',
      title: 'Contato inicial',
      text: 'Você conta o que aconteceu pelo WhatsApp ou pelo formulário. O escritório verifica a melhor forma de seguir.',
    },
    {
      number: '02',
      title: 'Análise do caso',
      text: 'Com os documentos disponíveis, são examinados o contrato, o processo e a situação da dívida.',
    },
    {
      number: '03',
      title: 'Orientação e estratégia',
      text: 'Você recebe uma explicação sobre os caminhos possíveis e os próximos passos, com transparência sobre limites e riscos.',
    },
    {
      number: '04',
      title: 'Acompanhamento',
      text: 'Se houver contratação, o caso segue com acompanhamento e comunicação pelo canal combinado.',
    },
  ],
};

export const differentials = {
  eyebrow: 'Por que Monteiro Veloso',
  title: 'Técnica sem perder o lado humano',
  items: [
    {
      icon: 'lucide:map-pin',
      title: 'Presencial e online',
      text: 'Atendimento no Comércio, em Salvador, com hora combinada, e atendimento online para clientes de todo o Brasil.',
    },
    {
      icon: 'lucide:message-square-text',
      title: 'Comunicação clara',
      text: 'Explicações em linguagem acessível, sem juridiquês desnecessário.',
    },
    {
      icon: 'lucide:lock-keyhole',
      title: 'Sigilo e cuidado',
      text: 'Informações tratadas com sigilo profissional e de acordo com a LGPD.',
    },
    {
      icon: 'lucide:headset',
      title: 'Canal exclusivo para clientes',
      text: 'Depois da contratação, clientes contam com um canal exclusivo para o acompanhamento.',
    },
  ],
};

export const faq: FaqItem[] = [
  {
    question: 'Meu carro foi apreendido. O que devo fazer primeiro?',
    answer:
      'Procure orientação antes de tomar decisões. Reúna o contrato, a notificação e, se houver, o número do processo. Evite pagar ou assinar qualquer documento sem entender a cobrança. Cada caso precisa ser analisado individualmente.',
  },
  {
    question: 'A busca e apreensão pode ser revertida?',
    answer:
      'Depende do contrato, do processo e das circunstâncias. Não existe garantia de resultado. Um advogado precisa examinar o caso concreto para avaliar quais medidas são possíveis.',
  },
  {
    question: 'Preciso estar com as parcelas em dia para ser atendido?',
    answer:
      'Não. O atendimento parte da situação atual. A análise verifica o que aconteceu, quais documentos existem e quais caminhos podem ser discutidos.',
  },
  {
    question: 'Vocês atendem fora de Salvador?',
    answer:
      'Sim. O escritório fica em Salvador, com atendimento presencial mediante hora combinada, e também atende online em todo o Brasil, por WhatsApp, e-mail ou videochamada.',
  },
  {
    question: 'Como funcionam os honorários?',
    answer:
      'Os honorários dependem do caso e são informados com transparência antes da contratação, conforme as normas da OAB. Não há promessa de resultado.',
  },
  {
    question: 'O contato é sigiloso?',
    answer:
      'Sim. As informações são tratadas com sigilo profissional e conforme a Lei Geral de Proteção de Dados (LGPD).',
  },
  {
    question: 'O que é a revisional de financiamento?',
    answer:
      'É uma análise do contrato de financiamento para verificar se há cláusulas ou encargos que possam ser discutidos. A viabilidade depende do contrato e das circunstâncias do caso.',
  },
];

export const location = {
  eyebrow: 'Onde estamos',
  title: 'No Comércio, em Salvador',
  description:
    'O escritório fica na Rua Portugal, 17, Ed. Regente Feijó. Para visitar, combine o horário com a equipe pelo WhatsApp. Se preferir, o atendimento online atende todo o Brasil.',
  address: `${site.address.street}, ${site.address.number}, ${site.address.complement}`,
  district: `${site.address.district}, ${site.address.city}-${site.address.state}`,
  postalCode: `CEP ${site.address.postalCode}`,
};

export const contactSection = {
  source: 'lp-busca-apreensao',
  eyebrow: 'Próximo passo',
  title: 'Você não precisa decidir sozinho.',
  description:
    'Conte o que aconteceu. A primeira conversa serve para entender a situação, organizar os documentos e explicar quais caminhos existem, com clareza e sem promessa de resultado.',
  benefits: [
    'Presencial em Salvador ou online em todo o Brasil',
    'Sigilo profissional em todas as etapas',
    'Análise individualizada, sem promessa de resultado',
  ],
  formTitle: 'Solicitar contato',
  formDescription:
    'Preencha os dados abaixo. O retorno é feito pelo WhatsApp informado, com sigilo.',
  situationLabel: 'O que aconteceu com o veículo?',
};
