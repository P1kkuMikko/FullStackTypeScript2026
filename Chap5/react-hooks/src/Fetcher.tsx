import { use } from "react";
import Home, { type UserType } from "./Home";

interface FetcherProps {
  fetchPromise: Promise<UserType[]>;
}

// Osa 3: use() "odottaa" promisen. Niin kauan kuin promise on kesken,
// komponentti keskeyttää (suspend) renderöinnin ja lähin <Suspense>
// näyttää fallback-sisällön.
export default function Fetcher({ fetchPromise }: FetcherProps) {
  const users = use(fetchPromise);

  return <Home users={users} />;
}

