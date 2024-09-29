//Variable de Entorno para firebase
export const environment = {
  production: true,

  refrescarLista: 15000, //15 segundos
  tiempoSession: 3600000, // 1h para que este activa la sesion
  tiempoAlerta: 5000, // 5 segundos para responder a la alerta
  
  //apiUrl: 'https://repertorioangular-production.up.railway.app/app',
  //apiUrl: 'https://repertoriomusica.onrender.com/app',
  apiUrl: 'http://localhost:3000/app',

  urlAnime: 'http://127.0.0.1:8083/',
  urlMusica: 'http://127.0.0.1:8081/',
  urlSeries: 'http://127.0.0.1:8082/',
  //urlAnime: 'https://repertorio-anime.web.app/',
  //urlMusica: 'https://repertorio-musica.web.app/',
  //urlSeries: 'https://repertorio-series.web.app/',

  temporizador: 0,

  proyecto: 1, // 1. Musica, 2. Series, 3. Anime
  servidor: 1, // 1 Local, 2 Servidor
};
