// ------------------------------------------------------------
import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// ------------------------------------------------------------
interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

// ------------------------------------------------------------
export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px; /* distancia apenas nas laterais*/
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: #232129;

  flex-direction: row; /* por padrao vem por coluna, alterado para linha */
  align-items: center; /*para alinha o icone e o texto ao centro */

  ${props => props.isErrored && css`
    border-color: #C53030;
  `}

  ${props => props.isFocused && css`
    border-color: #ff9000;
  `}
`;

export const TextInput = styled.TextInput`
  flex: 1; /* vai fazer ocupar todo o tamanho dentro do container*/
  color: #fff; /* cor do texto digitado*/
  font-size: 16px;
  font-family: 'RobotoSlab-Regular'; /* No react-native nao consegue definir a fonte globalmente */
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px; /* pra distanciar o texto do icone */
`;
