import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type Credentials = {
  email: string;
  password: string;
};

export type AuthActionResult = {
  ok: boolean;
  message: string | null;
  requiresEmailConfirmation?: boolean;
};

type AuthContextValue = {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  signInWithPassword: (credentials: Credentials) => Promise<AuthActionResult>;
  signUpWithPassword: (credentials: Credentials) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setSession(data.session);
          setIsLoading(false);
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      startTransition(() => {
        setSession(nextSession);
        setIsLoading(false);
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async ({ email, password }: Credentials) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const requiresEmailConfirmation = /email not confirmed/i.test(error.message);

      return {
        ok: false,
        message: requiresEmailConfirmation
          ? "This Supabase project still has Confirm email enabled. Turn it off in Authentication -> Settings, delete the unconfirmed user, then sign up again."
          : error.message,
        requiresEmailConfirmation,
      };
    }

    return {
      ok: true,
      message: null,
    };
  };

  const signUpWithPassword = async ({ email, password }: Credentials) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    if (!data.session) {
      return {
        ok: true,
        message:
          "Account created, but this Supabase project is still requiring email confirmation. Disable Confirm email in Authentication -> Settings, delete the unconfirmed user, then sign up again.",
        requiresEmailConfirmation: true,
      };
    }

    return {
      ok: true,
      message: "Account created and signed in.",
    };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: null,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        session,
        user: session?.user ?? null,
        signInWithPassword,
        signUpWithPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
