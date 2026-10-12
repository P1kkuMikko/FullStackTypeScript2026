import "./App.css";
import Home from "./Home";
import EffectFetcher from "./EffectFetcher";
import SuspenseFetcher from "./SuspenseFetcher";
import UserForm from "./UserForm";
import { OptimisticMessages } from "./OptimisticMessages";
import { usersData } from "./UserData";

function App() {
  return (
    <>
      <section>
        <h2>Osa 1: Komponentit ja propsit</h2>
        <Home users={usersData} />
      </section>

      <section>
        <h2>Osa 2: useState + useEffect</h2>
        <EffectFetcher />
      </section>

      <section>
        <h2>Osa 3: Suspense ja use</h2>
        <SuspenseFetcher />
      </section>

      <section>
        <h2>Osa 4: Lomakkeet ja Hookit</h2>
        <UserForm />
      </section>

      <section>
        <h2>Osa 4 (vapaaehtoinen): useOptimistic</h2>
        <OptimisticMessages />
      </section>
    </>
  );
}

export default App;
