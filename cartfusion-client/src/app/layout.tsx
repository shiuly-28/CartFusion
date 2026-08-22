
import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

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
    <html
      lang="en"
      
    >
      <body className="">
       
          <Provider>
            <StoreProvider>
              <InitUser/>
            {children}
            </StoreProvider>
           </Provider>
       </body>
    </html>
  );
}
