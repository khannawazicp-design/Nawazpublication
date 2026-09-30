export default function RootLayout(props: { children: any }) {
  return (
    <html lang="en">
      <body style={{ margin: "0", padding: "0", background: "#f8fafc" }}>
        {props.children}
      </body>
    </html>
  );
}
