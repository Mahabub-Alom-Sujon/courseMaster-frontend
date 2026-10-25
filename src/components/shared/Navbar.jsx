import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { getToken, clearToken } from "../../utils/auth";
import { getMe } from "../../services/auth.api";

export default function Navbar() {
    const navigate = useNavigate();

    const [token, setToken] = useState(() => getToken());
    const [me, setMe] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

    const navLinkClass = ({ isActive }) =>
        isActive ? "text-primary font-semibold" : "text-base-content/80 hover:text-primary";

    // Sync Navbar when authentication changes in this tab.
    useEffect(() => {
        const syncAuth = () => {
            setToken(getToken());
        };

        window.addEventListener("auth-change", syncAuth);
        window.addEventListener("storage", syncAuth);

        return () => {
            window.removeEventListener("auth-change", syncAuth);
            window.removeEventListener("storage", syncAuth);
        };
    }, []);

    // Load authenticated user whenever the token changes.
    useEffect(() => {
        let cancelled = false;
        const loadMe = async () => {
            if (!token) {
                setMe(null);
                setLoadingUser(false);
                return;
            }
            setLoadingUser(true);
            try {
                const res = await getMe();

                const userData =
                    res?.data?.user ??
                    res?.data?.data?.user ??
                    res?.data?.data ??
                    res?.data;

                if (!cancelled) {
                    if (userData && typeof userData === "object") {
                        setMe(userData);
                    } else {
                        setMe(null);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Failed to load user:", err);
                    setMe(null);
                }
            } finally {
                if (!cancelled) {
                    setLoadingUser(false);
                }
            }
        };

        loadMe();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleLogout = useCallback(() => {
        clearToken();
        // Remove legacy token keys if your app previously used them.
        localStorage.removeItem("token");
        localStorage.removeItem("user_token");
        localStorage.removeItem("dev_bypass");

        setToken(null);
        setMe(null);

        // Notify other components in the same tab.
        window.dispatchEvent(new Event("auth-change"));

        navigate("/", { replace: true });
    }, [navigate]);

    const initials = me?.name
        ? me.name
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase()
        : "U";

    const dashboardPath =
        me?.role === "admin" ? "/admin" : "/student";

    const isLoggedIn = Boolean(token && me);

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
            <div className="navbar max-w-6xl mx-auto px-2">
                {/* Logo */}
                <div className="navbar-start">
                    <Logo />
                </div>

                {/* Desktop navigation */}
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal gap-1">
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={navLinkClass}
                            >
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/courses"
                                className={navLinkClass}
                            >
                                Courses
                            </NavLink>
                        </li>

                        {isLoggedIn && (
                            <li>
                                <NavLink
                                    to={dashboardPath}
                                    className={navLinkClass}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Right side */}
                <div className="navbar-end gap-2">
                    <ThemeToggle />

                    {/* Login and Register */}
                    {!token && (
                        <div className="hidden md:flex gap-2">
                            <Link
                                to="/login"
                                className="btn btn-sm btn-ghost"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="btn btn-sm btn-primary"
                            >
                                Enroll Now
                            </Link>
                        </div>
                    )}

                    {/* Desktop user menu */}
                    {isLoggedIn && (
                        <div className="hidden md:block dropdown dropdown-end">
                            <button
                                type="button"
                                tabIndex={0}
                                className="btn btn-ghost btn-circle avatar"
                                aria-label="Open user menu"
                            >
                                <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                    {initials}
                                </div>
                            </button>

                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60 border border-base-300"
                            >
                                <li className="px-2 py-2 pointer-events-none">
                                    <p className="font-semibold">
                                        {me.name}
                                    </p>
                                    <p className="text-sm text-base-content/70">
                                        {me.email}
                                    </p>
                                    <span className="badge badge-outline mt-2">
                                        {me.role}
                                    </span>
                                </li>

                                <li>
                                    <Link to={dashboardPath}>
                                        Dashboard
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/profile">
                                        Profile
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-red-500"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Mobile menu */}
                    <div className="dropdown dropdown-end md:hidden">
                        <button
                            type="button"
                            tabIndex={0}
                            className="btn btn-ghost btn-circle"
                            aria-label="Open navigation menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60 border border-base-300"
                        >
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={navLinkClass}
                                >
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/courses"
                                    className={navLinkClass}
                                >
                                    Courses
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <NavLink
                                            to={dashboardPath}
                                            className={navLinkClass}
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>

                                    <li>
                                        <Link to="/profile">
                                            Profile
                                        </Link>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="text-red-500"
                                        >
                                            Logout
                                        </button>
                                    </li>

                                    <li className="pointer-events-none mt-2">
                                        <span className="text-xs text-base-content/70">
                                            {me.name} · {me.role}
                                        </span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login">
                                            Login
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/register">
                                            Enroll Now
                                        </Link>
                                    </li>
                                </>
                            )}

                            {token && !me && loadingUser && (
                                <li className="pointer-events-none">
                                    <span className="text-sm">
                                        Loading account...
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}