/*
path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { login, renewToken, crearUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
  '/new',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email debe ser un email').isEmail(),
    validarCampos,
  ],
  crearUsuario
);

// post: /
// validar email, password

router.post(
  '/',
  [
    check('password', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email debe ser un email').isEmail(),
  ],
  login
);

// validarJWT
router.get('/renew', validarJWT, renewToken);

module.exports = router;
