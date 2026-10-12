import { type ChangeEvent, useMemo, useState } from "react";
import "./App.css";
import { type UserType } from "./Home";
import Awaitable from "./Awaitable";
import DeferredValue from "./DeferredValue";
import Transitioner from "./Transitioner";
import UserForm from "./UserForm";
import { OptimisticMessages } from "./OptimisticMessages";

async function fetchData(url: string) {
  const response = await fetch(url);
  const users = await response.json();
  return (Array.isArray(users) ? users : [users]) as UserType[];
}

// This is the book's "Suspense and use" App component, renamed so that the
// other examples can also be shown from App.
function SuspenseExample() {
  const [id, setId] = useState("");

  const idToGet = `https://jsonplaceholder.typicode.com/posts/${id}`;
  const fetchPromise = useMemo(() => fetchData(idToGet), [idToGet]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  return (
    <>
      id: <input type="text" value={id} onChange={onChange} />
      <Awaitable fetchPromise={fetchPromise} />
    </>
  );
}

// In the book each section replaces App's returned JSX with only that example.
// These buttons do the same thing: only the selected example is rendered.
const examples = {
  "Suspense & use": SuspenseExample,
  useDeferredValue: DeferredValue,
  useTransition: Transitioner,
  "Forms (useActionState)": UserForm,
  useOptimistic: OptimisticMessages,
};
type ExampleName = keyof typeof examples;

function App() {
  const [selected, setSelected] = useState<ExampleName>("useOptimistic");
  const Example = examples[selected];

  return (
    <>
      <nav style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {(Object.keys(examples) as ExampleName[]).map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            disabled={name === selected}
          >
            {name}
          </button>
        ))}
      </nav>
      <Example />
    </>
  );
}
export default App;