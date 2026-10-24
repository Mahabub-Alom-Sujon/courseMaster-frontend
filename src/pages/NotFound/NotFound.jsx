import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 dark:bg-slate-950">
            <div className="absolute h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative mx-auto max-w-lg text-center">
                {/* Icon */}
                <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-indigo-500/20 bg-indigo-500/10 shadow-xl shadow-indigo-500/5">
                    <FileQuestion
                        size={64}
                        strokeWidth={1.4}
                        className="text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="absolute -right-3 -top-3 rounded-xl bg-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                            404
                    </span>
                </div>

                {/* Text */}
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
                    Page Not Found
                </p>


                {/* Buttons */}
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700"
                    >
                        <Home size={19} />
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}
