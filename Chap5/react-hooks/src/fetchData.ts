import type { UserType } from "./Home";

export const POSTS_URL = "https://jsonplaceholder.typicode.com/posts/";

// Hakee joko yhden postauksen (id annettu) tai kaikki (id tyhjä).
// Palauttaa aina taulukon, jotta Home-komponentti voi käyttää map-funktiota.
export async function fetchData(url: string, delayMs = 0) {
  // Keinotekoinen viive, jotta lataustila (Suspense) ehtii näkyä.
  if (delayMs > 0) {
    await new Promise((res) => setTimeout(res, delayMs));
  }

  const response = await fetch(url);
  if (!response.ok) {
    return [] as UserType[]; // esim. 404, kun id:tä ei löydy
  }
  const users = await response.json();
  return (Array.isArray(users) ? users : [users]) as UserType[];
}

