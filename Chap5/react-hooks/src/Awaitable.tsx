import { Suspense } from "react";
import Fetcher from "./Fetcher";
import type { UserType } from "./Home";

interface AwaitableProps {
  fetchPromise?: Promise<UserType[]>;
}

// Osa 3: Suspense näyttää fallbackin, kunnes lapsikomponentin data on valmis.
export default function Awaitable({ fetchPromise }: AwaitableProps) {
  return (
    <Suspense fallback={<div>Loading users ...</div>}>
      {fetchPromise ? <Fetcher fetchPromise={fetchPromise} /> : null}
    </Suspense>
  );
}

