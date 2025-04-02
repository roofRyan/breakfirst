import { Inter } from "next/font/google";
import Sidebar from './components/sidebar';
const inter = Inter({
  subsets:["latin"],
});
import "./globals.css";

export const metadata = {
  title: "早餐店管理系統",
  description: "早餐店點餐管理系統",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className = {inter.className}>
        <div className="min-h-screen flex">
        <Sidebar/>
        <div className="flex-1 p-8">{children}</div></div>
      </body>
    </html>
  );
}