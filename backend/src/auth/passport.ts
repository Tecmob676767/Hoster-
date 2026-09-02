import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Google OAuth Strategy ────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:4000'}/auth/google/callback`,
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: unknown, user?: Express.User | false) => void
  ) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email from Google'));

      // Find or create user
      const user = await prisma.user.upsert({
        where: { googleId: profile.id },
        update: {
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        },
        create: {
          googleId: profile.id,
          email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        },
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── Serialize / Deserialize ──────────────────────────────────────────────────
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: string }).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
