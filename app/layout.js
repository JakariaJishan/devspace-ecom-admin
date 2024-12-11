import "./globals.css";
import {Toaster} from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
