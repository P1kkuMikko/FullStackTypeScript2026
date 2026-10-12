import { type ChangeEvent, useMemo, useState } from "react";
import Awaitable from "./Awaitable";
import { fetchData, POSTS_URL } from "./fetchData";

// Osa 3: sama haku kuin osassa 2.2, mutta ilman useEffectiä.
// Promise luodaan ja annetaan propsina Awaitable -> Fetcher -ketjulle.
export default function SuspenseFetcher() {
  const [id, setId] = useState("");

  // useMemo: uusi promise vain kun id muuttuu (ei jokaisella renderöinnillä).
  // 1 s viive, jotta "Loading users ..." näkyy selvästi.
  const usersPromise = useMemo(() => fetchData(`${POSTS_URL}${id}`, 1000), [id]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  return (
    <div>
      <label htmlFor="suspense-id">Hae id: </label>
      <input id="suspense-id" value={id} onChange={onChange} />
      <Awaitable fetchPromise={usersPromise} />
    </div>
  );
}

