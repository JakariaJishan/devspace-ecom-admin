import "./globals.css";
import {Toaster} from "react-hot-toast";
import SidePanel from "@/app/components/SidePanel";

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SidePanel>
          {children}
        </SidePanel>
        <Toaster/>
      </body>
    </html>
  );
}
