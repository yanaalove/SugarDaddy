"use client"

import React, { useState, useEffect } from 'react';
import { Youtube, Twitter, Music } from 'lucide-react';
import { getUserTasks, updateUserTasks, addCompletedTask, updatePoints } from '../../../lib/db';

interface Task {
  id: string;
  type: 'youtube' | 'twitter' | 'tiktok';
  link: string;
  code?: string;
  requiresInput: boolean;
  completed: boolean;
}

interface SocialTasksProps {
  userId: string | null;
}

const initialTasks: Task[] = [
  { id: '1', type: 'youtube', link: 'https://youtu.be/b8kj0k8vv4Q?si=nIQvdyH0eD3m6XOx', code: 'codelazyminer', requiresInput: true, completed: false },
  { id: '2', type: 'youtube', link: 'https://youtu.be/ePfF3pjMwdg?si=PQAvopgR7mtzd7AM', code: 'playsmarttoearnbiginthefuture', requiresInput: true, completed: false },
  { id: '3', type: 'youtube', link: 'https://www.youtube.com/@LazycryptoTalks', requiresInput: false, completed: false },
  { id: '4', type: 'twitter', link: 'https://x.com/SugdLazy', requiresInput: false, completed: false },
  { id: '5', type: 'tiktok', link: 'https://www.tiktok.com/@sing_with_sugd?_t=8rzHJECHrlZ&_r=1', requiresInput: false, completed: false },
  { id: '6', type: 'tiktok', link: 'https://vt.tiktok.com/ZSjTAbT7h/', code: 'mood', requiresInput: true, completed: false },
  { id: '7', type: 'tiktok', link: 'https://vt.tiktok.com/ZSjTAynxP/', code: 'lonely', requiresInput: true, completed: false },
  { id: '8', type: 'tiktok', link: 'https://vt.tiktok.com/ZSjTACqnx/', code: 'until i found you', requiresInput: true, completed: false },
  { id: '9', type: 'tiktok', link: 'https://vt.tiktok.com/ZSjTArjmC/', code: 'let her go', requiresInput: true, completed: false },
  { id: '10', type: 'tiktok', link: 'https://vt.tiktok.com/ZSjTA4WDE/', code: 'somewhere only we know', requiresInput: true, completed: false },
];

const SocialTasks: React.FC<SocialTasksProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          await initializeUserTasks(userId);
          const userTasks = await getUserTasks(userId);
          if (userTasks) {
            setTasks(userTasks);
          } else {
            console.log("No tasks found for user, using initial tasks");
            setTasks(initialTasks);
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setTasks(initialTasks);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();
  }, [userId]);

  const initializeUserTasks = async (userId: string) => {
    try {
      const existingTasks = await getUserTasks(userId);
      if (!existingTasks) {
        await updateUserTasks(userId, initialTasks);
        console.log("Initialized tasks for user", userId);
      } else {
        console.log("Tasks already exist for user", userId);
      }

      // Sync with server
      try {
        const response = await fetch(`/api/task?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        
        const { completedTasks } = await response.json();
        const completedTaskIds = completedTasks ? completedTasks.split('-') : [];
        const updatedTasks = initialTasks.map(task => ({
          ...task,
          completed: completedTaskIds.includes(task.id),
        }));
        await updateUserTasks(userId, updatedTasks);
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Failed to sync tasks with server:", error);
      }
    } catch (error) {
      console.error("Failed to initialize user tasks", error);
      throw error;
    }
  };

  const handleTaskClick = (task: Task) => {
    if (!task.completed) {
      setCurrentTask(task);
      window.open(task.link, '_blank');

      if (!task.requiresInput) {
        completeTaskHandler(task);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const normalizeString = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const completeTaskHandler = async (task: Task) => {
    if (userId) {
      try {
        await addCompletedTask(userId, task.id);
        await updatePoints(userId, 1);

        const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, completed: true } : t);
        setTasks(updatedTasks);
        await updateUserTasks(userId, updatedTasks);
        setCurrentTask(null);
        setUserInput('');

        // Sync with server
        try {
          const response = await fetch('/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, taskId: task.id }),
          });
          if (!response.ok) {
            throw new Error('Failed to sync task completion with server');
          }
        } catch (error) {
          console.error("Failed to sync task completion with server:", error);
        }

        alert('تم إكمال المهمة بنجاح!');
      } catch (error) {
        console.error('Failed to complete task:', error);
        alert('حدث خطأ أثناء إكمال المهمة. يرجى المحاولة مرة أخرى لاحقًا.');
      }
    }
  };

  const handleSubmit = () => {
    if (currentTask && currentTask.code) {
      const normalizedInput = normalizeString(userInput);
      const normalizedCode = normalizeString(currentTask.code);

      if (normalizedInput === normalizedCode) {
        completeTaskHandler(currentTask);
      } else {
        alert('الرمز غير صحيح. يرجى المحاولة مرة أخرى.');
      }
    } else {
      alert('لم يتم تحديد مهمة أو الرمز غير متوفر.');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-6 w-6 text-red-500" />;
      case 'twitter':
        return <Twitter className="h-6 w-6 text-blue-400" />;
      case 'tiktok':
        return <Music className="h-6 w-6 text-black" />;
      default:
        return null;
    }
  };

  const getTaskDescription = (task: Task) => {
    switch (task.type) {
      case 'youtube':
        return task.requiresInput ? 'مشاهدة الفيديو وإدخال الرمز' : 'الاشتراك في القناة';
      case 'twitter':
        return 'متابعة الحساب';
      case 'tiktok':
        return task.requiresInput ? 'مشاهدة الفيديو وإدخال اسم الأغنية' : 'متابعة الحساب';
      default:
        return 'إكمال المهمة';
    }
  };

  if (isLoading) {
    return <div>جاري تحميل المهام...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">المهام الاجتماعية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`p-4 border rounded-lg cursor-pointer ${task.completed ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            onClick={() => !task.completed && handleTaskClick(task)}
          >
            <div className="flex items-center">
              {getIcon(task.type)}
              <span className="ml-2 text-gray-700">{getTaskDescription(task)}</span>
              {task.completed && <span className="ml-auto text-green-500">تم الإكمال</span>}
            </div>
          </div>
        ))}
      </div>
      {currentTask && currentTask.requiresInput && !currentTask.completed && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {currentTask.type === 'tiktok' ? 'أدخل اسم الأغنية:' : 'أدخل الرمز الخاص بالمهمة:'}
          </h3>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="border p-2 rounded-lg mr-2 text-gray-700"
            placeholder={currentTask.type === 'tiktok' ? 'أدخل اسم الأغنية هنا' : 'أدخل الرمز هنا'}
            dir="auto"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            تحقق
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialTasks;

