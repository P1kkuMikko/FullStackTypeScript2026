import { useFormStatus } from "react-dom";

// useFormStatus kertoo, onko ympäröivän <form>-elementin action kesken.
export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "saving..." : "submit"}
    </button>
  );
}

