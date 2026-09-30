export const metadata = {
  title: "Nawaz Publication",
  description: "Nawaz Publication Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
