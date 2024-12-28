'use client';
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import db from "../../lib/db";

const StarPurchaseCard = dynamic(() => import('../components/PurchaseCard/StarPurchaseCard'), {
    ssr: false,
});

const Levels: React.FC = () => {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 pb-20">
            <div className="w-full max-w-sm">
                <StarPurchaseCard userId={userId} />
            </div>
        </div>
    );
};

export default Levels;

