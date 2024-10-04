import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import Equipment from "./admin/ManageEquipment";
import ManageBookings from "./admin/ReservationTable";
function AdminRoutes() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="manage-equipment" element={<Equipment/>}/>
            <Route path="manage-booking" element={<ManageBookings/>}/>
            
        </Routes>
    </div>
  )
}

export default AdminRoutes;