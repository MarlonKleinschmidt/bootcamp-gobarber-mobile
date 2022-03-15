import axios from 'axios';

const api = axios.create({
  baseURL: "http://192.168.15.105:3333",
});

// Opções de conexão do nosso dispositivo com o nosso localhost
// Utilizar a baseURL

// iOS com emulador: localhost
// iOS com celular(físico): IP da máquina

// Android com emulador: localhost (adb reverse )
//  No teminal use o comando: adb reverse tcp:3333 tcp:3333

// Android com emulador: 10.0.2.2 (Android Studio) "http://10.0.2.2:3333"
// Android com emulador: 10.0.3.2 (Genymotion)
// Android com celular(fisico): IP da Máquina

export default api;
