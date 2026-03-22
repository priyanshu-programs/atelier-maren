"use client";

import dynamic from "next/dynamic";

const FollowCursor = dynamic(() => import("@/components/ui/FollowCursor"), {
  ssr: false,
});

export default function DeferredCursor() {
  return <FollowCursor color="#FAF8F5" zIndex={9999} />;
}
