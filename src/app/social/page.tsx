'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import db from "../../lib/db";

const SocialTasks = dynamic(() => import('../components/SocialMedia/SocialTasks'), {
    ssr: false,
});

export default function SocialPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
        try {
            const users = await db.table('users').toArray();
            if (users.length > 0) {
                setUserId(users[0].user_id);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };
    fetchUserId();
}, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pb-20">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Social Tasks</h1>
        <SocialTasks userId={userId} />
      </div>
    </div>
  );
}

