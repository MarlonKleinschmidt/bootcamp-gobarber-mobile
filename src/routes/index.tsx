// ----------------------------------------------------------------
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

// importar o useAuth para saber se o usuário está logado ou nao
import { useAuth } from '../hooks/auth';

// ----------------------------------------------------------------
const Routes: React.FC = () => {

  // pega os dados do usuário e o propriedade loading do hook de autenticação.
  const { user, loading } = useAuth();

  // enquanto está sendo feita a verificação de autenticação a aplicação exibe
  // o icone que fica girando, enquando carrega a rota.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View >
    );
  }

  // Verifica se o usuário está logado, se estiver mostra as rotas autenticadas <AppRoutes>
  // senão mostra as rotas abertas, que não necessitam estar autenticada.
  return user ? <AppRoutes /> : <AuthRoutes />;

};

export default Routes;
