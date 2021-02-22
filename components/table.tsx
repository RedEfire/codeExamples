import React from "react";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { AppointmentType } from "../../types";

interface TableProps {
  appointments: AppointmentType[];
  cancelAppointment: (id: string | number) => void;
  activeSidebarKey: string;
}

const Table = ({
  appointments,
  cancelAppointment,
  activeSidebarKey,
}: TableProps): JSX.Element => {
  return (
    <table>
      <TableHeader activeSidebarKey={activeSidebarKey} />
      <TableBody
        appointments={appointments}
        cancelAppointment={cancelAppointment}
      />
    </table>
  );
};

export default Table;
