import { useActionState, useState } from "react";
import { type UserType } from "./Home";
import { usersData } from "./UserData";
import SubmitButton from "./SubmitButton";

const fieldRowStyle = {
    width: "250px",
    display: "flex",
    justifyContent: "space-between",
};

export default function UserForm() {
    const [users, setUsers] = useState(usersData);
    // The book also destructures isPending here. It was used by the original raw
    // <button disabled={isPending}>, but after switching to <SubmitButton /> it is
    // unused, which "noUnusedLocals" reports as an error, so it is left out.
    const [_formState, action] = useActionState(
        async (_previousArgs: UserType, formData: FormData) => {
            const user: UserType = {
                userId: Number(formData.get("userId")?.toString() || 0),
                id: Number(formData.get("id")?.toString() || 0),
                title: formData.get("title")?.toString() || "",
                body: formData.get("body")?.toString() || "",
            };

            await new Promise((res) => {
                setTimeout(() => {
                    usersData.push(user);
                    // The book calls setUsers(usersData). That passes the same array
                    // reference, so React (and the React Compiler) may skip the update.
                    // Passing a copy guarantees the new user shows up.
                    setUsers([...usersData]);
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
            <div style={fieldRowStyle}>
                <label htmlFor="userId" style={{ marginRight: "5px" }}>
                    UserId
                </label>
                <input id="userId" name="userId" />
            </div>
            <div style={fieldRowStyle}>
                <label htmlFor="id" style={{ marginRight: "5px" }}>
                    Id
                </label>
                <input id="id" name="id" />
            </div>
            <div style={fieldRowStyle}>
                <label htmlFor="title" style={{ marginRight: "5px" }}>
                    Title
                </label>
                <input id="title" name="title" />
            </div>
            <div style={fieldRowStyle}>
                <label htmlFor="body" style={{ marginRight: "5px" }}>
                    Body
                </label>
                <input id="body" name="body" />
            </div>
            <SubmitButton />
            <p>{JSON.stringify(users)}</p>
        </form>
    );
}

