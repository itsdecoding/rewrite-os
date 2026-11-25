import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/ContentContext";
import { AuthProvider } from "@/context/AuthContext";
import { StudioLayoutWrapper } from "@/components/layout/StudioLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rewrite Minds",
  description: "Rewriting Perceptions. Breaking Mental Conditioning. Operating systems and frameworks for high-agency minds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ContentProvider>
            <StudioLayoutWrapper>{children}</StudioLayoutWrapper>
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
