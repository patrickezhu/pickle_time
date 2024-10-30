import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "Pickle Time",
  description: "View and Report Pickle Ball Court Wait Times",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
