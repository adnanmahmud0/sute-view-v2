import type { Metadata } from "next";
import { DirectAppointmentView } from "@/components/appointment/DirectAppointmentView";

export const metadata: Metadata = {
  title: "Book Appointment | The Sartorialist Zürich",
  description:
    "Vereinbaren Sie Ihren persönlichen Beratungstermin für Ihren Massanzug bei The Sartorialist Zürich."
};

export default function AppointmentPage() {
  return <DirectAppointmentView />;
}
