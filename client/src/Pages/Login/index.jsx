import { useState } from "react";
import { useLogin } from "../../Hooks/useLogin.js";
import "./style.css";

import backgroundImage from "./img/movies.jpeg";

const Index = () => {
    // State hooks for username, password, and validation error
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState("");

    // Destructuring properties from the useLogin custom hook
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if username or password fields are empty and set validation error if true
        if (username.trim() === "" || password.trim() === "") {
            setValidationError("Please enter your credentials to login");
            return;
        } else {
            setValidationError("");
        }

        await login(username, password);
    };

    return (
        <div className="home-container-login">
            <div
                className="background-image-login"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div className="overlay-login"></div>
            <div className="login-page">
                <form className="login" onSubmit={handleSubmit}>
                    <h3>Log In</h3>

                    <label>Username:</label>
                    <input
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        value={username}
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <button className="login-button" disabled={isLoading}>
                        Log in
                    </button>
                    {validationError && (
                        <div className="error">{validationError}</div>
                    )}
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default Index;
