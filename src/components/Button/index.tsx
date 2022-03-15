// ----------------------------------------------------------
import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Container, ButtonText } from './styles';

// ----------------------------------------------------------
// Para receber a propriedade de onPress do button.
// Importar de dentro de 'react-native-gesture-handler'.
// RectButtonProperties, todo botão vai precisar ter um texto.
interface ButtonProps extends RectButtonProperties {
  children: string; // forçar para o children ser um texto.
}

// ----------------------------------------------------------
const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;

