"use client"
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Provider } from "react-redux"
import { store } from "../store/store"
import db from "../lib/db"

// Lazy load the MiningCard component
const MiningCard = dynamic(() => import("./components/MiningCard/MiningCard"), {
  ssr: false,
})

const MiningPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null)

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
    <Provider store={store}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 pb-20">
        <div className="w-full max-w-sm">
          <MiningCard userId={userId} />
        </div>
      </div>
    </Provider>
  )

}

export default MiningPage
