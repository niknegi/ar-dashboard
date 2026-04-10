import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { VendorDetail } from "./components/VendorDetail";

function App() {
  return (
    <DataProvider>
      <BrowserRouter basename="/ar-dashboard">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="vendor/:vendorName" element={<VendorDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
