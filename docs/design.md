# Direção visual

## Conceito

**Editorial jurídico, não SaaS.** A página usa a lógica de um documento impresso: tipografia serifada grande, réguas finas, colunas assimétricas, fotos em cores originais e botões retos. O objetivo é transmitir sobriedade e presença, sem o kit visual de cards arredondados, gradientes e etiquetas em caixa alta que caracteriza landing pages genéricas.

## Tipografia

- **Playfair Display** para títulos: contraste alto, escala editorial. `display-hero` diminui de tamanho em notebooks para manter o CTA acima da dobra.
- **Manrope** para texto, navegação e formulário: leitura limpa em telas pequenas.
- Títulos sem destaque colorido de palavra; a hierarquia vem do tamanho, da régua e do espaço.
- Rótulos de seção em caixa alta foram removidos; resta uma régua curta antes de cada título.

## Cor

Somente branco, preto e azuis:

- `#0A1628` ink
- `#0F2340` navy
- `#1A3B6F` brand
- `#3E7CC0` blue
- `#C3D6EC` blue-200
- `#FFFFFF` / `#F7F9FC` / `#EEF4FA`

As fotos são exibidas em cores originais, sem filtros ou camadas de tinta.

## Layout

- Home clara e institucional; landing escura e de campanha.
- A home percorre hero, barra de confiança, áreas de atuação, o escritório, como funciona, diferenciais, dúvidas, atendimento nacional (mapa do Brasil), localização com mapa e contato com formulário.
- Container de 1180 px, com margens generosas em 27".
- Régua azul de 1 px antes dos títulos e divisórias de 1 px entre colunas, em vez de cards com sombra.
- Botões e campos com raio de 2 px; sem pills, sem sombras decorativas.
- Processo numerado apenas porque é uma sequência real; serviços e diferenciais não recebem números.
- Hero da LP com grade técnica sutil, sem blobs/gradientes de fundo.

## Movimento e interação

- Sem animações de entrada espalhadas. O movimento existe para responder a ações: FAQ nativo, mapa sob clique, consentimento, envio do formulário.
- `prefers-reduced-motion` respeitado.

## Responsividade

- Home/LP testadas em 320, 360, 390, 768, 1024, 1280, 1366, 1440, 1920 e 2560 px.
- Em notebooks de 1024–1439 px, o hero reduz a tipografia, o padding e a foto para manter CTA, imagem e barra de confiança na primeira dobra.
- Mapa sem proporção fixa no mobile; o texto quebra dentro do card.
- No mobile, o botão flutuante de WhatsApp é oculto para não cobrir o conteúdo; o header e o menu continuam oferecendo o contato.
