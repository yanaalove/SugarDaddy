"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const ReferralCard = dynamic(() => import('../components/ReferralCard/ReferralCard'), {
  ssr: false,
});

const ReferralPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const handleSetUserId = (id: string) => {
    if (id) {
      setUserId(id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 pb-20">
      <div className="w-full max-w-sm">
        <ReferralCard onSetUserId={handleSetUserId} />
      </div>
    </div>
  );
};

export default ReferralPage;

