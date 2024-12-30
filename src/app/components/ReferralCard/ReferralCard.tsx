import { useEffect, useState, memo, useCallback, useMemo } from "react";
import Image from "next/image";
import db from "../../../lib/db";

interface ReferralCardProps {
  onSetUserId?: (userId: string) => void;
}

interface UserData {
  id: string;
  username: string;
}

interface TelegramData {
  id: number;
  username: string;
}

const ReferralCard = memo(({ onSetUserId }: ReferralCardProps) => {
  const [telegramData, setTelegramData] = useState<TelegramData | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  const INVITE_URL = "https://t.me/SugarD_Bot/SugarApp";
  const sets = useMemo(() => ["set1", "set2", "set3", "set4"], []);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  const generateReferralCode = (userId: string): string => `REF-${userId}`;

  const syncWithIndexedDB = useCallback(async (userData: UserData) => {
    const storedUser = await db.table("users").get(userData.id);
    if (storedUser) {
      console.log("User data already synced with IndexedDB.");
      return;
    }

    try {
      await db.table("users").put({
        user_id: userData.id,
        username: userData.username,
        referralCode: generateReferralCode(userData.id),
      });
      console.log("User data synced with IndexedDB.");
    } catch (error) {
      console.error("Failed to sync with IndexedDB:", error);
    }
  }, []);

  const checkTelegramWebApp = useCallback(
    async (retries = 3) => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        const rawUserData = tg.initDataUnsafe?.user;

        if (rawUserData && !hasCheckedUser) {
          const userData: UserData = {
            id: rawUserData.id.toString(),
            username: rawUserData.username || '',
          };
          setTelegramData({
            id: rawUserData.id,
            username: rawUserData.username || '',
          });
          const referralCode = generateReferralCode(userData.id);
          setInviteLink(`${INVITE_URL}?startapp=${referralCode}`);
          setSelectedSet(sets[Math.floor(Math.random() * sets.length)]);
          await syncWithIndexedDB(userData);
          setHasCheckedUser(true);
          if (onSetUserId) {
            onSetUserId(userData.id);
          }
        }
      } else if (retries > 0) {
        setTimeout(() => checkTelegramWebApp(retries - 1), 500);
      }
    },
    [hasCheckedUser, syncWithIndexedDB, onSetUserId, sets]
  );

  useEffect(() => {
    if (!hasCheckedUser) {
      checkTelegramWebApp();
    }
  }, [hasCheckedUser, checkTelegramWebApp]);

  const handleInviteFriend = useCallback(() => {
    if (!inviteLink) return;

    const shareText = `Join me on this amazing Telegram app!`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(
      inviteLink
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(fullUrl, "_blank");
  }, [inviteLink]);

  const handleCopyLink = useCallback(() => {
    if (!inviteLink) return;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => alert("Invite link copied to clipboard!"))
      .catch(() => {});
  }, [inviteLink]);

  if (!telegramData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start text-center h-full pt-0 mt-0 overflow-hidden">
      <div className="flex flex-col items-center mt-0 space-y-2">
        {telegramData.username && (
          <>
            <Image
              src={`https://robohash.org/${telegramData.username}?set=${selectedSet || 'set1'}&size=200x200`}
              className="user-photo h-24 w-24 mb-1"
              alt="User RoboHash"
              width={200}
              height={200}
            />
            <h2 className="text-lg font-mono text-cyan-400">
              {telegramData.username}
            </h2>
          </>
        )}
      </div>
      <div className="button-container w-full flex flex-col space-y-2 mt-2">
        <button
          onClick={handleInviteFriend}
          className="w-full bg-cyan-900 text-cyan-400 font-mono py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
          disabled={!inviteLink}
        >
          Invite Friend
        </button>
        <button
          onClick={handleCopyLink}
          className="w-full bg-cyan-900 text-cyan-400 font-mono py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
          disabled={!inviteLink}
        >
          Copy Invite Link
        </button>
      </div>
    </div>
  );
});

ReferralCard.displayName = "ReferralCard";

export default ReferralCard;

