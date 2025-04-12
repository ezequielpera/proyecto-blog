const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../services/nodemailer");

const getMe = async (req, res) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization.split(" ")[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener los datos del usuario desde la base de datos
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Crear una nueva instancia de usuario
    user = new User({
      firstName,
      lastName,
      email,
      password,
      provider: "local", // Asegúrate de que el proveedor sea "local"
    });
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guardar el usuario en la base de datos
    await user.save();

    // Enviar correo de verificación
    const verificationLink = `https://proyecto-blog-xwmd.onrender.com/api/verify-email?token=${user.verificationToken}`;

    const mailOptions = {
      from: '"Proyecto-blog-ezequielpera" <ezequieldila@gmail.com>', // Remitente
      to: user.email, // Destinataio
      subject: "Verifica tu correo electrónico", // Asunto
      html: `<p>Hola ${user.firstName},</p>
             <p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
             <a href="${verificationLink}">Confirmar cuenta.</a>`, // Cuerpo del correo
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
        return res
          .status(500)
          .json({ msg: "Error al enviar el correo de verificación" });
      }
      

      // Crear y devolver el token JWT (el usuario aún no está verificado)
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            msg: "Usuario registrado. Por favor, verifica tu correo electrónico.",
          });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }
    if (user.provider !== "local") {
      return res.status(400).json({ msg: "Inicia sesión con Google o GitHub" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

const verify = async (req, res) => {
  const { token } = req.query;

  try {
    // Buscar al usuario por el token de verificación
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ msg: "Token de verificación inválido" });
    }

    // Marcar al usuario como verificado
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ msg: "Correo electrónico verificado exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

module.exports = { register, login, getMe, verify };
