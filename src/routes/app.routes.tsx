// ------------------------------------------------------------
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AppointmentCreated from '../pages/AppointmentCreated';
import CreateAppointment from '../pages/CreateAppointment';


// ------------------------------------------------------------
const App = createStackNavigator();

// ------------------------------------------------------------
const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false, // remove o cabeçalho da aplicação.
      cardStyle: { backgroundColor: '#312e38' }, // coloca o fundo igual o da aplicação.
    }}
  >

    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="Profile" component={Profile} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
  </App.Navigator>
);

export default AppRoutes;
