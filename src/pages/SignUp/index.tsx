// --------------------------------------------------------------
import React, { useRef, useCallback } from 'react';
// NOTA:
//      Em alguns casos, dependendo do seu layout,
//      o teclado pode cobrir a caixa de texto, impedindo
//      a visibilidade do usuário. Para evitar este comportamento,
//      basta utilizar o componente KeyboardAvoidingView.
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
} from './styles';

// --------------------------------------------------------------
// Campos que virão atravez do formulário.
interface SignUpFormDate {
  name: string;
  email: string;
  password: string;
}

// --------------------------------------------------------------
const SignUp: React.FC = () => {

  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Função de submit do formulário ...
  const handleSignUp = useCallback(async (data: SignUpFormDate) => {
    try {

      // inicializa os erros com objeto vazio.
      formRef.current?.setErrors({});

      // cria a forma (schema) como os inputs serão validados.
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });
      // ...

      // Chama função de validação...
      await schema.validate(data, {
        abortEarly: false, // abortEarly vai retornar todos os erros de uma vez e nao o primeiro erro que encontrar
      });
      // ...

      // chama a api de cadastro ...
      await api.post('/users', data);
      // ...

      // Exibe mensagem de sucesso ...
      Alert.alert(
        'Cadastro realizado com sucesso',
        'Você já pode fazer seu logon no GoBarber!'
      );

      // redireciona para a tela anterior ...
      navigation.goBack();
      // ...


    } catch (err) {

      // se retornou erro vindo da validação do Yup
      // chama a função que retorna os erros getValidationErrors e seta os erros na ref do formulário.
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        console.log(errors);
        formRef.current?.setErrors(errors);
        return;
      }
      // disparar um alert caso erro na autenticação...
      Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer o cadastro, tente novamente.');
      /* addToast({
         type: 'error',
         title: 'Erro no cadastro',
         description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.',
       });*/

    }
  }, [navigation]);


  return (
    <>
      <KeyboardAvoidingView // evitar o teclado cobrir a caixa de texto
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView // cria barra de rolagem
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>

            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form
              ref={formRef}
              onSubmit={handleSignUp}
            >
              <Input
                autoCapitalize="words" // Coloca letra maiúscula na primeira letra da palavra
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next" // altera o botão do teclado para next (próximo)

                // evento no click do botão do teclado
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef} // cria referência do input
                keyboardType="email-address" // adiciona @ no teclado para este input
                autoCorrect={false} // não corrige automaticamente as palavras
                autoCapitalize="none" // não coloca letra maiúscula na primeita letra da palavra
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
                secureTextEntry // coloca máscara de senha no input
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword" // não sugere senha, usuário precisa preencher
                returnKeyType="send" // altera o botão do teclado para send (enviar)

                // dispara o evento submit atraves do botão do teclado
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >Entrar</Button>
            </Form>

          </Container>

        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => { navigation.goBack() }}>
        <Icon name="arrow-left" size={20} color="#FFF" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>

    </>
  );
}

export default SignUp;
