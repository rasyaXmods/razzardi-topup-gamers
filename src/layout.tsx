import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAZZARDI STORE | Top Up Game",
  description: "Top up game digital RAZZARDI STORE"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}