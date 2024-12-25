/*const levels = {
    0: { SugD: 0.24, days: 1 }, // 0.01 لكل ساعة في اليوم
    1: { SugD: 0.48, days: 1 }, // 0.02 لكل ساعة في اليوم
    2: { SugD: 0.72, days: 1 }, // 0.03 لكل ساعة في اليوم
    3: { SugD: 2.4, days: 2 },  // 0.1 لكل ساعة لمدة يومين
  };*/
  interface Level {
    SugD: number;
    duration: number;
    isDurationInHours: boolean;
  }
  
  export const levels: { [key: number]: Level } = {
    0: { SugD: 0.05, duration: 1, isDurationInHours: true },  // Level 0 = 1 minute
    1: { SugD: 1, duration: 7, isDurationInHours: true },   // Level 1 = 5 hours
    2: { SugD: 2, duration: 10, isDurationInHours: true },  // Level 2 = 10 hours
    3: { SugD: 3, duration: 30, isDurationInHours: true },  // Level 3 = 30 hours
  };
  
  
