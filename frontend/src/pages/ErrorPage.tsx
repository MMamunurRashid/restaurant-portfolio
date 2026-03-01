import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error: any = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full text-center">
                <h1 className="text-9xl font-extrabold text-primary tracking-widest">
                    {error?.status || "404"}
                </h1>
                <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
                    Page {error?.statusText || "Not Found"}
                </div>

                <div className="mt-10">
                    <h2 className="text-3xl font-bold text-neutral mb-4">
                        Oops! Something went wrong.
                    </h2>
                    <p className="text-neutral mb-8">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-lg transition"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}