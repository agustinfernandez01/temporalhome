// src/app/(public)/layout.tsx  ✅ sin <html>/<body>
import Navbar from '../../Components/Layout/Navbar';
import Footer from '../../Components/Layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
