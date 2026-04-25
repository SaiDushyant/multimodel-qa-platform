function Layout({ sidebar, children }) {
  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <div className="h-14 bg-black text-white flex items-center px-6 font-semibold">
        AI RAG Assistant
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-64 border-r p-4 overflow-y-auto bg-gray-50">
          {sidebar}
        </div>

        {/* MAIN */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
