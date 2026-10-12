import type { CompanyCategory, TransactionType } from '../types';

import { normalizeText } from './financial-normalizer';

const CATEGORY_KEYWORDS: Array<{
  keywords: string[];
  categoryTerms: string[];
}> = [
  {
    keywords: [
      'material de escritorio',
      'material de limpeza',
      'materiais',
      'insumos',
      'suprimentos',
    ],
    categoryTerms: [
      'material',
      'materiais',
      'insumos',
      'suprimentos',
      'escritorio',
      'limpeza',
    ],
  },
  {
    keywords: [
      'combustivel',
      'gasolina',
      'etanol',
      'diesel',
      'uber',
      'taxi',
      'frete',
      'transporte',
    ],
    categoryTerms: [
      'transporte',
      'combustivel',
      'gasolina',
      'frete',
      'entrega',
      'deslocamento',
    ],
  },
  {
    keywords: ['energia', 'agua', 'internet', 'telefone', 'aluguel'],
    categoryTerms: [
      'energia',
      'agua',
      'internet',
      'telefone',
      'aluguel',
      'utilidades',
      'contas',
    ],
  },
  {
    keywords: ['anuncio', 'anuncios', 'propaganda', 'publicidade', 'marketing'],
    categoryTerms: ['marketing', 'publicidade', 'propaganda', 'anuncios'],
  },
  {
    keywords: ['imposto', 'impostos', 'tributo', 'tributos', 'das'],
    categoryTerms: [
      'imposto',
      'impostos',
      'tributos',
      'tributario',
      'das',
      'taxas',
    ],
  },
  {
    keywords: ['venda', 'vendi', 'vendeu', 'produto vendido'],
    categoryTerms: ['venda', 'vendas', 'produtos', 'comercial'],
  },
  {
    keywords: [
      'servico',
      'servicos',
      'consultoria',
      'manutencao',
      'atendimento',
    ],
    categoryTerms: [
      'servico',
      'servicos',
      'consultoria',
      'manutencao',
      'atendimento',
    ],
  },
];

function containsTerm(text: string, term: string): boolean {
  const normalizedTerm = normalizeText(term);

  if (!normalizedTerm) {
    return false;
  }

  return ` ${text} `.includes(` ${normalizedTerm} `);
}

export function scoreCategory(text: string, category: CompanyCategory): number {
  const normalizedText = normalizeText(text);
  const normalizedName = normalizeText(category.name);

  let score = 0;

  const nameTokens = normalizedName
    .split(/\s+/)
    .filter((token) => token.length > 2);

  for (const token of nameTokens) {
    if (containsTerm(normalizedText, token)) {
      score += 2;
    }
  }

  for (const group of CATEGORY_KEYWORDS) {
    const matchedKeyword = group.keywords.some((keyword) =>
      containsTerm(normalizedText, keyword),
    );

    const matchesCategory = group.categoryTerms.some((term) =>
      containsTerm(normalizedName, term),
    );

    if (matchedKeyword && matchesCategory) {
      score += 3;
    }
  }

  return score;
}

export function bestCategory(
  text: string,
  type: TransactionType,
  categories: CompanyCategory[],
): CompanyCategory | null {
  const candidates = categories
    .filter((category) => category.type === type)
    .map((category) => ({
      category,
      score: scoreCategory(text, category),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  if (candidates.length === 0) {
    return null;
  }

  // Se houver empate, não escolhemos uma categoria arbitrariamente.
  if (candidates.length > 1 && candidates[0].score === candidates[1].score) {
    return null;
  }

  return candidates[0].category;
}
