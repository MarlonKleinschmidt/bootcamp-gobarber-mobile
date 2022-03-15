// ---------------------------------------------------------
import React,
{
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState
} from 'react';
import { TextInputProps } from 'react-native';

// useFied utilizado para registrar um campo no formulário.
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

// ---------------------------------------------------------
interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}

// valor do elemento input
interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}


// ---------------------------------------------------------
const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,) => {

  const inputElementRef = useRef<any>(null);

  // todas essas propriedades são necessárias para cadastrar
  // o input dentro do unform
  const { registerField, defaultValue = '', fieldName, error } = useField(name);

  // Referencia do valor do input
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  // Estado para saber quando um input recebeu foco ou não
  const [isFocused, setIsFocused] = useState(false);

  // Estado para saber quando um input está preenchido ou não
  const [isField, setIsField] = useState(false);

  // função para setar o focus
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // função para tirar o focus e verificar se existe algum valor
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsField(!!inputValueRef.current.value);
  }, []);

  // realizar o foco em tela.
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  // assim que o elemento for exibido em tela ele será registrado
  // para isso utilizar o useEffect.
  useEffect(() => {

    registerField<string>({

      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',

      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        // responsável por mudar visualmente o texto dentro do input.
        inputElementRef.current.setNativeProps({ text: value });
      },

      // vai limpar o conteúdo do input
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      }

    });
  }, [fieldName, registerField]);


  return (

    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>

      <Icon
        name={icon}
        size={20}
        // Se tiver no campo ou tiver preenchiodo troca a cor do ícone.
        color={isFocused || isField ? '#ff9000' : '#666360'} />

      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onFocus={handleInputFocus} // função de foco
        onBlur={handleInputBlur} // função de verificação ao sair do input
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
}
export default forwardRef(Input);

