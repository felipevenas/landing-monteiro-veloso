import type { FaqItem } from '@/shared/seo/json-ld';
import { site } from '@/shared/config/site';

export const landingSeo = {
  title: 'Carro apreendido? Defesa em busca e apreensão | Salvador',
  description:
    'Carro apreendido ou em risco de busca? Entenda os prazos e defenda seu veículo com advogada de direito bancário. Salvador e todo o Brasil.',
  path: '/defesa-busca-e-apreensao-veiculo/',
  breadcrumb: [
    { name: 'Início', path: '/' },
    { name: 'Busca e apreensão de veículo', path: '/defesa-busca-e-apreensao-veiculo/' },
  ],
};

export const hero = {
  label: 'Busca e apreensão de veículo',
  location: 'Salvador · todo o Brasil',
  titleBefore: 'Carro apreendido? ',
  titleHighlight: 'Cada dia conta.',
  titleAfter: '',
  subtitle:
    'O banco tem prazo, procedimento e equipe jurídica. Nós conhecemos o caminho que ele usa — e onde ele erra. Análise do contrato e do processo, direto com a advogada, em Salvador ou online.',
  primaryCta: 'Falar com a advogada agora',
  secondaryCta: 'Entender meu prazo',
  imageAlt:
    'Carro prata sendo içado pela plataforma de um guincho em uma rua brasileira ao amanhecer',
  imageCaption: 'Dra. Roberta Veloso',
  imageRole: 'Advogada',
  imageNote: 'Apreensão registrada · prazo correndo',
};

export const timeline = {
  eyebrow: 'O caminho até o guincho',
  bannerNote: 'Busca e apreensão · Decreto-Lei 911/69',
  title: 'Ninguém te avisa quando o prazo começa a correr.',
  description:
    'A busca e apreensão segue uma sequência. Cada etapa abre — e fecha — possibilidades de defesa. Saber onde você está muda o que ainda dá para fazer.',
  steps: [
    {
      number: '01',
      title: 'A parcela atrasa',
      text: 'A mora precisa ser constituída por notificação. Muitos processos começam errado aqui.',
    },
    {
      number: '02',
      title: 'A notificação chega',
      text: 'O banco tem que comprovar o aviso, com valor e prazo.',
    },
    {
      number: '03',
      title: 'O banco vai à Justiça',
      text: 'A liminar pode ser concedida antes mesmo da sua citação.',
    },
    {
      number: '04',
      title: 'O guincho leva o carro',
      text: 'Começa o prazo de 5 dias para pagar a dívida integral e tentar reaver o veículo.',
    },
    {
      number: '05',
      title: 'O carro é consolidado',
      text: 'Sem pagamento, a propriedade se consolida no banco. A estratégia muda de foco.',
    },
  ],
  highlight: {
    value: '5',
    unit: 'dias',
    text: 'é o prazo legal, contado da apreensão, para pagar a dívida integral e tentar reaver o veículo.',
  },
  note: 'Conteúdo informativo. Prazos e efeitos dependem do contrato e do processo de cada caso.',
  cta: 'Não sei em que etapa estou',
};

export const empathy = {
  eyebrow: 'O que o banco não te conta',
  title: 'A apreensão pode ser legal. A conta, nem sempre.',
  description:
    'Antes de entregar o carro, assinar qualquer documento ou pagar o que estão pedindo, existem três coisas que precisam ser conferidas.',
  cards: [
    {
      number: '01',
      title: 'A notificação precisa ser válida',
      text: 'O banco tem que comprovar que avisou você, com valor e prazo. Uma notificação vazia ou genérica pode derrubar a mora — e mudar o processo inteiro.',
    },
    {
      number: '02',
      title: 'O valor cobrado pode estar inflado',
      text: 'Juros, tarifas e seguros embutidos mudam o total da dívida. Pagar sem conferir é caro. Conferir antes de pagar é estratégia.',
    },
    {
      number: '03',
      title: 'O carro pode voltar',
      text: 'Dentro do prazo legal, o pagamento da dívida integral pode devolver o veículo. Depois da consolidação, a defesa passa a mirar o prejuízo e o que foi cobrado a mais.',
    },
  ],
  note: 'Conteúdo informativo. Nenhum resultado é garantido: cada contrato e cada processo precisam ser analisados individualmente.',
};

