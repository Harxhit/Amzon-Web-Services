import { SideBar } from "../components";
import {RightPanel} from '../components'
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
<div className="grid grid-cols-[240px_1fr_300px] h-screen bg-[#0D1117] overflow-hidden">
  <aside className="border-r border-[#1F2937] p-4 overflow-y-auto">
    <SideBar />
  </aside>

  <main className="p-6 overflow-hidden bg-black">
    <Outlet />
  </main>

  <aside className="border-l border-[#1F2937] p-4 overflow-y-auto hidden lg:block md:block">
    <RightPanel />
  </aside>
</div>

    )
}

export default MainLayout