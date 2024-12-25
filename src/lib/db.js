import Dexie from "dexie";

const db = new Dexie("UserDatabase");
db.version(1).stores({
  users: "user_id, username, referralCode, lastSyncTimestamp",
  points: "++id, user_id, balance, timestamp",
  levels: "user_id, level",
  completedTasks: "user_id, tasks"
});

const ensureDbReady = async () => {
  if (!db.isOpen()) {
    await db.open();
  }
};

export const getUserTasks = async (userId) => {
  await ensureDbReady();
  try {
    const userTasks = await db.completedTasks.get(userId);
    console.log("Retrieved tasks for user", userId, ":", userTasks);
    return userTasks ? userTasks.tasks : null;
  } catch (error) {
    console.error("Failed to retrieve tasks for user", userId, ":", error);
    return null;
  }
};

export const updateUserTasks = async (userId, tasks) => {
  await ensureDbReady();
  try {
    await db.completedTasks.put({ user_id: userId, tasks });
    console.log("Tasks updated for user", userId, ":", tasks);
  } catch (error) {
    console.error("Failed to update tasks for user", userId, ":", error);
    throw error;
  }
};

export const addCompletedTask = async (userId, taskId) => {
  await ensureDbReady();
  try {
    const userTasks = await getUserTasks(userId) || [];
    const updatedTasks = userTasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    await updateUserTasks(userId, updatedTasks);
    console.log("Task completed for user", userId, ":", taskId);
  } catch (error) {
    console.error("Failed to add completed task for user", userId, ":", error);
    throw error;
  }
};

export const updatePoints = async (userId, points) => {
  await ensureDbReady();
  try {
    await db.points.add({
      user_id: userId,
      balance: points,
      timestamp: new Date(),
    });
    console.log("Points updated for user", userId, ":", points);

    // Sync with server
    try {
      const response = await fetch('/api/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, points }),
      });
      if (!response.ok) {
        throw new Error('Failed to sync points with server');
      }
      const result = await response.json();
      console.log("Points synced with server:", result);
    } catch (error) {
      console.error("Failed to sync points with server:", error);
    }
  } catch (error) {
    console.error("Failed to update points for user", userId, ":", error);
    throw error;
  }
};




const SYNC_INTERVAL = 60 * 60 * 1000; // كل ساعة

// وظيفة التزامن مع الخادم
async function syncWithServer(userId) {
  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to sync with server');

    const serverData = await response.json();
    const existingBalance = await db.points.where("user_id").equals(userId).first();

    // حذف البيانات القديمة إذا كانت غير متزامنة
    if (!existingBalance || existingBalance.balance !== serverData.totalPoints) {
      await db.transaction('rw', db.users, db.points, db.levels, async () => {
        // حذف النقاط القديمة
        await db.points.where("user_id").equals(userId).delete();

        // تحديث البيانات
        await db.users.put({
          user_id: userId,
          username: serverData.username,
          referralCode: serverData.referralCode,
          lastSyncTimestamp: Date.now(),
        });

        await db.points.put({
          user_id: userId,
          balance: serverData.totalPoints,
          timestamp: new Date(),
        });

        await db.levels.put({
          user_id: userId,
          level: serverData.purchasedLevel,
        });
      });

      console.log("Synced with server successfully and fixed inconsistencies.");
    }
  } catch (error) {
    console.error("Failed to sync with server:", error);
  }
}

// تحديث النقاط في IndexedDB بعد التعدين
export const updateBalanceInIndexedDB = async (userId, points) => {
  try {
    const currentBalance = await getBalanceFromIndexedDB(userId);

    // التحقق من التزامن قبل التحديث
    await syncWithServer(userId);

    const newBalance = currentBalance + points;

    await db.points.put({
      user_id: userId,
      balance: newBalance,
      timestamp: new Date(),
    });

    console.log("Balance updated successfully:", newBalance);
    return newBalance;
  } catch (error) {
    console.error("Failed to update balance:", error);
    throw error;
  }
};

// جلب النقاط من IndexedDB
export const getBalanceFromIndexedDB = async (userId) => {
  try {
    const user = await db.users.get(userId);

    // تحقق من المزامنة مع الخادم
    if (!user || Date.now() - (user.lastSyncTimestamp || 0) > SYNC_INTERVAL) {
      await syncWithServer(userId);
    }

    const userBalance = await db.points.where("user_id").equals(userId).first();
    return userBalance ? userBalance.balance : 0;
  } catch (error) {
    console.error("Failed to retrieve balance:", error);
    return 0;
  }
};

  

export const updateLevelInIndexedDB = async (userId, level) => {
  try {
    await db.levels.put({ user_id: userId, level });
    console.log("Level updated successfully:", level);
  } catch (error) {
    console.error("Failed to update level:", error);
    throw error;
  }
};

export const getLevelFromIndexedDB = async (userId) => {
  try {
    const user = await db.users.get(userId);
    if (!user || Date.now() - (user.lastSyncTimestamp || 0) > SYNC_INTERVAL) {
      await syncWithServer(userId);
    }
    
    const userLevel = await db.levels.where("user_id").equals(userId).first();
    return userLevel ? userLevel.level : 0;
  } catch (error) {
    console.error("Failed to retrieve level:", error);
    return 0;
  }
};

  
export default db;