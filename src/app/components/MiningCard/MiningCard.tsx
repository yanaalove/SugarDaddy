import React, { useEffect, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Bike from '../Bike/Bike'
import { levels,  Level  } from '../../../lib/levels'
import {
  updateBalanceInIndexedDB,
  getBalanceFromIndexedDB,
  updateLevelInIndexedDB,
  getLevelFromIndexedDB,
} from '../../../lib/db'
import { RootState } from '../../../store/store'
import { 
    startSession, 
    updateTimeLeft, 
    endSession, 
    updateBalance, 
    setUserLevel,
    collectPoints,
    loadSessionFromStorage
} from '../../../store/miningSlice'

interface MiningCardProps {
  userId: string | null
}

const MiningCard: React.FC<MiningCardProps> = memo(({ userId }) => {
    const dispatch = useDispatch()
    const { sessionActive, timeLeft, startTimeUTC, balance, userLevel, sessionCompleted, pointsToCollect } = useSelector((state: RootState) => state.mining)
  
    const updateUTCTime = useCallback(() => {
      return new Date().toUTCString()
    }, [])
  
    const [currentUTC, setCurrentUTC] = React.useState(updateUTCTime())
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentUTC(updateUTCTime())
      }, 1000)
  
      return () => clearInterval(timer)
    }, [updateUTCTime])
  
    useEffect(() => {
      if (userId) {
        const fetchBalanceAndLevel = async () => {
          const fetchedBalance = await getBalanceFromIndexedDB(userId)
          const fetchedLevel = await getLevelFromIndexedDB(userId) || 0
          dispatch(updateBalance(fetchedBalance))
          dispatch(setUserLevel(fetchedLevel))
        }
        fetchBalanceAndLevel()
      }
  
      const storedSession = localStorage.getItem('miningSession')
      if (storedSession) {
        const sessionData = JSON.parse(storedSession)
        dispatch(loadSessionFromStorage(sessionData))
  
        if (sessionData.sessionActive && sessionData.timeLeft && sessionData.startTimeUTC) {
          const elapsed = Math.floor((Date.now() - new Date(sessionData.startTimeUTC).getTime()) / 1000)
          const remainingTime = sessionData.timeLeft - elapsed
  
          if (remainingTime > 0) {
            dispatch(updateTimeLeft(remainingTime))
          } else {
            dispatch(endSession())
          }
        }
      }
    }, [userId, dispatch])
  
    useEffect(() => {
      let timer: NodeJS.Timeout
      if (sessionActive && timeLeft !== null && timeLeft > 0) {
        timer = setInterval(() => {
          dispatch(updateTimeLeft(timeLeft - 1))
        }, 1000)
      } else if (timeLeft === 0) {
        dispatch(endSession())
      }
  
      return () => {
        if (timer) clearInterval(timer)
      }
    }, [sessionActive, timeLeft, dispatch])
  
    useEffect(() => {
      if (sessionActive || sessionCompleted) {
        localStorage.setItem('miningSession', JSON.stringify({
          sessionActive,
          timeLeft,
          startTimeUTC,
          balance,
          userLevel,
          sessionCompleted,
          pointsToCollect
        }))
      }
    }, [sessionActive, timeLeft, startTimeUTC, balance, userLevel, sessionCompleted, pointsToCollect])
    
    const handleStartSession = () => {
        if (!userId) {
          alert('Please log in to start mining.')
          return
        }
        const level: Level = levels[userLevel]
        const sessionDuration = level.isDurationInHours ? level.duration * 3600 : level.duration * 60
        const startTime = new Date().toUTCString()
  
        dispatch(startSession({ duration: sessionDuration, startTime }))
      }
  
    const handleCollectPoints = async () => {
        console.log("User ID:", userId);
        console.log("Points to Collect:", pointsToCollect);
    
        if (!userId) {
            alert('Please log in to collect points.');
            return;
        }
    
        if (pointsToCollect > 0) {
            try {
                // طلب مزامنة النقاط مع الخادم
                const response = await fetch('/api/mining', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, points: pointsToCollect }),
                });
    
                if (!response.ok) throw new Error('Failed to sync points with server.');
    
                const data = await response.json();
                console.log('Response Data:', data);
    
                // تحديث النقاط محلياً
                await updateBalanceInIndexedDB(userId, data.newBalance);
                const syncedBalance = await getBalanceFromIndexedDB(userId);
    
                // تحديث الحالة على الواجهة
                dispatch(updateBalance(syncedBalance));
                dispatch(collectPoints());
                localStorage.removeItem('miningSession');
    
                alert(`Successfully collected ${pointsToCollect} points!`);
            } catch (error) {
                console.error('Error collecting points:', error);
                alert('Failed to collect points. Please try again.');
            }
        } else {
            alert('No points to collect.');
        }
    };
    
      
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    }
  
    return (
      <div className="mining-card flex flex-col items-center p-0 rounded-lg shadow-lg">
        <div className="level-and-balance flex justify-between items-center w-full mb-6">
          <div className="level text-cyan-400 font-mono text-lg">
            LV:{userLevel}
          </div>
          {sessionActive && timeLeft !== null && (
            <div className="time-left text-cyan-400 font-mono text-lg">
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
  
        <div className="level-and-balance flex justify-between will-change-transform mb-1">
          <div className="balance text-cyan-300 font-mono text-lg">
            Balance: {balance.toFixed(2)}
          </div>
        </div>
  
        <div className="time-container flex justify-between w-full mb-1">
          <div className="utc-time text-green-500 text-sm">
            {currentUTC}
          </div>
        </div>
  
        {sessionActive && <Bike />}
  
        {sessionActive ? (
          <div>
            {/* Countdown time is shown above the bike */}
          </div>
        ) : sessionCompleted ? (
            <button
            onClick={handleCollectPoints}
            className={`w-full py-2 rounded ${pointsToCollect === 0 ? 'bg-gray-500' : 'bg-green-700 hover:bg-green-800'}`}
            disabled={pointsToCollect === 0}
          >
            Collect {pointsToCollect} points
          </button>
          
        ) : (
          <button
            onClick={handleStartSession}
            className="w-full bg-cyan-900 text-cyan-400 py-2 rounded hover:bg-blue-700"
          >
            Start Mining
          </button>
        )}
      </div>
    )
})
MiningCard.displayName = 'MiningCard'

  
export default MiningCard

