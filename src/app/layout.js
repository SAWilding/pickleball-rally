export const metadata = {
  title: "Pickleball Rally",
  description: "A site for pickleballers everywhere!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