export const services = {
  eyebrow: 'O que a gente faz no seu caso',
  title: 'Não é orientação genérica. É intervenção.',
  description:
    'Sem resposta pronta. Lemos o contrato, o processo e as cobranças para definir o que atacar, em que ordem e com qual objetivo.',
  items: [
    {
      number: '01',
      title: 'Defesa na busca e apreensão',
      text: 'Contestamos a liminar, apontamos falhas na notificação e nos valores e buscamos a restituição do veículo ou a redução do prejuízo.',
      href: '#contato',
      cta: 'Quero defender meu carro',
    },
    {
      number: '02',
      title: 'Revisional do financiamento',
      text: 'Auditamos juros, tarifas, seguros e encargos. O que estiver fora da média entra na discussão — antes ou depois da apreensão.',
      href: '#contato',
      cta: 'Quero revisar meu contrato',
    },
    {
      number: '03',
      title: 'Negociação com o banco',
      text: 'Sentamos para negociar com número, não com medo. Definimos o que cabe no seu bolso e o que não deve ser pago.',
      href: '#contato',
      cta: 'Quero negociar a dívida',
    },
  ],
  note: 'Cada serviço depende de análise prévia e contratação formal.',
  photoCaption:
    'Juros, tarifas e seguros são os primeiros itens conferidos no contrato de financiamento.',
};

export const bio = {
  eyebrow: 'Quem vai cuidar do seu caso',
  title: 'A advogada que responde por você.',
  paragraphs: [
    'Roberta Victoria Monteiro Veloso Santos é advogada com atuação concentrada em Direito Bancário e na defesa de pessoas físicas contra instituições financeiras.',
    'É ela quem lê o contrato, define a estratégia e responde as suas mensagens. O escritório fica no Comércio, em Salvador, com atendimento online em todo o Brasil.',
  ],
  imageAlt:
    'Retrato da advogada Roberta Veloso, de blusa vermelha, com a mão apoiada no queixo, em frente a um painel de madeira',
};

export const checklist = {
  eyebrow: 'Antes de chamar',
  title: 'O que separar para a conversa render',
  description:
    'Não precisa ter tudo para falar com a gente. Mas, se tiver, estes documentos aceleram a análise e mostram o tamanho do problema.',
  folderLabel: 'Pasta do caso',
  folderIndex: 'Documentos · 01',
  items: [
    'Contrato de financiamento do veículo',
    'Notificações, cartas ou mensagens de cobrança',
    'Número do processo, se houver',
    'Comprovantes de pagamento das parcelas',
    'Documentos pessoais e do veículo (CRLV)',
  ],
  note: 'Não envie documentos por redes sociais. Combine com a equipe um canal seguro.',
  reassurance: 'Sem todos os documentos? Fale mesmo assim. A primeira conversa organiza o resto.',
  cta: 'Iniciar uma conversa',
};

export const process = {
  eyebrow: 'Como funciona',
  title: 'Do primeiro oi ao processo, sem etapa escondida',
  description:
    'Você sabe o que vai acontecer, quanto custa e o que depende de você em cada momento.',
  steps: [
    {
      number: '01',
      title: 'Você conta o que aconteceu',
      text: 'Pelo WhatsApp, sem juridiquês e sem precisar ter todos os documentos em mãos.',
    },
    {
      number: '02',
      title: 'A gente lê o que o banco assinou',
      text: 'Contrato, notificações, processo e comprovantes. É aqui que aparecem as falhas.',
    },
    {
      number: '03',
      title: 'Você recebe o cenário real',
      text: 'O que dá para fazer, o que não dá, quais são os prazos e quanto custa. Sem promessa vazia.',
    },
    {
      number: '04',
      title: 'A gente assume o caso',
      text: 'Contratação formal, estratégia definida e acompanhamento direto pelo canal combinado.',
    },
  ],
  note: 'A contratação só acontece depois da análise e da apresentação das condições.',
};

export const differentials = {
  eyebrow: 'Advogada, não despachante',
  title: 'Por que não resolver isso sozinho',
  description:
    'Não é sobre desconfiar de todo mundo. É sobre saber quem responde pelo seu caso quando o banco aperta.',
  columns: ['Por conta própria', 'Com o escritório'],
  rows: [
    {
      criterion: 'Quem negocia',
      alone: 'Você, no telefone, com o setor que quer receber.',
      withOffice: 'Uma advogada, com o banco e com o processo.',
    },
    {
      criterion: 'O que é analisado',
      alone: 'O boleto que chegou.',
      withOffice: 'Contrato, notificação, encargos e andamento processual.',
    },
    {
      criterion: 'Prazo',
      alone: 'O que o banco disser.',
      withOffice: 'O prazo legal de cada etapa, mapeado.',
    },
    {
      criterion: 'Estratégia',
      alone: 'Pagar para resolver.',
      withOffice: 'Defender, revisar ou negociar — o que o caso pedir.',
    },
    {
      criterion: 'Depois da apreensão',
      alone: 'Esperar o resultado.',
      withOffice: 'Avaliar restituição, revisão de valores e defesa.',
    },
  ],
  closing: 'Você não precisa enfrentar um departamento jurídico sozinho.',
  cta: 'Falar com a advogada',
};

