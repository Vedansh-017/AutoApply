import axios from 'axios';

const SubscribeButton = () => {
  const handleSubscribe = async () => {
    try {
      const { data } = await axios.post('/api/payment/create-order');
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'AutoApply',
        description: 'Pro Plan',
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await axios.post('/api/payment/verify', response);
          if (verifyRes.data.success) {
            alert("Pro Plan Activated!");
            window.location.reload(); // Or re-fetch user data
          } else {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed to initiate");
    }
  };

  return <button onClick={handleSubscribe}>Upgrade to Pro</button>;
};

export default SubscribeButton;
