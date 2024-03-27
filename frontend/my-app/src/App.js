import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/header";
import "../src/App.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useUserRoutes from "./components/routes/userRoutes";
import useAminRoutes from "./components/routes/adminRoutes";



function App() {

  const userRoutes = useUserRoutes();
  const adminRoutes = useAminRoutes();

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container">
        <Routes>
            {userRoutes}
            {adminRoutes}
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
