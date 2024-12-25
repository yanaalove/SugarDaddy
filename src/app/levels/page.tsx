'use client';
import React, { useState, useEffect, lazy, Suspense } from "react";

import dynamic from "next/dynamic";
import db from "../../lib/db"


const StarPurchaseCard = dynamic(() => import('../components/PurchaseCard/StarPurchaseCard'), {
    ssr: false, // الكود يتم تحميله في العميل فقط
});

const Levels: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);


   
  useEffect(() => {
    const fetchUserId = async () => {
      const users = await db.users.toArray()
      if (users.length > 0) {
        setUserId(users[0].user_id)
      }
    }
    fetchUserId()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 pb-20">
      <div className="w-full max-w-sm">
    <StarPurchaseCard  userId={userId} />
    </div>
  </div>
  );
};

export default Levels;
