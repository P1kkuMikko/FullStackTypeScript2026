import { type ChangeEvent, useState } from "react";
import { deferredData, type DeferredMessage } from "./DeferredData";

export default function DeferredValue() {
    const [filterTxt, setFilterTxt] = useState("");
    const [
        filteredMessages,
        setFilteredMessages,
    ] = useState<DeferredMessage[]>(deferredData);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setFilteredMessages(
                deferredData
                    .filter((data) => data.message.includes(e.target.value))
            );
        } else {
            setFilteredMessages(deferredData);
        }
        setFilterTxt(e.target.value);
    };

    return (
        <div>
            <input type="text" value={filterTxt} onChange={onChange} />
            <br />
            <ul style={{ listStyleType: "none" }}>
                {filteredMessages.map((msg) => (
                    <li key={msg.id}>{msg.message}</li>
                ))}
            </ul>
        </div>
    );
}
