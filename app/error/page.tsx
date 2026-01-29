"use client";

import { Suspense } from "react";
import ErrorPage from "./ErrorClient";

import { LoadingOverlay } from "@mantine/core";
export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay visible />}>
      <ErrorPage />
    </Suspense>
  );
}
