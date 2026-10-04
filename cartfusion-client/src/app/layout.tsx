import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", 
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CartFusion",
  description: "CartFusion e-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}