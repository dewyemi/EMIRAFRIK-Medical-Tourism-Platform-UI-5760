import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles_healthcare')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('No profile found, user needs to complete registration');
        }
        setProfile(null);
      } else {
        console.log('Profile fetched:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const profileData = {
          user_id: data.user.id,
          full_name: userData.fullName,
          email: userData.email,
          phone_number: userData.phoneNumber || null,
          country: userData.country,
          role: userData.role || 'patient',
          provider_type: userData.providerType || null,
          specialization: userData.specialization || null,
          facility_name: userData.facilityName || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('user_profiles_healthcare')
          .insert(profileData);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }

        // Fetch the created profile
        await fetchProfile(data.user.id);
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // fetchProfile will be called automatically by the auth state change listener
      return { data, error };
    } catch (error) {
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;