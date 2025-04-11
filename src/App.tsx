import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import Ecommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Reservations/RegisterReservation";
import NotFound from "./pages/OtherPage/NotFound";
import EditSQ from "./pages/Reservations/ReservationHistory";
import RegisterInventario from "./pages/Admin/AdminHome";
import SignIn from "./pages/AuthPages/SignIn";
import ProtectedRoute from "./context/ProtectedRoute";
import ReservationDetails from "./pages/Reservations/DetailsReservations";
import ReservationQuery from "./pages/Reservations/GetReservationAdmin";
import RepetitiveReservation from "./pages/Reservations/RepetitiveReservation";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<AppLayout />}>
          <Route index path="/home" element={<Ecommerce />} />
          <Route path="/meeting-reservation" element={<FormElements />} />
          <Route
            path="/admin/home"
            element={
              <>
                <ProtectedRoute>
                  <RegisterInventario />
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path="/reservations-history/"
            element={
              <>
                <ProtectedRoute>
                  <EditSQ />
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path="/repetitive-reservations/:id"
            element={<RepetitiveReservation />}
          />
          <Route
            path="/details-reservations/:id"
            element={<ReservationDetails />}
          />
          <Route
            path="/get-reservation-by-id/:id"
            element={<ReservationQuery />}
          />
        </Route>
        <Route path="/signin" element={<SignIn />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}