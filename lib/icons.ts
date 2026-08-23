/**
 * DTO'lardan gelen ikon adlarini (string) Lucide bilesenlerine eslestirir.
 * API'den "icon": "Target" gibi bir deger geldiginde dogru ikonu render eder.
 */

import {
  Activity,
  BarChart3,
  Eye,
  FlaskConical,
  Handshake,
  Image,
  LineChart,
  Megaphone,
  MessageCircle,
  PencilRuler,
  Repeat,
  Search,
  Settings2,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Youtube,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Search,
  Image,
  Youtube,
  Zap,
  Repeat,
  LineChart,
  FlaskConical,
  Users,
  Wallet,
  TrendingUp,
  Megaphone,
  PencilRuler,
  Settings2,
  Eye,
  BarChart3,
  Handshake,
  Activity,
  MessageCircle,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Target;
}
