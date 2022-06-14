const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya esta registrado',
      });
    }
    const usuario = new Usuario(req.body);

    // Encriptar Contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // Generar mi JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador',
    });
  }
};

// const login ... req, rest....
// {ok:true, msg: 'login}

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'email no encontrado',
      });
    }

    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'la constaseña no es valida',
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuarioDB.id);

    return res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'error al login',
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  //generar un nuevo JWT
  const token = await generarJWT(uid);

  const usuario = await Usuario.findById(uid);

  return res.status(401).json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewToken,
};
