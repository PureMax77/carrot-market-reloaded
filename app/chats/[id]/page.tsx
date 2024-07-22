import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    // 사용자가 방에 참여자인지 확인
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

export default async function ChatRoom({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const room = await getRoom(params.id);
  if (!room) return notFound();

  return <h1>Chat!</h1>;
}
