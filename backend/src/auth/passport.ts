import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { query, queryOne } from '../db';

interface DbUser {
  id: string; google_id: string; email: string;
  name: string; avatar: string | null; plan: string;
}

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:4000'}/auth/google/callback`,
  },
  async (_accessToken: string, _refreshToken: string, profile: Profile,
    done: (error: unknown, user?: Express.User | false) => void) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email from Google'));

      // Upsert user
      const rows = await query<DbUser>(`
        INSERT INTO users (google_id, email, name, avatar)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (google_id) DO UPDATE
          SET name   = EXCLUDED.name,
              avatar = EXCLUDED.avatar,
              updated_at = NOW()
        RETURNING *
      `, [profile.id, email, profile.displayName, profile.photos?.[0]?.value ?? null]);

      return done(null, rows[0] as unknown as Express.User);
    } catch (err) { return done(err); }
  }
));

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as DbUser).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await queryOne<DbUser>('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user as unknown as Express.User);
  } catch (err) { done(err); }
});
