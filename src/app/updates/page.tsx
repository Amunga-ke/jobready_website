"use client";

import { Suspense } from "react";
import UpdatesFeed from "./UpdatesFeed";

export default function UpdatesPage() {
  return (
    <Suspense>
      <UpdatesFeed />
    </Suspense>
  );
}
