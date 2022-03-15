// ------------------------------------------------------------
import React, { useCallback, useRef } from 'react';
// NOTA:
//      Em alguns casos, dependendo do seu layout,
//      o teclado pode cobrir a caixa de texto, impedindo
//      a visibilidade do usuário. Para evitar este comportamento,
//      basta utiliazar o componente KeyboardAvoidingView.

import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

// ------------------------------------------------------------
// Campos que virão atravez do formulário.
interface SignInFormData {
  email: string;
  password: string;
}

// ------------------------------------------------------------
const SignIn: React.FC = () => {

  // formRef
  // é criada para quando queremos manipular um elemento de uma
  // forma direta, e não por algum evento que aconteça.
  // FormHandles contém os métodos que um formulário executa.
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  // pegar os metodos do hook/auth
  const { signIn, user } = useAuth();
  console.log(user);

  // função para submeter o formulário.
  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      // inicializa os erros com objeto vazio.
      formRef.current?.setErrors({});

      // cria a forma (schema) como os inputs serão validados.
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um email válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      // dispara a validação dos inputs conforme schema acima.
      await schema.validate(data, {
        abortEarly: false, // abortEarly = false vai retornar todos os erros de uma vez e nao o primeiro erro que encontrar
      });

      await signIn({
        email: data.email,
        password: data.password,
      });
    }
    catch (err) {
      // se retornou erro vindo da validação do Yup
      // chama a função que retorna os erros getValidationErrors e seta os erros na ref do formulário.
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        console.log(errors);
        formRef.current?.setErrors(errors);
        return;
      }
      // disparar um alert caso erro na autenticação...
      Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais')
      // disparar um toast caso erro na autenticação...

    }
  }, [signIn]);
  //  ...

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>

              <Input
                autoCorrect={false} // não corrige automaticamente as palavras
                autoCapitalize="none" // Não coloca letra maiúscula na primeira letra da palavra
                keyboardType="email-address" // adiciona @ no teclado para este input
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next" // altera o botão do teclado para next (próximo)

                // evento no click do botão do teclado
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef} // cria referência do input
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry // para colocar mascara de senha
                returnKeyType="send" // altera o botao do teclado

                // dispara o evento submit atraves do botão do teclado
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />


              <Button
                // dispara o evento submit atraves do botão do formulário
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => { console.log('texto1'); }}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => { navigation.navigate('SignUp') }}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>

    </>
  );
}

export default SignIn;
