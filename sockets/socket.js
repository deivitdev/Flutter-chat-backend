const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', (client) => {
  console.log('Cliente conectado');

  const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

  // Verificar autenticacion
  if (!valido) {
    return client.disconnect();
  }

  // Cliente autenticado
  usuarioConectado(uid);

  // Ingresar usuario a sala especifica
  // sala global, client.id, 62ab990d96cafb9f077ddeab
  client.join(uid);

  // Escuchar del cliente el mensaje-personal
  client.on('mensaje-personal', async (payload) => {
    console.log(payload);

    //TODO: grabar mensaje
    await grabarMensaje(payload);

    io.to(payload.para).emit('mensaje-personal', payload);
  });

  client.on('disconnect', () => {
    usuarioDesconectado(uid);
  });

  //   client.on('mensaje', (payload) => {
  //     console.log('Mensaje', payload);

  //     io.emit('mensaje', { admin: 'Nuevo mensaje' });
  //   });
});
