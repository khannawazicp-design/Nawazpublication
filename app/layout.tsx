export default function RootLayout(props: any) {
  return (
    <html lang="en">
      <body style={{ margin: "0", padding: "0" }}>
        {props.children}
      </body>
    </html>
  );
}
