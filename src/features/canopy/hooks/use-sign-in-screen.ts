import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export function useSignInScreen() {
  const router = useRouter();
  const { user, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/workspace');
  }, [user, router]);

  const submit = async () => {
    if (email.trim().length === 0 || password.length === 0) return setError('Enter your email and password.');
    if (mode === 'signup' && password.length < 8) return setError('Use at least 8 characters for your password.');
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return {
    mode,
    toggleMode: () => {
      setError(null);
      setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    },
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    busy,
    error,
    submit,
    close: () => router.back(),
  };
}
