import type { Metadata } from "next";
import { SuitFrontStyleConfigurator } from "@/components/suits/SuitFrontStyleConfigurator";

export const metadata: Metadata = {
  title: "Front Style | Full Suit Bespoke Configurator",
  description:
    "Wählen Sie Ihren gewünschten Schnitt für den Massanzug: Single-breasted (Einreiher) oder Double-breasted (Zweireiher). Exklusive Masskonfektion bei The Sartorialist Zürich."
};

export default function FullSuitPage() {
  return <SuitFrontStyleConfigurator />;
}
