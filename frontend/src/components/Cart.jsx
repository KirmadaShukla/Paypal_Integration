import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, syncCart } from '../store/cartSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const userId = 'user123'; // Mock user ID
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Fetch cart from backend
    axios.get(`/api/cart/${userId}`)
      .then(res => dispatch(syncCart(res.data)))
      .catch(err => console.error(err));
  }, [dispatch]);

  useEffect(() => {
    // Sync cart with backend
    if (cart?.items?.length > 0) {
      axios.post(`https://localhost:3000/api/cart/${userId}`, {
        items: cart.items,
        total: cart.total
      }).catch(err => console.error(err));
    }
  }, [cart.items, cart.total]);

  const handlePaypalPayment = async () => {
    try {
      // Create PayPal order
      const response = await axios.post(`https://localhost:3000/api/payment/create-order/${userId}`, { total: cart.total });
      const { orderId } = response.data;
      setOrderId(orderId);

      // Open PayPal popup
      window.open(`https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`, '_blank');
    } catch (err) {
      console.error(err);
      alert('Error initiating payment');
    }
  };

  const handleCaptureOrder = async () => {
    if (!orderId) return;
    try {
      const response = await axios.post(`/api/payment/capture-order/${userId}`, { orderId });
      alert(`Payment successful! Transaction ID: ${response.data.transactionId}`);
      // Clear cart after successful payment
      dispatch(syncCart({ items: [], total: 0 }));
      await axios.post(`/api/cart/${userId}`, { items: [], total: 0 });
    } catch (err) {
      console.error(err);
      alert('Error capturing payment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart?.items?.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart?.items?.map(item => (
            <div key={item.productId} className="flex items-center border-b py-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-contain mr-4" />
              <div className="flex-1">
                <h3 className="text-lg">{item.title}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="bg-red-500 text-white px-4 py-1 rounded ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Total: ${cart?.total?.toFixed(2)}</h3>
            <button
              onClick={handlePaypalPayment}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Pay with PayPal
            </button>
            {orderId && (
              <button
                onClick={handleCaptureOrder}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2 ml-2"
              >
                Confirm Payment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;