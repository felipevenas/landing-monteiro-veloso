# Direção visual

## Conceito

**Editorial jurídico com peso documental.** A página usa a lógica de um dossiê: tipografia serifada grande, fotografias em full-bleed, faixas escuras de contraste, réguas finas, índices de seção e rótulos em caixa alta. O objetivo é transmitir presença e urgência sem o kit visual de cards arredondados, gradientes e etiquetas genéricas.

A referência de estrutura é o ritmo de faixas e a fotografia de campanha de sites do nicho bancário. A identidade continua própria: navy, papel, Playfair Display e Manrope.

## Tipografia

- **Playfair Display** para títulos: contraste alto, escala editorial. `display-hero` diminui em notebooks para manter o CTA acima da dobra.
- **Manrope** para texto, navegação e formulário.
- Rótulos de seção em caixa alta, sem numeração e sem traço: o `SectionHeading` renderiza apenas o `eyebrow`.
- Na landing, a segunda linha do H1 pode receber `sky-300` como acento de campanha. Na home, o destaque fica em `brand`.

## Cor

Somente branco, preto e azuis:

- `#0A1628` ink
- `#0F2340` navy
- `#1A3B6F` brand
- `#3E7CC0` blue
- `#C3D6EC` blue-200
- `#FFFFFF` / `#F7F9FC` / `#EEF4FA`

Duas exceções funcionais, restritas aos módulos correspondentes:

- `#25D366` / `#1FB959` no botão flutuante de WhatsApp. Texto e ícone em `ink` para manter contraste AA.
- `#FBBC04` nas estrelas das avaliações do Google, para leitura imediata da nota.

As fotos são exibidas em cores originais. Sobre elas, apenas scrims navy para garantir contraste do texto (`scrim-left`, `scrim-panel`, `scrim-bottom`, `scrim-bottom-strong`). Não há filtros, duotone ou camadas coloridas.

## Layout

- **Home:** hero claro com retrato, áreas de atuação em lista editorial, avaliações reais do Google, carrossel de posts do Instagram, localização com horário/mapa e contato. Faixas de confiança, escritório, processo, diferenciais, dúvidas e cobertura nacional foram removidas para enxugar a leitura.
- **Landing:** hero escuro com foto do veículo à direita, faixa de confiança clara, faixa fotográfica com a linha do tempo da apreensão, o que o banco não conta, serviços com foto do contrato, advogada com retrato grande, checklist em formato de pasta, processo, comparação, dúvidas, localização e contato.
- Container de 1180 px, com margens generosas em 27".
- Faixas de contraste alternam `ink`/`navy` e papel. Fotografia é usada como estrutura, não como decoração.
- Régua azul de 1 px antes dos títulos e divisórias de 1 px entre colunas, em vez de cards com sombra.
- Botões e campos com raio de 2 px; sem pills, sem sombras decorativas.
- Processo, áreas e serviços mantêm numeração interna por serem sequências e listas de leitura; os títulos de seção não são numerados.
- Selos de dossiê: rótulos como “Pasta do caso”, “Checklist de análise” e “Documentos · 01”.

## Fotografia

Quatro imagens sustentam a narrativa:

1. **Carro apreendido (vertical):** hero da landing e faixa mobile.
2. **Carro apreendido (panorâmica):** faixa da linha do tempo na landing e faixa de impacto na home.
3. **Contrato de financiamento:** serviços, com calculadora, chaves e mão apontando cláusula.
4. **Retrato da advogada:** hero da home e seção “quem vai entrar nessa com você”.

Regras de recorte: o veículo fica à direita na panorâmica, deixando o terço esquerdo para o texto. O retrato usa `object-position` no rosto. As imagens têm `width`/`height` e são servidas em AVIF/WebP pelo Astro.

## Movimento e interação

- Sem animações de entrada espalhadas. O movimento existe para responder a ações: FAQ nativo, mapa sob clique, consentimento, envio do formulário e carrossel do Instagram.
- Os vídeos do Instagram só são incorporados depois do consentimento e quando a seção se aproxima da viewport. Sem consentimento, os cards funcionam como links para o post.
- `prefers-reduced-motion` respeitado.

## Responsividade

- Home/LP testadas em 320, 360, 390, 768, 1024, 1280, 1366, 1440, 1920 e 2560 px.
- Em notebooks de 1024–1439 px, o hero reduz a tipografia, o padding e a foto para manter CTA e imagem na primeira dobra.
- No hero da landing, o texto ocupa no máximo 52% do container para não invadir a foto em 1024 px.
- Mapa sem proporção fixa no mobile; o texto quebra dentro do card.
- O carrossel do Instagram usa `scroll-snap`, setas no desktop e swipe no mobile; os cards têm largura máxima de 20rem.
- O botão flutuante de WhatsApp fica visível também no mobile (56 px, `env(safe-area-inset-bottom)`), oculto apenas enquanto o banner de consentimento está aberto. No desktop, expande para “Falar agora”.
