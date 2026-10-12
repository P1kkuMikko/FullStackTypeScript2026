import {
  useOptimistic,
  useState,
  type MouseEvent,
  type ChangeEvent,
  useTransition,
} from "react";

type Message = { id: number; message: string };

// Osa 4 (vapaaehtoinen): useOptimistic näyttää viestin heti listassa,
// vaikka "palvelin" vastaa vasta 2 sekunnin päästä.
export function OptimisticMessages() {
  const [message, setMessage] = useState("");
  const [messagesRetrievedFromApi, setMessagesRetrievedFromApi] = useState<
    Message[]
  >([]);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messagesRetrievedFromApi, (currentMessages, message) => {
    return [...currentMessages, { id: currentMessages.length + 1, message }];
  });

  const [isPending, startTransition] = useTransition();

  const addNonOptimisticMessage = async (message: string) => {
    await new Promise((res) =>
      setTimeout(() => {
        setMessagesRetrievedFromApi((prev) => [
          ...prev,
          { id: prev.length + 1, message },
        ]);
        setMessage("");
        res(null);
      }, 2000)
    );
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    startTransition(async () => {
      addOptimisticMessage(message);
      await addNonOptimisticMessage(message);
    });
  };

  return (
    <div>
      <input value={message} onChange={onChange} />
      <button onClick={onClick}>add</button>
      {isPending && <span> tallennetaan...</span>}
      <ul style={{ listStyleType: "none" }}>
        {optimisticMessages.map((m, i) => (
          <li key={i}>{m.message}</li>
        ))}
      </ul>
    </div>
  );
}

