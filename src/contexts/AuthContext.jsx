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
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        setError(null);

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setError(sessionError.message);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        console.log('✅ Session retrieved:', session?.user?.email || 'No session');
        if (mounted) {
          setUser(session?.user || null);
        }

        if (session?.user && mounted) {
          console.log('👤 Fetching user profile...');
          await fetchProfile(session.user.id);
        } else if (mounted) {
          console.log('🏁 No user session, completing initialization');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setError(error.message);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email || 'logged out');
      if (!mounted) return;

      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      setError(null);
      
      // Query the profile
      const { data, error } = await supabase
        .from('user_profiles_healthcare')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        setError('Failed to load profile: ' + error.message);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ Profile found:', data);
        setProfile(data);
        setLoading(false);
        return;
      }

      // No profile found, create one
      console.log('📝 Creating new profile...');
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.error('❌ No user data available for profile creation');
        setProfile(null);
        setLoading(false);
        return;
      }

      // Determine role based on email for test accounts and custom admin
      let role = 'patient';
      let fullName = 'User';

      if (userData.user.email === 'dewyemi+2@icloud.com') {
        role = 'admin';
        fullName = 'Admin User';
      } else if (userData.user.email === 'test.admin@demo.com') {
        role = 'admin';
        fullName = 'Demo Admin';
      } else if (userData.user.email === 'test.provider@demo.com') {
        role = 'provider';
        fullName = 'Demo Provider';
      } else if (userData.user.email === 'test.coordinator@demo.com') {
        role = 'coordinator';
        fullName = 'Demo Coordinator';
      } else if (userData.user.email === 'test.patient@demo.com') {
        role = 'patient';
        fullName = 'Demo Patient';
      }

      const newProfile = {
        user_id: userId,
        email: userData.user.email,
        full_name: fullName,
        role: role,
        status: 'active',
        country: 'United Arab Emirates',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('user_profiles_healthcare')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error('❌ Profile creation error:', createError);
        setError('Failed to create profile: ' + createError.message);
        setProfile(null);
      } else {
        console.log('✅ Profile created:', createdProfile);
        setProfile(createdProfile);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ fetchProfile error:', error);
      setError('Profile fetch failed: ' + error.message);
      setProfile(null);
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Signing up user:', email);
      
      // Sign up with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
          data: {
            full_name: userData.fullName,
            role: userData.role
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ User created, creating profile...');
        
        // Create profile immediately if user is confirmed
        if (data.user.email_confirmed_at || data.user.confirmed_at) {
          const profileData = {
            user_id: data.user.id,
            full_name: userData.fullName,
            email: userData.email,
            phone_number: userData.phoneNumber || null,
            country: userData.country,
            role: userData.role || 'patient',
            status: 'active',
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
            console.error('❌ Profile creation error:', profileError);
            console.log('Profile will be created on next login');
          } else {
            console.log('✅ Profile created successfully');
          }
        }
      }

      return { data, error };
    } catch (error) {
      console.error('❌ SignUp error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Sign in successful');
      return { data, error };
    } catch (error) {
      console.error('❌ SignIn error:', error);
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('👋 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setProfile(null);
      setUser(null);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;