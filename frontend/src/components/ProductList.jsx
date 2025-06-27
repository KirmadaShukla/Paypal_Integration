import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';

function ProductList({ products }) {
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded-lg">
          <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-gray-600">${product.price}</p>
          <button
            onClick={() => dispatch(addToCart({ 
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              quantity: 1
            }))}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add to Cart
          </button>
        </div>
      ))}
      <div className="mt-4">
        <Link to="/cart" className="bg-green-500 text-white px-4 py-2 rounded">
          View Cart
        </Link>
      </div>
    </div>
  );
}

export default ProductList;