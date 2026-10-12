import { useActionState, useState } from "react";
import type { UserType } from "./Home";
import { usersData } from "./UserData";
import SubmitButton from "./SubmitButton";

const rowStyle = {
  width: "250px",
  display: "flex",
  justifyContent: "space-between",
};

// Osa 4: Lomakkeet ja Hookit
export default function UserForm() {
  const [users, setUsers] = useState(usersData);

  // useActionState palauttaa [actionin viimeisin paluuarvo, action, isPending].
  // Kirjan _formState-muuttujan sijaan paluuarvoa käytetään alla
  // ("Viimeksi lisätty"), joten ESLint ei valita käyttämättömästä muuttujasta.
  const [lastAdded, action] = useActionState(
    async (_previousArgs: UserType, formData: FormData) => {
      const user: UserType = {
        userId: Number(formData.get("userId")?.toString() || 0),
        id: Number(formData.get("id")?.toString() || 0),
        title: formData.get("title")?.toString() || "",
        body: formData.get("body")?.toString() || "",
      };

      await new Promise((res) => {
        setTimeout(() => {
          // Ohjeen mukainen korjaus: kirjan
          //   usersData.push(user); setUsers(usersData);
          // ei renderöi, koska taulukon viite ei muutu. Uusi taulukko toimii.
          setUsers((prevUsers) => [...prevUsers, user]);
          res(null);
        }, 1000);
      });

      return user;
    },
    {
      userId: 0,
      id: 0,
      title: "",
      body: "",
    }
  );

  return (
    <form
      action={action}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={rowStyle}>
        <label htmlFor="userId" style={{ marginRight: "5px" }}>
          UserId
        </label>
        <input id="userId" name="userId" />
      </div>
      <div style={rowStyle}>
        <label htmlFor="id" style={{ marginRight: "5px" }}>
          Id
        </label>
        <input id="id" name="id" />
      </div>
      <div style={rowStyle}>
        <label htmlFor="title" style={{ marginRight: "5px" }}>
          Title
        </label>
        <input id="title" name="title" />
      </div>
      <div style={rowStyle}>
        <label htmlFor="body" style={{ marginRight: "5px" }}>
          Body
        </label>
        <input id="body" name="body" />
      </div>
      <SubmitButton />
      {lastAdded.title && <p>Viimeksi lisätty: {lastAdded.title}</p>}
      <p style={{ wordBreak: "break-all" }}>{JSON.stringify(users)}</p>
    </form>
  );
}

