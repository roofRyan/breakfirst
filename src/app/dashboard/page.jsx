export default function dashpage() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">系統總攬</h1>
       <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-300 rounded-lg shadow">訂單</div>
        <div className="p-4 bg-slate-300 rounded-lg shadow">庫存</div>
        <div className="p-4 bg-slate-300 rounded-lg shadow">營業額</div>
       </div>
      </div>
    );
  }
  