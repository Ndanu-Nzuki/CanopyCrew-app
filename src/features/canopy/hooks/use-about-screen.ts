import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { sites } from '@/features/canopy/utils/catalogue';
import { apiGet, apiPost } from '@/utils/api';

interface Community {
  members: number;
  planted: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAboutScreen() {
  const [community, setCommunity] = useState<Community | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    apiGet<Community>('/community')
      .then(setCommunity)
      .catch(() => setCommunity(null));
  }, []);

  const send = async () => {
    if (name.trim().length === 0) return setError('Add your name so we know who to reply to.');
    if (!EMAIL_RE.test(email.trim())) return setError('That email doesn’t look right.');
    if (message.trim().length < 5) return setError('Write a short message first.');
    setError(null);
    setSending(true);
    try {
      await apiPost('/contact', { name: name.trim(), email: email.trim(), message: message.trim() });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Couldn’t send right now. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const planted = community?.planted ?? 0;

  return {
    impact: [
      { icon: 'leaf' as const, value: `${planted}`, label: 'Native species planted' },
      { icon: 'people' as const, value: `${community?.members ?? 0}`, label: 'Community members' },
      { icon: 'map' as const, value: `${sites.length}`, label: 'Sites mapped in São Paulo' },
      { icon: 'cloud' as const, value: `~${Math.round(planted * 7.5)} kg`, label: 'Estimated CO₂ per year' },
    ],
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    sending,
    error,
    sent,
    send,
    writeAnother: () => setSent(false),
    open: (url: string) => void Linking.openURL(url),
  };
}
