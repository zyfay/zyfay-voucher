import React, { useState } from 'react';
import HomeScreen from '../screens/HomeScreen';
import OrderScreen from '../screens/OrderScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import StatusScreen from '../screens/StatusScreen';

/**
 * Navigasi antar screen pakai useState sederhana (tanpa react-navigation)
 * supaya langsung jalan di Expo Go tanpa install library tambahan.
 * Kalau project ini berkembang, gampang diganti ke @react-navigation/native.
 */
export default function AppNavigator() {
  const [route, setRoute] = useState('Home');
  const [params, setParams] = useState({});

  const navigate = (name, nextParams = {}) => {
    setParams(nextParams);
    setRoute(name);
  };

  const goHome = () => navigate('Home');

  switch (route) {
    case 'Order':
      return <OrderScreen game={params.game} navigate={navigate} goBack={goHome} />;
    case 'Checkout':
      return (
        <CheckoutScreen
          orderDraft={params.orderDraft}
          navigate={navigate}
          goBack={() => navigate('Order', { game: params.orderDraft.game })}
        />
      );
    case 'Status':
      return <StatusScreen order={params.order} goHome={goHome} />;
    case 'Home':
    default:
      return <HomeScreen navigate={navigate} />;
  }
}
