"use client"
import React, { useState, lazy, Suspense } from "react";
import MiningCard from '../components/MiningCard/MiningCard';  // Corrected path

const MiningPage: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);

  // In a real application, you would get the userId from your authentication system
  const handleSetUserId = (id: string) => {
    if (id) {
      setUserId(id); // Update userId when obtained from ReferralCard
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 pb-20">
    <div
      className="absolute"
      style={{
        top: '22%', // Adjust for vertical position
        left: '14cm', // Move 7cm to the right
      }}
    >
      <MiningCard userId={userId} />
    </div>
  </div>
  
  
  );
};

export default MiningPage;

