export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/80 backdrop-blur border border-blue-100 dark:border-slate-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Login</h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          This is a placeholder login page.
        </p>
        <a
          href="/register"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Go to Customer Registration
        </a>
      </div>
    </div>
  );
}

