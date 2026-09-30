import "./globals.css";
export const metadata = { title: "NawazPublication", description: "AI Powered Educational Platform" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f9fa] text-gray-900">{children}</body>
    </html>
  );
}
