export const createOrUpdateOrder = async (authToken, cartItems, orderId = null) => {
    const url = orderId ? `/api/orders/${orderId}/` : '/api/orders/';
    const method = orderId ? 'PUT' : 'POST';
  
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        // Construct the order data based on the cart items and user information
        items: cartItems.map(item => ({
          id: item.id,
          count: item.count,
        })),
        // Include any other necessary data for the order
      }),
    };
  
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error('Failed to create or update the order.');
      }
  
      const data = await response.json();
      return data; // Return the response data (e.g., updated order data)
    } catch (error) {
      console.error('Error creating or updating the order:', error);
      throw error;
    }
  };