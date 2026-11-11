import "./globals.css";

import AppSidebar from "./_components/AppSidebar";
import Provider from "./provider.jsx";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ClerkProvider } from "@clerk/nextjs";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Chatbox",
  description: "AI Chat Application",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-screen">

          <SidebarProvider>

            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <SidebarInset>

              {/* Header */}
              <header className="flex h-14 items-center gap-2 border-b px-4">
                <SidebarTrigger />
              </header>

              {/* Page Content */}
              <Provider>
                {children}
              </Provider>

            </SidebarInset>

          </SidebarProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}