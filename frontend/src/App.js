import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import Home from "./components/Home";
import ProductDetail from "./components/product/ProductDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" Component={Home} exact />
            <Route path="/search/:keyword" Component={Home} />
            <Route path="/products/:id" Component={ProductDetail} exact />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
