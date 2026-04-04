import { StatProps } from "@/types";

export default function StatCircle({
  value,
  label,
  active = false,
}: StatProps) {
  return (
    <div
      className={`border-2 rounded-full w-24 h-24 flex flex-col justify-center items-center transition-colors ${
        active ? "border-green-500" : "border-gray-800"
      }`}
    >
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-[10px] uppercase text-gray-400 tracking-wider">
        {label}
      </span>
    </div>
  );
}
