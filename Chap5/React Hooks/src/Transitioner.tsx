import { useState, useTransition, useEffect, type MouseEvent } from "react";
import { type UserType } from "./Home";

// The book uses `enum SelectedItem { Default, Users, Message }`, but this project's
// tsconfig has "erasableSyntaxOnly": true, which forbids enums. This const object +
// type pair behaves the same way (SelectedItem.Users etc.) and is type-safe.
const SelectedItem = {
    Default: 0,
    Users: 1,
    Message: 2,
} as const;
type SelectedItem = (typeof SelectedItem)[keyof typeof SelectedItem];

// First version (steps 15-16): users is a plain array built during render.
// Rendering is triggered by the state update inside startTransition, so it IS interruptible.
export function UsersLoader() {
    const users = [];
    for (let i = 0; i < 200; i++) {
        users.push({
            userId: i,
            id: i,
            title: "Title" + i,
            body: "Body" + i,
        });
    }

    return (
        <>
            {users?.map((user) => (
                <UserItem key={user.id} user={user} />
            ))}
        </>
    );
}

// Second version (step 29): users is local state set inside useEffect.
// setUsers runs outside of startTransition, so this render is urgent and NOT interruptible.
export function UsersLoaderWithEffect() {
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        const users = [];
        for (let i = 0; i < 200; i++) {
            users.push({
                userId: i,
                id: i,
                title: "Title A",
                body: "Body A",
            });
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate, the book demonstrates this limitation
        setUsers(users);
    }, []);

    return (
        <>
            {users?.map((user) => (
                <UserItem key={user.id} user={user} />
            ))}
        </>
    );
}

export function UserItem({ user }: { user: UserType }) {
    /* eslint-disable react-hooks/purity -- deliberate slowdown for the useTransition demo */
    const start = Date.now();
    while (Date.now() - start < 10) {
        // deliberately block for 10ms to simulate a slow component
    }
    /* eslint-enable react-hooks/purity */
    return <div>{user.title}</div>;
}

export function ShowMessage() {
    return <div>Interrupt!</div>;
}

export default function Transitioner() {
    const [selectedItem, setSelectedItem] = useState<SelectedItem>(SelectedItem.Default);
    const [_isPending, startTransition] = useTransition();

    // Steps 23-27: comment out the startTransition wrappers to see the UI lock up.
    // Step 28: with startTransition (as below) the "show message" click interrupts the users render.
    const onClickUsers = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startTransition(() => {
            setSelectedItem(SelectedItem.Users);
        });
    };

    const onClickMessage = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startTransition(() => {
            setSelectedItem(SelectedItem.Message);
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "400px",
                }}
            >
                <button onClick={onClickUsers}>get users</button>
                <button onClick={onClickMessage}>show message</button>
            </div>
            <div>
                {selectedItem === SelectedItem.Default && <div>Start here</div>}{" "}
                {/* Step 29: swap <UsersLoader /> for <UsersLoaderWithEffect /> to see the limitation. */}
                {selectedItem === SelectedItem.Users && <UsersLoader />}
                {selectedItem === SelectedItem.Message && <ShowMessage />}
            </div>
        </div>
    );
}
