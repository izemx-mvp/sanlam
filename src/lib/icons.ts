import {
  Activity, Ambulance, BadgeCheck, Baby, Briefcase, Building2, CalendarClock, Car, CarFront, ClipboardCheck,
  CloudLightning, Droplets, FileCheck2, FileText, Flame, Gauge, Glasses, Globe, GraduationCap, HandCoins,
  HardHat, HeartHandshake, HeartPulse, Hospital, House, KeyRound, Landmark, Laptop, LifeBuoy, Lock, Luggage, Pill,
  MapPin, Package, PiggyBank, Plane, Scale, ShieldCheck, ShieldPlus, Siren, Smile, Stethoscope, Store,
  Timer, TrendingUp, Truck, Umbrella, UserCheck, Users, UsersRound, Wallet, Wrench, Zap, Plug,
  type LucideIcon,
} from "lucide-react";

export const iconRegistry = {
  Activity, Ambulance, BadgeCheck, Baby, Briefcase, Building2, CalendarClock, Car, CarFront, ClipboardCheck,
  CloudLightning, Droplets, FileCheck2, FileText, Flame, Gauge, Glasses, Globe, GraduationCap, HandCoins,
  HardHat, HeartHandshake, HeartPulse, Hospital, House, KeyRound, Landmark, Laptop, LifeBuoy, Lock, Luggage, Pill,
  MapPin, Package, PiggyBank, Plane, Scale, ShieldCheck, ShieldPlus, Siren, Smile, Stethoscope, Store,
  Timer, TrendingUp, Truck, Umbrella, UserCheck, Users, UsersRound, Wallet, Wrench, Zap, Plug,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export const getIcon = (name: IconName): LucideIcon => iconRegistry[name];
