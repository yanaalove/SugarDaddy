"use client";
import React, { useState, lazy, Suspense } from "react";
import "./CardContainer.css"; // Import CSS

// Lazily import the card components
const MiningCard = lazy(() => import("../MiningCard/MiningCard"));
const StarPurchaseCard = lazy(() => import("../PurchaseCard/StarPurchaseCard"));
const ReferralCard = lazy(() => import("../ReferralCard/ReferralCard"));
const YouTubeCard = lazy(() => import("../SocialMedia/YouTubeCard"));
const TikTokCard = lazy(() => import("../SocialMedia/TikTokCard"));

const CardContainer: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const handleSetUserId = (id: string) => {
    if (id) {
      setUserId(id); // Update userId when obtained from ReferralCard
    }
  };

  return (
    <div className="track">
      <ul>
        <li id="one">
          <article>
            <div className="scrollbox">
              <Suspense fallback={<div>Loading Mining Card...</div>}>
                <MiningCard userId={userId} />
              </Suspense>
            </div>
          </article>
        </li>
        <li id="two">
          <article>
            <div className="scrollbox">
              <Suspense fallback={<div>Loading Star Purchase Card...</div>}>
                <StarPurchaseCard userId={userId} />
              </Suspense>
            </div>
          </article>
        </li>
        <li id="three">
          <article>
            <div className="scrollbox">
              <Suspense fallback={<div>Loading Referral Card...</div>}>
                <ReferralCard onSetUserId={handleSetUserId} />
              </Suspense>
            </div>
          </article>
        </li>
        <li id="four">
          <article>
            <div className="scrollbox">
              <Suspense fallback={<div>Loading YouTube Card...</div>}>
                <YouTubeCard />
              </Suspense>
            </div>
          </article>
        </li>
        <li id="five">
          <article>
            <div className="scrollbox">
              <Suspense fallback={<div>Loading TikTok Card...</div>}>
                <TikTokCard />
              </Suspense>
            </div>
          </article>
        </li>
      </ul>
      <div className="track__indicators" aria-hidden="true">
        <a href="#one" className="indicator"></a>
        <a href="#two" className="indicator"></a>
        <a href="#three" className="indicator"></a>
        <a href="#four" className="indicator"></a>
        <a href="#five" className="indicator"></a>
      </div>
    </div>
  );
};

export default CardContainer;
