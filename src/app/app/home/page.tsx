import { Suspense } from "react";
import HomeClient from "@/components/app/HomeClient";

export default function HomePage() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
