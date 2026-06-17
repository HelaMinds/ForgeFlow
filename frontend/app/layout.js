import './globals.css';

export const metadata = {
  title: 'ForgeFlow',
  description: 'Turn vague ideas into actionable execution plans',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
