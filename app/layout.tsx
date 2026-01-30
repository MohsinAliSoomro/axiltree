import type { Metadata } from "next";
import {
  Inter,
  Poppins,
  Space_Mono,
  Quicksand,
  Amarna,
  Delius,
  Borel,
  Iceland
} from "next/font/google";
import "@mantine/core/styles.css";
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { mantineTheme } from "./theme/mantineTheme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: "500",
  variable: "--font-poppins",
  subsets: ["latin"],
});
const spaceMono = Space_Mono({
  weight: "700",
  variable: "--font-space",
  subsets: ["latin"],
});
const quicksand = Quicksand({
  weight: "500",
  variable: "--font-quicksand",
  subsets: ["latin"],
});
const amarna = Amarna({
  weight: "500",
  variable: "--font-amarna",
  subsets: ["latin"],
});
const delius = Delius({
  weight: "400",
  variable: "--font-delius",
  subsets: ["latin"],
});
const borel = Borel({
  weight: "400",
  variable: "--font-borel",
  subsets: ["latin"],
});
const iceland = Iceland({
  weight: "400",
  variable: "--font-iceland",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "AxilTree - Bio Links Platform",
  description: "Share all your important links in one customizable profile page. A modern platform for managing your bio links.",
  openGraph: {
    title: "AxilTree - Bio Links Platform",
    description: "Share all your important links in one customizable profile page. A modern platform for managing your bio links.",
    url: "https://axiltree.tech",
    siteName: "AxilTree",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AxilTree Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AxilTree - Bio Links Platform",
    description: "Share all your important links in one customizable profile page.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${spaceMono.variable} ${quicksand.variable} ${amarna.variable} ${delius.variable} ${borel.variable} ${iceland.variable}`}
    >
      <head>
          <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={mantineTheme} withGlobalClasses>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
