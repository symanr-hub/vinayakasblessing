import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { translations } from "../utils/translations";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("agro_lang") || "en";
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem("agro_lang", langCode);
  };

  const t = translations[language] || translations.en;

  // Fetch farmer profile from public.profiles
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Could not fetch user profile from Supabase:", error.message);
        return null;
      }

      if (data) {
        setProfile(data);
        if (data.preferred_language && !localStorage.getItem("agro_lang_manual")) {
          setLanguageState(data.preferred_language);
        }
      }
      return data;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      return null;
    }
  };

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Register
  const register = async (email, password, { fullName, preferredLanguage = "en" }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          preferred_language: preferredLanguage,
        },
      },
    });

    if (error) throw error;
    if (preferredLanguage) setLanguage(preferredLanguage);
    return data;
  };

  // Login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Password Recovery
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    if (error) throw error;
    return data;
  };

  // Update Profile
  const updateProfileData = async (updates) => {
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    if (data.preferred_language) {
      setLanguage(data.preferred_language);
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        language,
        setLanguage,
        t,
        register,
        login,
        logout,
        resetPassword,
        updateProfile: updateProfileData,
        refreshProfile: () => user && fetchProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

