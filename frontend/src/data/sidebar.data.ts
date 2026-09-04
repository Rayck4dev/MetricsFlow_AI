import {
  BarChart3,
  CircleUserRound,
  MessageSquare,
  PieChart,
  Receipt,
  Settings,
  Store,
} from "lucide-react";

export type SidebarSection =
  | "dashboard"
  | "whatsapp"
  | "dre"
  | "transactions"
  | "profile"
  | "company"
  | "preferences";

export interface NavigationItem {
  id: SidebarSection;
  label: string;
  href: string;
  icon: typeof BarChart3;
  comingSoon?: boolean;
}

export const navigation: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Visão geral",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "/whatsapp",
    icon: MessageSquare,
    comingSoon: true,
  },
  {
    id: "dre",
    label: "DRE",
    href: "/dre",
    icon: PieChart,
  },
  {
    id: "transactions",
    label: "Movimentações",
    href: "/movimentacoes",
    icon: Receipt,
  },
];

export const accountNavigation: NavigationItem[] = [
  {
    id: "profile",
    label: "Perfil",
    href: "/perfil",
    icon: CircleUserRound,
  },
  {
    id: "company",
    label: "Empresa",
    href: "/empresa",
    icon: Store,
  },
  {
    id: "preferences",
    label: "Preferências",
    href: "/preferencias",
    icon: Settings,
  },
];
