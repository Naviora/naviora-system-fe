
import { CheckCircle2, Circle } from "lucide-react";
import Image from "next/image";

const DayCheckbox = ({ day, checked }: { day: string; checked: boolean }) => (
  <div className="flex flex-col items-center gap-1">
    {checked ? (
      <CheckCircle2 className="text-gray-900 dark:text-gray-400" />
    ) : (
      <Circle className="text-gray-300 dark:text-gray-600" />
    )}
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{day}</span>
  </div>
);

export const DayStreak = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const checkedDays = [true, true, true, true, false, false, false];

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 min-w-[300px]  w-full dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
            Day Streak
          </span>
          <span className="text-2xl font-medium text-gray-900 dark:text-gray-100">22 Day</span>
        </div>
        <Image
          src="/icons/day-streak-icon.svg"
          alt="Day streak icon"
          width={55}
          height={55}
          className="dark:brightness-90 dark:saturate-90"
        />
      </div>
      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
        <div className="flex justify-between">
          {days.map((day, index) => (
            <DayCheckbox key={index} day={day} checked={checkedDays[index]} />
          ))}
        </div>
      </div>
    </div>
  );
};
