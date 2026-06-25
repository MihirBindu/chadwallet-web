"use client";

import { useRouter } from "next/navigation";

export default function ScreenHeader({
  title,
  avatarLetter,
  right,
}: {
  title: string;
  avatarLetter?: string;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto w-full">
      <button onClick={() => router.back()} className="text-xl px-1" aria-label="Back">
        ←
      </button>
      <div className="flex items-center gap-2 font-bold">
        {avatarLetter && (
          <span className="h-7 w-7 rounded-full bg-cw-panel-2 flex items-center justify-center text-xs text-cw-green">
            {avatarLetter}
          </span>
        )}
        {title}
      </div>
      <div className="flex items-center gap-3 text-lg min-w-[40px] justify-end">{right}</div>
    </div>
  );
}
