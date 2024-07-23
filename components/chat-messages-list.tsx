"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { saveMessage } from "@/app/chats/actions";

const SUPABASE_PUBKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldHZkb2Rid2FqcmZjaGt2YnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2Mjg0NjcsImV4cCI6MjAzNzIwNDQ2N30.l2HegTGLDcU35Wc_g6ppvllVQEd56QqmqYuX1q1BD2o";
const SUPABASE_URL = "https://detvdodbwajrfchkvbpa.supabase.co";

interface ChatMessagesListProps {
  chatRoomId: string;
  userId: number;
  initialMessages: InitialChatMessages;
  username: string;
  avatar: string;
}

export default function ChatMessagesList({
  chatRoomId,
  userId,
  initialMessages,
  username,
  avatar,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: { username: "no need", avatar: "anything" },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: { username, avatar },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBKEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on(
        "broadcast",
        {
          event: "message",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.payload]);
        }
      )
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => {
        const itsMe = message.userId === userId;

        return (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${itsMe && "justify-end"}`}
          >
            {!itsMe && (
              <Image
                src={message.user.avatar!}
                alt={message.user.username}
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
            )}
            <div className={`flex flex-col gap-1 ${itsMe && "items-end"}`}>
              <span
                className={`${
                  itsMe ? "bg-neutral-500" : "bg-orange-500"
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_at.toString())}
              </span>
            </div>
          </div>
        );
      })}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
