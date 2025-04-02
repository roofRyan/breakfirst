import NavLink from "./navLink";
export default function Sidebar(){
  return(
    <nav className="w-64 bg-slate-100 p-4 border-r">
      <h2 className="text-xl font-bold mb-6">早餐店管理</h2>
      <div>
        <NavLink href="/dashboard">總覽</NavLink>
        <NavLink href="/menu">菜單管理</NavLink>
        <NavLink href="/orders">訂單管理</NavLink>
        <NavLink href="/inventory">庫存管理</NavLink>
        <NavLink href="/blog">部落格(動態路由)</NavLink>
        <NavLink href="/test">Template</NavLink>
        <NavLink href="/">homo</NavLink>
      </div>
    </nav>
  );
}