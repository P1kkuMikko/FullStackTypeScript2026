import {use} from 'react';
import ThemeProvider, {ThemeContext} from './ThemeContext';

export function ThemeDisplay() {
    const theme = use(ThemeContext);
    const onClick = () => {
        theme && theme.setTheme(theme.theme === "light" ? "dark" : "light");
    };

    return (
        <div
            style={{
                border: "1px solid blue",
                padding: "25px",
                backgroundColor: theme?.theme === "dark" ? "black" : "white",
                color: theme?.theme === "dark" ? "white" : "black",
            }}
        >
            <div>Hello World!</div>
            <button onClick={onClick}>Toggle Theme</button>
        </div>
    );
}