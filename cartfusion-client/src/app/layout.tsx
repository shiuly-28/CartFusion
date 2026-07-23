
import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";



export const metadata: Metadata = {
  title: "CartFusion",
  description: "Multi-vendor e-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      
    >
      <body className="">
       
          <Provider>
            {children}
          </Provider>
       
        </body>
    </html>
  );
}
