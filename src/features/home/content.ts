import { routes } from '@/shared/config/routes';
import { site } from '@/shared/config/site';

export const homeSeo = {
  title: 'Advocacia bancária em Salvador | Monteiro Veloso',
  description:
    'Advocacia bancária contra juros abusivos, cobrança indevida e busca e apreensão. Defesa de pessoas físicas contra bancos, em Salvador e online em todo o Brasil.',
  path: '/',
};

export const homeHero = {
  eyebrow: 'Salvador e todo o Brasil · atendimento presencial e online',
  titleBefore: 'Advocacia bancária ',
  titleHighlight: 'contra o banco.',
  titleAfter: '',
  subtitle:
    'Defendemos pessoas físicas contra bancos e financeiras: busca e apreensão de veículo, revisional de financiamento e cobrança abusiva. Atendimento direto com a advogada — em Salvador ou online, em todo o Brasil.',
  primaryCta: 'Falar com a advogada',
  secondaryCta: 'Meu carro foi apreendido',
  imageAlt:
    'Equipe de cinco advogadas da Monteiro Veloso Advogados reunida no escritório, em Salvador, em frente a um painel de madeira ripada',
  imageCaption: 'Equipe Monteiro Veloso',
  imageRole: 'Direito bancário',
};

export const homeAreas = {
  eyebrow: 'O que a gente resolve',
  title: 'Três problemas. Uma especialidade: direito bancário.',
  description:
    'Sem juridiquês e sem rodeio. São estes os casos que mais chegam ao escritório — e todos começam com uma conversa.',
  items: [
    {
      icon: 'lucide:shield-alert',
      title: 'Meu carro foi apreendido',
      text: 'Defesa em busca e apreensão: lemos o contrato e o processo para achar falha do banco, prazo perdido ou cobrança irregular — e agir antes da consolidação.',
      href: routes.landing,
      cta: 'Quero defender meu carro',
    },
    {
      icon: 'lucide:calculator',
      title: 'Meu financiamento está caro demais',
      text: 'Revisional de financiamento: conferimos juros, tarifas e seguros embutidos. Se o contrato cobrou o que não devia, isso vai para a mesa.',
      href: '#contato',
      cta: 'Quero revisar meu contrato',
    },
    {
      icon: 'lucide:handshake',
      title: 'O banco não para de cobrar',
      text: 'Cobrança e negociação: organizamos a dívida, paramos o assédio e definimos o que vale a pena pagar — e o que deve ser contestado.',
      href: '#contato',
      cta: 'Quero parar a cobrança',
    },
  ],
};

export const homeReviews = {
  eyebrow: 'Avaliações reais',
  title: 'O que dizem no Google.',
  description:
    'Nota e comentários publicados por clientes no perfil do escritório no Google. São opiniões de clientes e não representam promessa de resultado.',
  ratingLabel: 'avaliações no Google',
  cta: 'Ver todas no Google',
  disclaimer:
    'Avaliações públicas do Google. Opiniões de clientes não garantem resultado em casos futuros.',
};

export const homeInstagram = {
  eyebrow: 'Instagram',
  title: 'Direito bancário também se explica em vídeo.',
  description:
    'Conteúdo curto sobre financiamento, busca e apreensão e cobrança abusiva — direto do perfil da Monteiro Veloso Advogados.',
  profileUrl: site.social.instagram,
  profileLabel: '@monteirovelosoadvogados',
  posts: [
    'https://www.instagram.com/p/DaRHQ34glTZ/',
    'https://www.instagram.com/p/DZqDNVlpcBl/',
    'https://www.instagram.com/p/DZdvNcmAU8A/',
    'https://www.instagram.com/p/Ddl-tgnxiZe/',
  ],
  consentNote:
    'Os vídeos são carregados pelo Instagram. Eles só aparecem depois que você aceita os cookies.',
  fallbackNote: 'Se o vídeo não carregar, abra o post diretamente no Instagram.',
};

export const homeLocation = {
  eyebrow: 'Onde estamos',
  title: 'No Comércio, em Salvador.',
  description:
    'Rua Portugal, 17, Ed. Regente Feijó. As visitas são feitas com hora combinada, para o atendimento ser organizado e sem espera.',
  address: `${site.address.street}, ${site.address.number}, ${site.address.complement}`,
  district: `${site.address.district}, ${site.address.city}-${site.address.state}`,
  postalCode: `CEP ${site.address.postalCode}`,
  hoursLabel: 'Horário de atendimento',
  onlineTitle: 'Atendimento online',
  onlineText:
    'Fora de Salvador, o atendimento é feito por videochamada, WhatsApp ou e-mail, em todo o Brasil.',
  whatsappCta: 'Combinar horário',
  mapsCta: 'Abrir no Maps',
};

export const homeContact = {
  source: 'home',
  eyebrow: 'Fale com o escritório',
  title: 'Manda o que aconteceu. O resto a gente organiza.',
  description:
    'Se o carro foi apreendido, se a parcela atrasou ou se a cobrança não fecha, fale com a advogada. O retorno é direto, com sigilo e atenção ao seu caso.',
  benefits: [
    'Atendimento direto com a advogada',
    'Sigilo profissional em todas as etapas',
    'Presencial em Salvador ou online em todo o Brasil',
  ],
  formTitle: 'Solicitar contato',
  formDescription:
    'Preencha os dados abaixo e a equipe retorna pelo WhatsApp informado, com sigilo.',
  situationLabel: 'Qual é a sua situação?',
};
