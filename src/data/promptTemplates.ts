import { SocialNetwork } from '../types';

export interface PromptTemplateField {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'viral' | 'sales' | 'authority' | 'urgency' | 'ugc' | 'b2b' | 'comparison';
  categoryLabel: string;
  badge: string;
  description: string;
  recommendedNetworks: SocialNetwork[];
  idealFormat: string;
  targetEngines: {
    image: string;
    video: string;
    voice?: string;
  };
  structureFormula: string; // e.g. "Gancho (0-3s) + Retenção + Revelação + CTA"
  tags: string[];
  fields: PromptTemplateField[];
  templateGenerator: (values: Record<string, string>) => string;
  rawTemplateText: string;
  estimatedConversionBoost: string;
}

export const PROMPT_TEMPLATES_LIBRARY: PromptTemplate[] = [
  {
    id: 'viral-storytelling',
    name: 'Viral Storytelling & Gancho Magnético',
    category: 'viral',
    categoryLabel: 'Viral & Reels/TikTok',
    badge: 'Retenção 10x',
    description: 'Começa com curiosidade irresistível nos 3 primeiros segundos, quebra de padrão e revelação rápida.',
    recommendedNetworks: ['TikTok', 'Instagram', 'Kwai', 'YouTube'],
    idealFormat: '9:16 Vertical',
    targetEngines: {
      image: 'Leonardo IA',
      video: 'Veo 3',
      voice: 'ElevenLabs',
    },
    structureFormula: 'Gancho (0-3s) → Curiosidade (3-8s) → Revelação Visual (8-13s) → CTA Viral (13-15s)',
    tags: ['#Viral', '#Storytelling', '#Reels', '#Retencao', '#TikTokTrend'],
    estimatedConversionBoost: '+340% tempo de tela',
    fields: [
      { id: 'hook', label: 'Gancho Inicial (0-3s)', placeholder: 'Você ainda faz vídeos manuais em 2026? Veja isso...' },
      { id: 'conflict', label: 'Conflito / Dor', placeholder: 'Perder horas renderizando em 5 programas diferentes' },
      { id: 'resolution', label: 'Solução / Revelação', placeholder: 'Com 1 comando de IA o Grupo Rimane gera para 6 redes sociais' },
      { id: 'cta', label: 'Chamada para Ação', placeholder: 'Comente "VIRAL" para testar agora!' },
    ],
    templateGenerator: (v) =>
      `[GANCHO VIRAL 15s • VIRAL STORYTELLING]
• Gancho Inicial (0-3s): "${v.hook || 'Você ainda faz vídeos manuais em 2026? Veja isso...'}"
• Desenvolvimento & Conflito (3-8s): Mostrar a dor de ${v.conflict || 'perder horas renderizando'} com zoom dinâmico e efeitos sonoros sci-fi.
• Revelação Visual (8-13s): Render 3D 8K hiper-detalhado com iluminação neon ciano demonstrando que ${v.resolution || 'com 1 clique o PlayStart IA gera para 6 redes'}.
• Chamada para Ação (13-15s): "${v.cta || 'Comente VIRAL para receber o link de acesso exclusivo!'}"
• Direção de Arte: Estilo cinematográfico 60fps, cortes rápidos a cada 1.5s, cores saturadas e transições fluidas.`,
    rawTemplateText: `[GANCHO VIRAL 15s • VIRAL STORYTELLING]
• Gancho Inicial (0-3s): "Você ainda faz vídeos manuais em 2026? Veja o que acontece quando usa IA..."
• Desenvolvimento & Conflito (3-8s): Mostrar a dor de perder horas renderizando com zoom dinâmico e cortes rápidos.
• Revelação Visual (8-13s): Render 3D 8K hiper-detalhado com iluminação neon ciano demonstrando a automação total em 6 redes.
• Chamada para Ação (13-15s): "Comente 'VIRAL' para receber o acesso agora no direct!"
• Direção de Arte: Estilo cinematográfico 60fps, cortes rápidos a cada 1.5s, cores saturadas e transições fluidas.`,
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase & Lançamento 8K',
    category: 'sales',
    categoryLabel: 'Vendas & Lançamento',
    badge: 'Alta Conversão',
    description: 'Apresenta produto com iluminação volumétrica, diferenciais tecnológicos e proposta de valor.',
    recommendedNetworks: ['Instagram', 'YouTube', 'Facebook', 'Turistas'],
    idealFormat: '9:16 ou 16:9',
    targetEngines: {
      image: 'Leonardo IA',
      video: 'Veo 3',
      voice: 'ElevenLabs',
    },
    structureFormula: 'Apresentação → Dor Resolvida → Diferencial 8K → Demonstração → Oferta Especial',
    tags: ['#Lancamento', '#AltaConversao', '#ProdutoPremium', '#Vendas', '#Design8K'],
    estimatedConversionBoost: '+280% taxa de clique',
    fields: [
      { id: 'productName', label: 'Nome do Produto / Serviço', placeholder: 'PLAYSTART IA • Plataforma de Criação' },
      { id: 'targetAudience', label: 'Público-Alvo', placeholder: 'Empreendedores, criadores de conteúdo e agências' },
      { id: 'keyBenefit', label: 'Principal Benefício / Inovação', placeholder: '16 IAs integradas com fallback automático e disparo simultâneo' },
      { id: 'offer', label: 'Oferta / Condição de Estreia', placeholder: 'Acesso antecipado com bônus exclusivo no link da bio' },
    ],
    templateGenerator: (v) =>
      `[LANÇAMENTO DE PRODUTO • HIGH CONVERSION SHOWCASE]
• Produto: ${v.productName || 'PLAYSTART IA'}
• Público-Alvo: ${v.targetAudience || 'Empreendedores e criadores de conteúdo'}
• Problema Resolvido & Diferencial: ${v.keyBenefit || 'Todas as IAs em um só lugar com disparo em 6 redes'}
• Estilo Visual: Render cinematográfico 8K com iluminação volumétrica neon ciano, reflexos metálicos ultra nítidos e câmera lenta em 60fps.
• Oferta & CTA: "${v.offer || 'Garanta sua licença exclusiva de estreia no link da bio!'}"`,
    rawTemplateText: `[LANÇAMENTO DE PRODUTO • HIGH CONVERSION SHOWCASE]
• Produto: PLAYSTART IA • Ecossistema Criativo
• Público-Alvo: Empreendedores, agências e criadores de conteúdo
• Problema Resolvido & Diferencial: 16 motores de IA sincronizados, multiformatos automáticos e zero perda de tempo.
• Estilo Visual: Render cinematográfico 8K com iluminação volumétrica neon ciano, reflexos metálicos ultra nítidos e câmera lenta em 60fps.
• Oferta & CTA: "Garanta sua licença exclusiva de estreia no link da bio!"`,
  },
  {
    id: 'urgent-cta',
    name: 'Urgent Call-to-Action & Oferta Relâmpago',
    category: 'urgency',
    categoryLabel: 'Urgência & Escassez',
    badge: 'Decisão Rápida',
    description: 'Gatilho de contagem regressiva, escassez genuína e chamada de ação de alto impacto.',
    recommendedNetworks: ['Facebook', 'Instagram', 'TikTok'],
    idealFormat: '1:1 ou 9:16',
    targetEngines: {
      image: 'Ideogram',
      video: 'Kling',
      voice: 'ElevenLabs',
    },
    structureFormula: 'Alerta de Escassez (Últimas 24h) → Bônus Imperdível → Prova de Valor → Ação Imediata',
    tags: ['#OfertaRelampago', '#UltimasVagas', '#Escassez', '#DescontoExclusivo', '#AcaoImediata'],
    estimatedConversionBoost: '+410% conversão direta',
    fields: [
      { id: 'deadline', label: 'Prazo / Escassez', placeholder: 'Válido apenas até a meia-noite de hoje (Últimas 12 vagas)' },
      { id: 'discount', label: 'Benefício / Desconto', placeholder: '50% OFF + Pacote de 16 IAs Liberado' },
      { id: 'actionWord', label: 'Verbo de Ação / Link', placeholder: 'Toque em Saiba Mais ou envie DM "QUERO"' },
    ],
    templateGenerator: (v) =>
      `[OFERTA RELÂMPAGO • URGENT CALL-TO-ACTION]
• Alerta de Urgência: ${v.deadline || 'ÚLTIMAS 24 HORAS • Vagas limitadas!'}
• Proposta de Valor: ${v.discount || 'Condição especial de estreia com acesso completo à plataforma.'}
• Estilo Visual: Fundo escuro com partículas de luz dourada/laranja pulsantes, cronômetro regressivo estilizado em neon e tipografia de alto impacto.
• Chamada para Ação: "${v.actionWord || 'Clique no botão abaixo ou envie uma mensagem direta agora antes que encerre!'}"`,
    rawTemplateText: `[OFERTA RELÂMPAGO • URGENT CALL-TO-ACTION]
• Alerta de Urgência: ÚLTIMAS 24 HORAS • Apenas 17 vagas restantes com preço promocional!
• Proposta de Valor: 50% de desconto no plano anual + acesso aos motores Veo 3 e Leonardo IA.
• Estilo Visual: Fundo escuro com partículas de luz dourada/laranja pulsantes, cronômetro regressivo estilizado em neon e tipografia de alto impacto.
• Chamada para Ação: "Toque em Saiba Mais agora e garanta sua vaga antes da virada de lote!"`,
  },
  {
    id: 'expert-authority',
    name: 'Autoridade & Dica de Especialista (How-To)',
    category: 'authority',
    categoryLabel: 'Autoridade & Educação',
    badge: 'Salvamentos 5x',
    description: 'Passo a passo acionável com gancho anti-intuitivo para gerar autoridade, compartilhamentos e salvamentos.',
    recommendedNetworks: ['Instagram', 'YouTube', 'TikTok'],
    idealFormat: '9:16 ou 4:5',
    targetEngines: {
      image: 'Leonardo IA',
      video: 'CapCut',
      voice: 'ElevenLabs',
    },
    structureFormula: 'O Erro que 90% Cometem → Passo 1 → Passo 2 → Passo 3 → Salve para Consultar',
    tags: ['#DicaDeEspecialista', '#TutorialIA', '#ComoFazer', '#AutoridadeDigital', '#SalvarPost'],
    estimatedConversionBoost: '+520% salvamentos orgânicos',
    fields: [
      { id: 'topic', label: 'Tema da Dica', placeholder: 'Como criar conteúdo para 6 redes em 5 minutos' },
      { id: 'step1', label: 'Passo 1', placeholder: 'Defina a mensagem central em 1 frase de impacto' },
      { id: 'step2', label: 'Passo 2', placeholder: 'Use automação de IA para adaptar o formato (9:16, 16:9, 1:1)' },
      { id: 'step3', label: 'Passo 3', placeholder: 'Agende nos horários de pico do seu nicho' },
    ],
    templateGenerator: (v) =>
      `[DICA DE ESPECIALISTA • GUIA PRÁTICO EM 3 PASSOS]
• Tema: ${v.topic || 'Como multiplicar seu alcance nas redes com IA'}
• Passo 1: ${v.step1 || 'Estruture o gancho nos primeiros 3 segundos.'}
• Passo 2: ${v.step2 || 'Adapte a legenda para a linguagem de cada plataforma.'}
• Passo 3: ${v.step3 || 'Automatize a publicação em múltiplos formatos.'}
• CTA: "Salve este post para consultar quando for criar seu próximo lançamento!"
• Estilo Visual: Diagramação limpa com tópicos numerados em neon ciano e gravação de tela fluida.`,
    rawTemplateText: `[DICA DE ESPECIALISTA • GUIA PRÁTICO EM 3 PASSOS]
• Tema: 3 truques avançados para multiplicar seu alcance nas redes com IA em 2026.
• Passo 1: Gere multiformatos simultâneos (9:16, 16:9, 1:1) para não perder nenhum algoritmo.
• Passo 2: Use legendas com ganchos emocionais específicos por plataforma.
• Passo 3: Programe o disparo nos horários de pico com automação inteligente.
• CTA: "Salve este post para consultar quando for criar seu próximo conteúdo!"
• Estilo Visual: Diagramação limpa com tópicos numerados em neon ciano e gravação de tela fluida.`,
  },
  {
    id: 'ugc-authentic',
    name: 'UGC Autêntico & Review Espontâneo',
    category: 'ugc',
    categoryLabel: 'UGC & Humanizado',
    badge: 'Engajamento Real',
    description: 'Estilo depoimento gravado na primeira pessoa com linguagem natural, quebrando a barreira de venda fria.',
    recommendedNetworks: ['TikTok', 'Instagram', 'Kwai'],
    idealFormat: '9:16 Vertical',
    targetEngines: {
      image: 'Midjourney',
      video: 'Kling',
      voice: 'ElevenLabs',
    },
    structureFormula: 'Reação Espontânea → Demonstração ao Vivo → Resultado Pessoal → Recomendação Sincera',
    tags: ['#UGC', '#ReviewReal', '#DicaSincera', '#Transformacao', '#ViralReels'],
    estimatedConversionBoost: '+310% confiança e cliques',
    fields: [
      { id: 'reaction', label: 'Reação Inicial', placeholder: 'Gente, eu testei isso achando que era mentira e fiquei em choque...' },
      { id: 'result', label: 'Resultado Real', placeholder: 'Consegui criar vídeos para o mês inteiro em menos de 1 hora' },
      { id: 'recommendation', label: 'Recomendação', placeholder: 'Sério, quem trabalha com internet precisa conhecer o PlayStart IA' },
    ],
    templateGenerator: (v) =>
      `[UGC VÍDEO AUTÊNTICO • REVIEW ESPONTÂNEO]
• Abertura em Primeira Pessoa: "${v.reaction || 'Gente, eu testei isso achando que era exagero e fiquei impressionado...'}"
• Demonstração na Prática: Câmera mostrando a tela do celular com reação em tempo real ao ver ${v.result || 'os vídeos sendo gerados em segundos'}.
• Encerramento & Indicação: "${v.recommendation || 'Se você quer economizar tempo e ter mais resultado, o link tá aqui embaixo!'}"
• Estilo Visual: Enquadramento 9:16 vertical realista, iluminação ambiente suave, cortes orgânicos e legendas dinâmicas amarelas/brancas.`,
    rawTemplateText: `[UGC VÍDEO AUTÊNTICO • REVIEW ESPONTÂNEO]
• Abertura em Primeira Pessoa: "Gente, eu testei essa IA achando que era exagero e fiquei impressionado..."
• Demonstração na Prática: Câmera mostrando a tela do celular com reação em tempo real ao ver os vídeos sendo gerados para 6 redes ao mesmo tempo.
• Encerramento & Indicação: "Se você quer economizar tempo e profissionalizar seu conteúdo, clica no link da bio!"
• Estilo Visual: Enquadramento 9:16 vertical realista, iluminação ambiente suave, cortes orgânicos e legendas dinâmicas amarelas/brancas.`,
  },
  {
    id: 'before-after',
    name: 'Transformação Radical & Antes vs. Depois',
    category: 'comparison',
    categoryLabel: 'Comparativo & Impacto',
    badge: 'Choque Visual',
    description: 'Contraste dramático entre o método tradicional demorado e a eficiência multiplicadora da IA.',
    recommendedNetworks: ['Instagram', 'TikTok', 'YouTube', 'Facebook'],
    idealFormat: '9:16 ou 16:9',
    targetEngines: {
      image: 'Leonardo IA',
      video: 'Veo 3',
      voice: 'ElevenLabs',
    },
    structureFormula: 'O Modo Antigo (Caótico) ⚔️ O Modo IA (Instantâneo) → Comparação Lado a Lado → Conclusão',
    tags: ['#AntesEDepois', '#Comparativo', '#Produtividade', '#Inovacao', '#TechTrend'],
    estimatedConversionBoost: '+390% retenção de vídeo',
    fields: [
      { id: 'oldWay', label: 'Método Antigo (Antes)', placeholder: 'Passar 6 horas editando, cortando legendas e refazendo tamanhos para cada rede' },
      { id: 'newWay', label: 'Método com IA (Depois)', placeholder: 'Escrever 1 ideia e ter imagem 8K, vídeo cinematográfico e legendas prontas em 15s' },
      { id: 'multiplier', label: 'Multiplicador de Produtividade', placeholder: '10x mais rápido com 100% de consistência' },
    ],
    templateGenerator: (v) =>
      `[TRANSFORMAÇÃO RADICAL • ANTES VS DEPOIS]
• O Método Antigo (Antes): Mostrar tela dividida com a frustração de ${v.oldWay || 'perder o dia todo em softwares pesados'}.
• A Virada com IA (Depois): Transição relâmpago com brilho neon onde ${v.newWay || 'a plataforma gera tudo em segundos'}.
• Resultado & Multiplicador: "${v.multiplier || 'Produza em 15 segundos o que antes levava 6 horas.'}"
• Estilo Visual: Tela dividida cinza/frio (Antes) vs Ciano/Vibrante 8K (Depois), transição com efeito wipe luminoso e trilha sonora impactante.`,
    rawTemplateText: `[TRANSFORMAÇÃO RADICAL • ANTES VS DEPOIS]
• O Método Antigo (Antes): Mostrar tela dividida com a frustração de passar 6 horas editando, cortando legendas e refazendo formatos.
• A Virada com IA (Depois): Transição relâmpago com brilho neon onde a plataforma gera mídias para 6 redes em 15 segundos.
• Resultado & Multiplicador: "Produza em 15 segundos o que antes levava um dia inteiro."
• Estilo Visual: Tela dividida cinza/frio (Antes) vs Ciano/Vibrante 8K (Depois), transição com efeito wipe luminoso e trilha sonora impactante.`,
  },
  {
    id: 'b2b-corporate',
    name: 'Institucional B2B & Autoridade Corporativa',
    category: 'b2b',
    categoryLabel: 'B2B & Corporativo',
    badge: 'Credibilidade',
    description: 'Comunicação executiva, métricas de crescimento e posicionamento estratégico do Grupo Rimane.',
    recommendedNetworks: ['YouTube', 'Facebook', 'Instagram', 'Turistas'],
    idealFormat: '16:9 ou 1200x628',
    targetEngines: {
      image: 'Leonardo IA',
      video: 'Veo 3',
      voice: 'ElevenLabs',
    },
    structureFormula: 'Posicionamento Estratégico → Desafio de Mercado → Solução Tecnológica → Contato Executivo',
    tags: ['#Corporativo', '#B2B', '#GrupoRimane', '#InovacaoEmpresarial', '#Autoridade'],
    estimatedConversionBoost: '+230% geração de leads qualificados',
    fields: [
      { id: 'companyName', label: 'Nome da Marca / Divisão', placeholder: 'Grupo Rimane • Divisão de Tecnologia Digital' },
      { id: 'industry', label: 'Setor de Atuação', placeholder: 'Marketing Digital, Turismo e Soluções com Inteligência Artificial' },
      { id: 'valueProp', label: 'Proposta de Valor B2B', placeholder: 'Escalabilidade e inovação com segurança operacional e alta performance' },
    ],
    templateGenerator: (v) =>
      `[INSTITUCIONAL B2B • AUTORIDADE CORPORATIVA]
• Empresa: ${v.companyName || 'Grupo Rimane'}
• Setor: ${v.industry || 'Inovação e Tecnologia Digital'}
• Proposta de Valor: ${v.valueProp || 'Infraestrutura corporativa com IA integrada e multicanais'}
• Estilo Visual: Fotografia executiva em ambiente corporativo moderno, linhas arquitetônicas elegantes, gradiente terracota/ciano e tipografia imponente.
• CTA: "Conecte sua empresa ao futuro da comunicação automatizada. Fale com nossos consultores."`,
    rawTemplateText: `[INSTITUCIONAL B2B • AUTORIDADE CORPORATIVA]
• Empresa: Grupo Rimane • CNPJ: 17.431.363/0001-84
• Setor: Tecnologia, Mídia Digital e Inteligência Artificial
• Proposta de Valor: Infraestrutura corporativa com 16 motores neurais sincronizados e publicação em escala global.
• Estilo Visual: Fotografia executiva em ambiente corporativo moderno, linhas arquitetônicas elegantes, gradiente terracota/ciano e tipografia imponente.
• CTA: "Conecte sua empresa ao futuro da comunicação automatizada. Agende uma demonstração executiva."`,
  },
];

