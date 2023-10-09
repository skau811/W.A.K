import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { computeThemeColourAndImage } from "../Functions/computeThemeColourAndImage";

export const useTheme = (firstMovieBackdropPath) => {
    const { user } = useAuthContext();

    const [themeColour, setThemeColour] = useState("#FFFFFF");
    const [themeImage, setThemeImage] = useState("");

    useEffect(() => {
        if (firstMovieBackdropPath) {
            computeThemeColourAndImage(
                user,
                setThemeColour,
                setThemeImage,
                firstMovieBackdropPath
            );
        }
        console.log("Updated Theme Color:", themeColour);
    }, [user, firstMovieBackdropPath]);

    return { themeColour, themeImage };
};
