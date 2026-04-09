import { Golos_Text, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import JotaiProvider from "@/lib/providers/JotaiProvider";
import QueryProvider from "@/lib/providers/QueryProvider";

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lootella Admin Portal",
  description: "Administrative Dashboard for Lootella",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${golosText.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full font-golos text-sm">
        <JotaiProvider>
          <QueryProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </QueryProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
