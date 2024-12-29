/*const levels = {
    0: { SugD: 0.24, days: 1 }, // 0.01 لكل ساعة في اليوم
    1: { SugD: 0.48, days: 1 }, // 0.02 لكل ساعة في اليوم
    2: { SugD: 0.72, days: 1 }, // 0.03 لكل ساعة في اليوم
    3: { SugD: 2.4, days: 2 },  // 0.1 لكل ساعة لمدة يومين
  };*/
  
  export interface Level {
  id: number;
  title: string;
  SugD: number;
  hours: number;
  price: number;
  percentage: string;
  duration: number;
  isDurationInHours: boolean;
}

export const levels: { [key: number]: Level } = {
  0: { id: 0, title: "LV0", SugD: 0.05, hours: 1, price: 0, percentage: "10%", duration: 1, isDurationInHours: true },
  1: { id: 1, title: "LV1", SugD: 1, hours: 7, price: 1.5, percentage: "30%", duration: 7, isDurationInHours: true },
  2: { id: 2, title: "LV2", SugD: 2, hours: 10, price: 5, percentage: "50%", duration: 10, isDurationInHours: true },
  3: { id: 3, title: "LV3", SugD: 3, hours: 30, price: 20, percentage: "100%", duration: 30, isDurationInHours: true },
};


  