export const faq: FaqItem[] = [
  {
    question: 'Levaram meu carro. O que eu faço nas próximas 24 horas?',
    answer:
      'Não pague nada sem entender o que está sendo cobrado e não assine documentos no impulso. Reúna o contrato, a notificação e o número do processo, se houver, e fale com uma advogada. Após a apreensão, corre o prazo de 5 dias para pagar a dívida integral e tentar reaver o veículo.',
  },
  {
    question: 'Ainda posso recuperar o carro depois da apreensão?',
    answer:
      'Pode haver caminhos, mas dependem do contrato, do processo e do prazo. Dentro dos 5 dias previstos na lei, o pagamento integral da dívida pode levar à restituição. Depois disso, a defesa muda de foco. Ninguém sério pode garantir o resultado antes de ler o caso.',
  },
  {
    question: 'O banco pode apreender sem me avisar?',
    answer:
      'A lei exige a constituição da mora, normalmente por notificação. Se o banco não comprovar o aviso correto, com valor e prazo, isso pode ser discutido no processo. A regularidade da notificação é uma das primeiras coisas que analisamos.',
  },
  {
    question: 'Recebi uma notificação. Isso já é busca e apreensão?',
    answer:
      'Não necessariamente. A notificação é uma etapa anterior ao processo. A ação só existe depois de distribuída, e a liminar pode ser concedida antes da sua citação. Por isso, entender em que etapa você está muda a estratégia.',
  },
  {
    question: 'Vale a pena se a dívida é pequena?',
    answer:
      'O tamanho da dívida não define sozinho se vale a pena. O que pesa é o valor do veículo, o que já foi pago, os encargos cobrados e o que está em jogo. É isso que a análise do caso mostra, com números.',
  },
  {
    question: 'Vocês atendem fora de Salvador?',
    answer:
      'Sim. O escritório fica no Comércio, em Salvador, com atendimento presencial mediante hora combinada. O atendimento online alcança todo o Brasil, por WhatsApp, e-mail ou videochamada.',
  },
  {
    question: 'Como funcionam os honorários?',
    answer:
      'São definidos caso a caso e apresentados antes de qualquer contratação, com transparência sobre o que está incluído. Nenhum valor é cobrado sem a sua concordância, conforme as normas da OAB.',
  },
];

export const landingReviews = {
  eyebrow: 'Avaliações reais',
  title: 'O que dizem no Google.',
  description:
    'Nota e comentários publicados por clientes no perfil do escritório no Google. São opiniões de clientes e não representam promessa de resultado.',
  ratingLabel: 'avaliações no Google',
  cta: 'Ver todas no Google',
  disclaimer:
    'Avaliações públicas do Google. Opiniões de clientes não garantem resultado em casos futuros.',
};

export const location = {
  eyebrow: 'Onde estamos',
  title: 'No Comércio, em Salvador',
  description:
    'A sede fica na Rua Portugal, 17, Ed. Regente Feijó. O atendimento presencial é feito com hora combinada. Fora de Salvador, tudo acontece online — e o sigilo é o mesmo.',
  address: `${site.address.street}, ${site.address.number}, ${site.address.complement}`,
  district: `${site.address.district}, ${site.address.city}-${site.address.state}`,
  postalCode: `CEP ${site.address.postalCode}`,
};

export const contactSection = {
  source: 'lp-busca-apreensao',
  eyebrow: 'Próximo passo',
  title: 'Fale antes do próximo passo do banco.',
  description:
    'Conte o que aconteceu. A primeira conversa serve para entender a situação, organizar os documentos e explicar quais caminhos existem.',
  benefits: [
    'Atendimento direto com a advogada',
    'Sigilo profissional em todas as etapas',
    'Presencial em Salvador ou online em todo o Brasil',
  ],
  formTitle: 'Solicitar contato',
  formDescription:
    'Preencha os dados abaixo. O retorno é feito pelo WhatsApp informado, com sigilo.',
  situationLabel: 'O que aconteceu com o veículo?',
  note: 'Se tiver em mãos, envie o contrato de financiamento, a notificação e o número do processo. Sem tudo isso, fale mesmo assim: a primeira conversa organiza o resto.',
};
