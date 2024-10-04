import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import ManageTicket from "./admin/ManageEquipment";
import ManageBookings from "./admin/ReservationTable";
function AdminRoutes() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="manage-ticket" element={<ManageTicket/>}/>
            <Route path="manage-booking" element={<ManageBookings/>}/>
            
        </Routes>
    </div>
  )
}

export default AdminRoutes;