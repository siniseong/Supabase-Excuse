'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      if (subscription?.subscription) {
        subscription.subscription.unsubscribe();
      } else if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
          });
          if (error) {
            console.error('Kakao Sign In Error:', error.message);
          }
        }}
        className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        로그인하기
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleLogout}
        className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        로그아웃
      </button>
    </div>
  );
}