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
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';
import { useAuth } from '../../hooks/auth';



// --------------------------------------------------------------
// Campos que virão atravez do formulário.
interface ProfileFormDate {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

// --------------------------------------------------------------
const Profile: React.FC = () => {

  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Função de submit do formulário.
  const handleProfile = useCallback(
    async (data: ProfileFormDate) => {
      try {

        // inicializa os erros com objeto vazio.
        formRef.current?.setErrors({});

        // cria a forma (schema) como os inputs serão validados.
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: any) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: (val: any) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }).oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação de senha incorreta',
          ),
        });
        // ...

        // Chama função de validação...
        await schema.validate(data, {
          abortEarly: false, // abortEarly vai retornar todos os erros de uma vez e nao o primeiro erro que encontrar
        });
        // ...
        // pega os dados do formulário
        const { 
          name, 
          email, 
          old_password, 
          password, 
          password_confirmation 
        } = data;

        // monta os dados do formulario que foram enviados, só nome email, ou com a senha junto
        const formData = {
          name,
          email,
          ...(old_password
            ?
            {
              old_password,
              password,
              password_confirmation,
            } : {})
        };

        // chama a api passando a variavel formData como parâmetro para realizar o update ...
        const response = await api.put('/profile', formData);

        // atualiza o localstorage para recarregar os campos do usuario.
        updateUser(response.data);

        // Exibe mensagem de sucesso ...
        Alert.alert(
          'Perfil atualizado com sucesso!'
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
        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.'
        );
        /* addToast({
                type: 'error',
              title: 'Erro no cadastro',
              description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.',
         });*/

      }
    }, [navigation,updateUser]);


  // Função para realizar a atualização da imagem do usuário.
  const handleUpdateAvatar = useCallback(()=>{

    ImagePicker.showImagePicker(
    {
      title: 'Selecione um avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galeria',
    },
    (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.error){
        Alert.alert('Erro ao atualizar seu avatar!');
        return;
      }     
      // utilizando a imagem selecionada pelo usuario
      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg', 
        name: `${user.id}.jpg`,
        uri: response.uri,
      });

      // atualiza a imagem no banco.
      api.patch('users/avatar', data).then(apiResponse => {
        updateUser(apiResponse.data);
      });       
      },    
    );

  },[updateUser,user.id]);
  

  // Função para voltar para a página anterior.
  const handleGoBack = useCallback(() => {
    navigation.goBack();
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
          <BackButton onPress={handleGoBack} >
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <Container>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              initialData={user}
              ref={formRef}
              onSubmit={handleProfile}
            >
              <Input
                autoCapitalize="words" // Coloca em maiúsculo a primeira letra da palavra
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
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef} // cria referência do input
                secureTextEntry // coloca máscara de senha no input
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                textContentType="newPassword" // não sugere senha, usuário precisa preencher
                returnKeyType="next" // altera o botão do teclado para send (enviar)
                containerStyle={{ marginTop: 16 }}

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
                placeholder="Nova senha"
                textContentType="newPassword" // não sugere senha, usuário precisa preencher
                returnKeyType="next" // altera o botão do teclado para send (enviar)

                // evento no click do botão do teclado
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={confirmPasswordInputRef} // cria referência do input
                secureTextEntry // coloca máscara de senha no input
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
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
              >Confirmar mudanças</Button>
            </Form>

          </Container>

        </ScrollView>
      </KeyboardAvoidingView>

    </>
  );
}

export default Profile;
