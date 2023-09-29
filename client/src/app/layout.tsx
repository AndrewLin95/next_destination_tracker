import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../components/DarkMode/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <Providers>
          <body className={inter.className}>{children}</body>
        </Providers>
      </AuthProvider>
    </html>
  );
}
