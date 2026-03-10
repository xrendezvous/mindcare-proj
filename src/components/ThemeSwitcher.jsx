import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className={theme === 'light' ? 'light-mode' : 'dark-mode'}>
            <p>The current theme is: {theme}</p>
            <button onClick={() => setTheme('light')}>Light Mode</button>
            <button onClick={() => setTheme('dark')}>Dark Mode</button>
        </div>
    );
};
