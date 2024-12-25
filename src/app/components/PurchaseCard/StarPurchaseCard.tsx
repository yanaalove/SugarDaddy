import React, { useState, useEffect, memo } from "react";
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Loader2 } from "lucide-react";
import { beginCell, toNano, Address } from "@ton/core";
import Eyes from "./Eyes";
import {
  updateLevelInIndexedDB,
  getLevelFromIndexedDB,
} from "../../../lib/db";

interface StarPurchaseCardProps {
  userId: string | null;
}

const StarPurchaseCard: React.FC<StarPurchaseCardProps> = memo(
  ({ userId }) => {
    const levels = [
      { id: 1, title: "LV1", sugD: 1, hours: 7, price: 2.5, percentage: "30%" },
      { id: 2, title: "LV2", sugD: 2, hours: 10, price: 5, percentage: "50%" },
      { id: 3, title: "LV3", sugD: 3, hours: 30, price: 20, percentage: "100%" },
    ];

    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const [purchasedLevel, setPurchasedLevel] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const checkPurchasedLevel = async () => {
        const storedLevel = await getLevelFromIndexedDB(userId);
        if (storedLevel) {
          setPurchasedLevel(storedLevel);
        } else {
          const levelFromStorage = localStorage.getItem("purchasedLevel");
          if (levelFromStorage) {
            setPurchasedLevel(parseInt(levelFromStorage));
          }
        }
      };
      if (userId) {
        checkPurchasedLevel();
      }
    }, [userId]);

    const createTransactionPayload = (level) => {
      const body = beginCell()
        .storeUint(0x12345678, 32)
        .storeUint(level.id, 8)
        .storeRef(
          beginCell()
            .storeBuffer(Buffer.from(`Purchase Level ${level.id}`))
            .endCell()
        )
        .endCell();

      return body.toBoc().toString("base64");
    };

    const sendTransaction = async (level) => {
      if (!wallet) {
        setError("Please connect your wallet first.");
        return;
      }
      if (!userId) {
        setError("Please log in first.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (purchasedLevel && purchasedLevel >= level.id) {
          setError("You have already purchased this level.");
          return;
        }

        const contractAddress = Address.parse(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "");
        const payload = createTransactionPayload(level);

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [
            {
              address: contractAddress.toString(),
              amount: toNano(level.price).toString(),
              payload,
              bounce: false,
            },
          ],
        };

        const result = await tonConnectUI.sendTransaction(transaction);

        if (result) {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await updateLevelInIndexedDB(userId, level.id);
          setPurchasedLevel(level.id);
          localStorage.setItem("purchasedLevel", level.id.toString());
          window.dispatchEvent(new Event("levelUpdated"));
        }
      } catch (error) {
        console.error("Transaction error:", error);
        setError("Transaction failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex flex-col items-center p-2 max-w-xs mx-auto">
        <div className="mb-0" style={{ transform: "translateY(-20px)" }}>
          <Eyes />
        </div>

        <TonConnectButton className="mb-1" />

        <div className="text-sm  font-mono text-green-500 mt-2">
  We support payments with <span className="font-bold">Tonkeeper</span>!
</div>



        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <div className="w-full">
          {levels.map((level) => (
            <div key={level.id} className="flex flex-col items-start w-full mb-4">
              <div className="text-cyan-400 font-mono mb-2 flex items-center justify-between w-full">
                <div>
                  {level.title}: {level.sugD}:sugD/H | {level.hours}:Hours | {level.price} TON
                </div>
                <div className="text-sm text-green-500">
                  Earns: {level.percentage} of mined points
                </div>
              </div>

              <button
                className={`w-full py-2 px-4 rounded-md text-white text-xs ${
                  purchasedLevel && purchasedLevel >= level.id
                    ? "bg-green-500 cursor-not-allowed"
                    : loading
                    ? "bg-blue-500/50 cursor-wait"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={(purchasedLevel && purchasedLevel >= level.id) || loading}
                onClick={() => sendTransaction(level)}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-1" size={14} />
                ) : purchasedLevel && purchasedLevel >= level.id ? (
                  "Purchased ✓"
                ) : (
                  "Purchase Now"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

StarPurchaseCard.displayName = "StarPurchaseCard";
export default StarPurchaseCard;