/**
 * Context analyzer that ranks templates according to user's current prompt text and selected networks
 */
export function getContextualTemplateRecommendations(
  currentPrompt: string,
  selectedNetworks: SocialNetwork[]
): {
  recommendedTemplate: PromptTemplate;
  rankedTemplates: PromptTemplate[];
  contextReason: string;
} {
  const lower = currentPrompt.toLowerCase();
  
  let bestScore = -1;
  let topTemplate = PROMPT_TEMPLATES_LIBRARY[0];
  let reason = 'Template padrão recomendado para alto impacto visual';

  // Scoring weights
  const scored = PROMPT_TEMPLATES_LIBRARY.map((template) => {
    let score = 10; // base score

    // 1. Keyword matching
    if (template.id === 'product-showcase' && (lower.includes('produto') || lower.includes('lançamento') || lower.includes('venda') || lower.includes('preço') || lower.includes('comprar'))) {
      score += 40;
    }
    if (template.id === 'viral-storytelling' && (lower.includes('viral') || lower.includes('reels') || lower.includes('tiktok') || lower.includes('segredo') || lower.includes('história') || lower.includes('curiosidade'))) {
      score += 45;
    }
    if (template.id === 'urgent-cta' && (lower.includes('urgente') || lower.includes('promoção') || lower.includes('desconto') || lower.includes('hoje') || lower.includes('horas') || lower.includes('vagas'))) {
      score += 50;
    }
    if (template.id === 'expert-authority' && (lower.includes('dica') || lower.includes('como') || lower.includes('passo') || lower.includes('tutorial') || lower.includes('aprender') || lower.includes('truque'))) {
      score += 45;
    }
    if (template.id === 'ugc-authentic' && (lower.includes('eu') || lower.includes('testei') || lower.includes('depoimento') || lower.includes('opinião') || lower.includes('review') || lower.includes('experiência'))) {
      score += 40;
    }
    if (template.id === 'before-after' && (lower.includes('antes') || lower.includes('depois') || lower.includes('comparar') || lower.includes('transformação') || lower.includes('evolução'))) {
      score += 45;
    }
    if (template.id === 'b2b-corporate' && (lower.includes('empresa') || lower.includes('negócio') || lower.includes('b2b') || lower.includes('corporativo') || lower.includes('rimane') || lower.includes('institucional'))) {
      score += 40;
    }

    // 2. Social network affinity
    const networkOverlap = template.recommendedNetworks.filter((net) => selectedNetworks.includes(net)).length;
    score += networkOverlap * 8;

    // 3. Length heuristic: if prompt is empty or short, suggest high-conversion storytelling or showcase
    if (lower.trim().length === 0 || lower.trim().length < 20) {
      if (template.id === 'viral-storytelling' || template.id === 'product-showcase') {
        score += 25;
      }
    }

    return { template, score };
  });

  scored.sort((a, b) => b.score - a.score);
  topTemplate = scored[0].template;

  // Generate human-friendly context reason
  if (lower.includes('produto') || lower.includes('lançamento')) {
    reason = 'Detectado foco em Lançamento / Produto nas palavras-chave do prompt';
  } else if (lower.includes('urgente') || lower.includes('desconto') || lower.includes('promoção')) {
    reason = 'Detectado gatilho de Urgência & Escassez no texto';
  } else if (lower.includes('dica') || lower.includes('como')) {
    reason = 'Detectado formato educativo de Dica & Autoridade';
  } else if (selectedNetworks.includes('TikTok') || selectedNetworks.includes('Instagram')) {
    reason = `Otimizado para alto engajamento no ${selectedNetworks.filter(n => n === 'TikTok' || n === 'Instagram').join(' & ')}`;
  } else if (selectedNetworks.includes('YouTube')) {
    reason = 'Otimizado para retenção longa e narrativa rica do YouTube';
  } else {
    reason = 'Sugestão contextual balanceada para suas redes selecionadas';
  }

  return {
    recommendedTemplate: topTemplate,
    rankedTemplates: scored.map((s) => s.template),
    contextReason: reason,
  };
}
