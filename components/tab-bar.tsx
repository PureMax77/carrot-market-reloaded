"use client";

import Link from "next/link";
import {
  HomeIcon as SolidHome,
  NewspaperIcon as SolidNewspaper,
  ChatBubbleOvalLeftEllipsisIcon as SolidChat,
  VideoCameraIcon as SolidVideo,
  UserIcon as SolidUser,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHome,
  NewspaperIcon as OutlineNewspaper,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChat,
  VideoCameraIcon as OutlineVideo,
  UserIcon as OutlineUser,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 bg-neutral-800 *:text-white">
      <Link href="/home" className="flex flex-col items-center gap-px">
        {pathname === "/home" ? (
          <SolidHome className="w-7 h-7" />
        ) : (
          <OutlineHome className="w-7 h-7" />
        )}
        <span>홈</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === "/life" ? (
          <SolidNewspaper className="w-7 h-7" />
        ) : (
          <OutlineNewspaper className="w-7 h-7" />
        )}
        <span>동네생활</span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center gap-px">
        {pathname === "/chat" ? (
          <SolidChat className="w-7 h-7" />
        ) : (
          <OutlineChat className="w-7 h-7" />
        )}
        <span>채팅</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-px">
        {pathname === "/live" ? (
          <SolidVideo className="w-7 h-7" />
        ) : (
          <OutlineVideo className="w-7 h-7" />
        )}
        <span>쇼핑</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === "/profile" ? (
          <SolidUser className="w-7 h-7" />
        ) : (
          <OutlineUser className="w-7 h-7" />
        )}
        <span>나의 당근</span>
      </Link>
    </div>
  );
}
