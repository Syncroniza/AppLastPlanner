// date.d.ts (puedes crear este archivo en `src/types/date.d.ts`)
declare global {
    interface Date {
      getWeek(): number;
    }
  }
  
  export {};