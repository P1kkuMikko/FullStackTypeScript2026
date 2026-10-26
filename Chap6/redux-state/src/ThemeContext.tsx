import { createContext, type ReactNode, useState } from "react";
type ThemeType = "light" | "dark";

export type ThemeContextType = {
    theme: ThemeType;
    setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
type ThemeProviderProps = {
    children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeType>("light");

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}