import { type ChangeEvent, useEffect, useState } from "react";
import Home, { type UserType } from "./Home";
import { fetchData, POSTS_URL } from "./fetchData";

// Osa 2.1 (useState) ja 2.2 (useEffect)
export default function EffectFetcher() {
  // 2.1: State on komponentin muisti. Kun setId kutsutaan, React
  // renderöi komponentin uudelleen uudella arvolla – ilman sivun latausta.
  const [id, setId] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  // 2.2: useEffect ajetaan renderöinnin JÄLKEEN. Riippuvuuslista [id]
  // tarkoittaa, että data haetaan uudelleen aina kun id muuttuu.
  useEffect(() => {
    let ignore = false; // estää vanhan, myöhässä saapuvan vastauksen
    fetchData(`${POSTS_URL}${id}`).then((result) => {
      if (!ignore) {
        setUsers(result); // state päivittyy -> uusi renderöinti
      }
    });
    return () => {
      ignore = true; // cleanup ajetaan ennen seuraavaa efektiä
    };
  }, [id]);

  return (
    <div>
      <label htmlFor="effect-id">Hae id: </label>
      <input id="effect-id" value={id} onChange={onChange} />
      <p>
        State <code>id</code> = "{id}" ({users.length} tulosta)
      </p>
      <Home users={users} />
    </div>
  );
}

