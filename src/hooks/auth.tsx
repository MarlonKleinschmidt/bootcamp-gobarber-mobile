//------------ importações -------------------------------------------
import React,
{
  createContext,
  useCallback,
  useState, useContext, useEffect
} from 'react';

// banco de dados assincrono, utiliza normalmente sqllite
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';


//------------ interfaces --------------------------------------------

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

// (Type) Estrutura de dados do ESTADO de autenticação.
interface AuthState {
  token: string;
  user: User;
}

// (Type) Estrutura de dados do MÉTODO de autenticação.
interface SignInCredentials {
  email: string;
  password: string;
}

// (Type) Estrutura de dados do CONTEXTO(API) de autenticação.
interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}


//------------ componentes / exportaçõs----------------------------------
// Contexto - variável que ficará acessível na aplicação.
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Componente ...
export const AuthProvider: React.FC = ({ children }) => {

  // Lê informações do login(do localstorage) e atribui as variáveis token e user,
  // ou inicializa vazio...
  const [data, setData] = useState<AuthState>({} as AuthState);

  const [loading, setLoading] = useState(true);

  // disparar a função para buscar os valores do AsyncStorage assim que o elemento
  // for exibido em tela utilizando o useEffect para tal.
  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        // Atribuir o header authorization passando o token no login...
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }
    loadStorageData();
  }, []);
  // ...

  // metodo signIn, executa processo de autenticação...
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // busca resposta da api e guarda no AsyncStorage
    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user),]
    ]);

    // Atribuir o header authorization passando o token no login...
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user }); // atualiza variáveis com as vindas do formulário
  }, []);
  // ...

  // metodo signOut, executa processo de logout da autenticação...
  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
    setData({} as AuthState);
  }, []);
  // ...

  // metodo updateUser, executa a atualização do perfil...
  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    }, [setData, data.token]);

  return (
    <AuthContext.Provider 
      value={{ user: data.user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
// ...

// função para acessar o contexto de autenticação...
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// ...

