import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import Ecommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Forms/FormElements";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import UserProfiles from "./pages/UserProfiles";
import DetailsSQ from "./pages/SQ/DetailsSQ";
import EditSQ from "./pages/SQ/EditSQ";
import RegisterInventario from "./pages/Inventario/RegisterInventario";
import PictoRegister from "./pages/Pictograma/PictoRegister";
import ListPictogramas from "./pages/Pictograma/ListPictogramas";
import InfoInventario from "./pages/Inventario/InfoIventario";
import RegisterArea from "./pages/Areas/RegisterArea";
import AreaList from "./pages/Areas/AreaList";
import EditArea from "./pages/Areas/EditArea";
import Report from "./pages/Report/Report";
import EditInventario from "./pages/Inventario/EditInventario";
import ReportInventario from "./pages/Report/ReporteInventario";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>  
          <Route index path="/" element={<Ecommerce />} />
          <Route path="/home" element={<Ecommerce />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/soporte-tecnico" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/sq/details/:id" element={<DetailsSQ />} />
          <Route path="/sq/edit/:id" element={<EditSQ />} />
          <Route path="/inventario-register" element={<RegisterInventario />} />
          <Route path="/inventario-info" element={<InfoInventario />} />
          <Route path="/edit-inventario/:id" element={<EditInventario />} />
          <Route path="/pictogramas-register" element={<PictoRegister />} />
          <Route path="/pictogramas" element={<ListPictogramas />} />
          <Route path="/areas-register" element={<RegisterArea />} />
          <Route path="/area-list" element={<AreaList />} />
          <Route path="/area-edit/:id" element={<EditArea />} />
          <Route path="/report-info" element={<Report />} />
          <Route path="/report-inventario" element={<ReportInventario />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
