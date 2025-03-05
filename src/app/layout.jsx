import { Inter } from "next/font/google";
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
function Sidebar(){
  return(
    <nav className="w-64 bg-slate-100 p-4 border-r">
      <h2 className="text-xl font-bold mb-6">早餐店管理</h2>
      <div>
        <NavLink href="/dashboard">總覽</NavLink>
        <NavLink href="/menu">菜單管理</NavLink>
        <NavLink href="/orders">訂單管理</NavLink>
        <NavLink href="/inventory">庫存管理</NavLink>
        <NavLink href="/">homo</NavLink>
      </div>
    </nav>
  );
}
function NavLink({href,children}){
  return(
    <a href={href} className="block px-4py-2 rounded-md hover:bg-slate-200 transition-colors">{children}</a>
  );
}