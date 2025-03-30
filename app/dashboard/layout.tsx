import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBar from "@/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBar />
      <div className="w-full">
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  )
}
