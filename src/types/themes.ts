export type ThemeId =
  | 'minimalist-terracotta'
  | 'cyberpunk-neon'
  | 'corporate-professional'
  | 'midnight-emerald'
  | 'solar-flare'
  | 'amethyst-twilight';

export interface ThemeColors {
  primary: string; // Main brand accent
  primaryHover: string;
  secondary: string; // Secondary vibrant highlight
  accent: string; // Tertiary highlight / badge
  background: string; // Main background
  backgroundSurface: string; // Surface / container background
  backgroundCard: string; // Card background
  border: string; // Border color
  borderHover: string; // Hover border color
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  glowColor: string; // Box shadow glow color rgba
  glowColorSecondary: string;
  gradientBrand: string; // CSS linear-gradient string
  gridColor1: string; // Grid radial gradient 1
  gridColor2: string; // Grid radial gradient 2
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  badge: string;
  vibe: string;
  iconName: string;
  colors: ThemeColors;
  isDark: boolean;
}

export const THEMES_LIST: ThemeConfig[] = [
  {
    id: 'minimalist-terracotta',
    name: 'Minimalist Terracotta',
    description: 'Estética calorosa e sofisticada com tons Terracota, Laranja Pôr do Sol e Rosa Criativo da marca Rimane.',
    badge: 'Padrão PlayStart',
    vibe: 'Caloroso • Criativo • Premium',
    iconName: 'Flame',
    isDark: true,
    colors: {
      primary: '#E05A47',
      primaryHover: '#EA6B59',
      secondary: '#F97316',
      accent: '#EC4899',
      background: '#0E0D12',
      backgroundSurface: '#18131B',
      backgroundCard: '#1F1722',
      border: 'rgba(224, 90, 71, 0.35)',
      borderHover: 'rgba(249, 115, 22, 0.6)',
      textPrimary: '#FFFFFF',
      textSecondary: '#E2E8F0',
      textMuted: '#94A3B8',
      textAccent: '#FB923C',
      glowColor: 'rgba(224, 90, 71, 0.45)',
      glowColorSecondary: 'rgba(236, 72, 153, 0.35)',
      gradientBrand: 'linear-gradient(135deg, #E05A47 0%, #F97316 50%, #EC4899 100%)',
      gridColor1: 'rgba(224, 90, 71, 0.08)',
      gridColor2: 'rgba(236, 72, 153, 0.07)',
    },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Atmosfera sci-fi hiper-futurista com Ciano Elétrico, Magenta Neon e Obsidian Dark para imersão total.',
    badge: 'Alta Energia',
    vibe: 'Sci-Fi • Neon • Hiper-Futurista',
    iconName: 'Zap',
    isDark: true,
    colors: {
      primary: '#06B6D4',
      primaryHover: '#22D3EE',
      secondary: '#F43F5E',
      accent: '#8B5CF6',
      background: '#07090E',
      backgroundSurface: '#0D111A',
      backgroundCard: '#131926',
      border: 'rgba(6, 182, 212, 0.35)',
      borderHover: 'rgba(34, 211, 238, 0.65)',
      textPrimary: '#F8FAFC',
      textSecondary: '#E2E8F0',
      textMuted: '#64748B',
      textAccent: '#67E8F9',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      glowColorSecondary: 'rgba(244, 63, 94, 0.35)',
      gradientBrand: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #F43F5E 100%)',
      gridColor1: 'rgba(6, 182, 212, 0.1)',
      gridColor2: 'rgba(244, 63, 94, 0.08)',
    },
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Paleta corporativa sóbria e refinada com Azul Royal, Indigo Executivo e Navy para tom institucional de alto valor.',
    badge: 'Enterprise B2B',
    vibe: 'Sóbrio • Confiança • Executivo',
    iconName: 'Briefcase',
    isDark: true,
    colors: {
      primary: '#2563EB',
      primaryHover: '#3B82F6',
      secondary: '#4F46E5',
      accent: '#0D9488',
      background: '#0B0F19',
      backgroundSurface: '#111827',
      backgroundCard: '#1F2937',
      border: 'rgba(37, 99, 235, 0.35)',
      borderHover: 'rgba(59, 130, 246, 0.65)',
      textPrimary: '#FFFFFF',
      textSecondary: '#E2E8F0',
      textMuted: '#94A3B8',
      textAccent: '#60A5FA',
      glowColor: 'rgba(37, 99, 235, 0.45)',
      glowColorSecondary: 'rgba(79, 70, 229, 0.35)',
      gradientBrand: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #0D9488 100%)',
      gridColor1: 'rgba(37, 99, 235, 0.08)',
      gridColor2: 'rgba(79, 70, 229, 0.07)',
    },
  },
  {
    id: 'midnight-emerald',
    name: 'Midnight Emerald',
    description: 'Matriz tecnológica e luxo orgânico com Verde Esmeralda, Jade e Dourado Âmbar sobre preto obsidiana.',
    badge: 'Luxo & Matrix',
    vibe: 'Exclusivo • Matrix • Orgânico',
    iconName: 'ShieldCheck',
    isDark: true,
    colors: {
      primary: '#10B981',
      primaryHover: '#34D399',
      secondary: '#F59E0B',
      accent: '#059669',
      background: '#050D0A',
      backgroundSurface: '#0B1713',
      backgroundCard: '#10241E',
      border: 'rgba(16, 185, 129, 0.35)',
      borderHover: 'rgba(52, 211, 153, 0.65)',
      textPrimary: '#F0FDF4',
      textSecondary: '#D1FAE5',
      textMuted: '#6EE7B7',
      textAccent: '#34D399',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      glowColorSecondary: 'rgba(245, 158, 11, 0.35)',
      gradientBrand: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #F59E0B 100%)',
      gridColor1: 'rgba(16, 185, 129, 0.09)',
      gridColor2: 'rgba(245, 158, 11, 0.07)',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Energia solar radiante com Âmbar Dourado, Coral Carmesim e Pêssego Iluminado para dinamismo imediato.',
    badge: 'Máximo Impacto',
    vibe: 'Vibrante • Solar • Dinâmico',
    iconName: 'Sun',
    isDark: true,
    colors: {
      primary: '#F59E0B',
      primaryHover: '#FBBF24',
      secondary: '#EF4444',
      accent: '#FB923C',
      background: '#120B06',
      backgroundSurface: '#1C110A',
      backgroundCard: '#29180E',
      border: 'rgba(245, 158, 11, 0.35)',
      borderHover: 'rgba(251, 191, 36, 0.65)',
      textPrimary: '#FFFBEB',
      textSecondary: '#FEF3C7',
      textMuted: '#FDE68A',
      textAccent: '#FBBF24',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      glowColorSecondary: 'rgba(239, 68, 68, 0.35)',
      gradientBrand: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #FB923C 100%)',
      gridColor1: 'rgba(245, 158, 11, 0.09)',
      gridColor2: 'rgba(239, 68, 68, 0.07)',
    },
  },
  {
    id: 'amethyst-twilight',
    name: 'Amethyst Twilight',
    description: 'Misticismo digital e elegância noturna com Violeta Elétrico, Rosa Magenta e Roxo Meia-Noite.',
    badge: 'Místico & Criativo',
    vibe: 'Místico • Elegante • Profundo',
    iconName: 'Sparkles',
    isDark: true,
    colors: {
      primary: '#8B5CF6',
      primaryHover: '#A78BFA',
      secondary: '#EC4899',
      accent: '#6366F1',
      background: '#0D0814',
      backgroundSurface: '#150E20',
      backgroundCard: '#1F1430',
      border: 'rgba(139, 92, 246, 0.35)',
      borderHover: 'rgba(167, 139, 250, 0.65)',
      textPrimary: '#FAF5FF',
      textSecondary: '#F3E8FF',
      textMuted: '#D8B4FE',
      textAccent: '#C084FC',
      glowColor: 'rgba(139, 92, 246, 0.45)',
      glowColorSecondary: 'rgba(236, 72, 153, 0.35)',
      gradientBrand: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #6366F1 100%)',
      gridColor1: 'rgba(139, 92, 246, 0.09)',
      gridColor2: 'rgba(236, 72, 153, 0.07)',
    },
  },
];
