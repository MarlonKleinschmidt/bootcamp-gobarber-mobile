// ------------------------------------------------------------
import styled from 'styled-components/native';
import { Platform } from 'react-native';

// ------------------------------------------------------------
export const Container = styled.View`
  flex: 1; /* vai fazer ocupar todo o tamanho dentro do container*/

  justify-content: center; /* Centraliza conteudo na vertical.*/
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px; /* para que nada fique encostando nas laterais*/
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 48px;
  position: absolute;
  left: 24px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;

`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 180px;
  position: relative;
  `;

export const UserAvatar = styled.Image`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  align-self: center;

`;


