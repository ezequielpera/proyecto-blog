const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Configuración de la estrategia de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verifica si el usuario ya existe en la base de datos
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Si el usuario no existe, créalo
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            provider: "google",
          });
          await user.save();
        }

        done(null, user); // Pasa el usuario a Passport
      } catch (err) {
        done(err, null); // Pasa el error a Passport
        console.error(err);
      }
    }
  )
);

// Configuración de la estrategia de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"], // Solicitar acceso al correo electrónico
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Perfil de GitHub:", profile); // Inspeccionar el perfil
        // Verificar si el perfil contiene un correo electrónico
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
          return done(new Error("No se pudo obtener el correo electrónico de GitHub"), null);
        }

        const email = profile.emails[0].value;

        // Verificar si el usuario ya existe en la base de datos
        let user = await User.findOne({ email });

        if (!user) {
          // Si el usuario no existe, créalo
          user = new User({
            firstName: profile.displayName || "GitHub User",
            email: email,
            provider: "github",
            providerId: profile.id, // ID único de GitHub
          });
          await user.save();
        }

        done(null, user); // Pasar el usuario a Passport
      } catch (err) {
        done(err, null); // Pasar el error a Passport
      }
    }
  )
);

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id); // Solo guarda el ID del usuario en la sesión
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Recupera el usuario desde la base de datos
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;