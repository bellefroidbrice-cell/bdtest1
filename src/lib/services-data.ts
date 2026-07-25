import { ArrowLeftRight, Car, FileText, MessageCircle, Search, Wrench } from "lucide-react";
import type { ComponentType } from "react";

export interface ServiceInfo {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  /** Résumé court, utilisé dans les aperçus (accueil). */
  description: string;
  /** Description plus détaillée, utilisée sur la page Services dédiée. */
  details: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    Icon: Car,
    title: "Vente de véhicules",
    description:
      "Un large choix de véhicules d'occasion et récents, de marques généralistes.",
    details:
      "Un large choix de véhicules d'occasion et récents, de marques généralistes (Peugeot, Renault, Volkswagen, Kia et bien d'autres). Chaque véhicule est sélectionné avec soin et présenté en toute transparence, avec ses caractéristiques complètes.",
  },
  {
    Icon: ArrowLeftRight,
    title: "Reprise de véhicule",
    description:
      "Nous reprenons votre ancien véhicule lors de l'achat d'une nouvelle voiture.",
    details:
      "Vous souhaitez changer de véhicule ? Nous reprenons votre ancienne voiture lors de l'achat d'un véhicule chez BD Automobile, pour simplifier votre transition et alléger votre budget.",
  },
  {
    Icon: Search,
    title: "Recherche personnalisée",
    description:
      "Vous cherchez un modèle précis ? Nous le trouvons pour vous selon vos critères.",
    details:
      "Vous avez un modèle précis en tête ? Décrivez-nous vos critères (marque, budget, kilométrage, motorisation...) et nous vous aidons à trouver le véhicule qui y correspond.",
  },
  {
    Icon: MessageCircle,
    title: "Conseils & accompagnement",
    description:
      "Des conseils honnêtes pour vous aider à choisir le véhicule qui vous correspond.",
    details:
      "Choisir un véhicule d'occasion n'est pas toujours simple. Nous vous conseillons honnêtement, sans pression commerciale, pour vous aider à faire le bon choix selon votre usage et votre budget.",
  },
  {
    Icon: Wrench,
    title: "Mécanique générale",
    description: "Entretien et petites réparations mécaniques toutes marques.",
    details:
      "En tant que garagiste général, nous assurons également l'entretien et les petites réparations mécaniques, toutes marques. Contactez-nous pour toute demande spécifique.",
  },
  {
    Icon: FileText,
    title: "Accompagnement administratif",
    description:
      "Immatriculation et formalités : nous simplifions les démarches liées à votre achat.",
    details:
      "Immatriculation, formalités de vente : nous vous accompagnons dans toutes les démarches administratives liées à l'achat de votre véhicule, pour vous simplifier la vie.",
  },
];
