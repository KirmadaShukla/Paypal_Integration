import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SearchBar from './components/SearchBar';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">MERN E-commerce</h1>
        <SearchBar setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path="/" element={<ProductList products={filteredProducts} />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;