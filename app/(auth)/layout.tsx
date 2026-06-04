export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="medical-grid flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-72 animated-gradient opacity-30" />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
