// ------------------------------------------------------------
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

// ------------------------------------------------------------
const Auth = createStackNavigator();

// ------------------------------------------------------------
const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false, // remove o cabeçalho da aplicação.
      cardStyle: { backgroundColor: '#312e38' }, // coloca o fundo igual o da aplicação.
    }}
  >
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
