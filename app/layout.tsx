import "./globals.css";
export const metadata = { title: "NawazPublication", description: "AI Notes" };
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>
}
