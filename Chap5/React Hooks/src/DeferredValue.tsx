import { type ChangeEvent, useState, useDeferredValue } from "react";
import { deferredData, type DeferredMessage } from "./DeferredData";

export default function DeferredValue() {
    const [filterTxt, setFilterTxt] = useState("");
    const [
        filteredMessages,
        setFilteredMessages,
    ] = useState<DeferredMessage[]>(deferredData);
    const deferredMessages = useDeferredValue(filteredMessages);

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
                {/* Steps 5-9: render filteredMessages here to see the laggy version.
                    Steps 10-11: render deferredMessages for the responsive version. */}
                {deferredMessages.map((msg) => (
                    <li key={msg.id}>{msg.message}</li>
                ))}
            </ul>
        </div>
    );
}
