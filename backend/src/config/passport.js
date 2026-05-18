const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./database');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user) return done(null, false, { message: 'Invalid email or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Invalid email or password' });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true },
    });
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;