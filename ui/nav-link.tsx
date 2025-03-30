'use client';

import Link from "next/link";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
    title: string,
    url: string,
    Icon: LucideIcon,
}
import { Calendar, Earth, Inbox, Search, Settings } from "lucide-react"
import { usePathname } from "next/navigation";

// Menu items.
const items = [
    {
      title: "Discover",
      url: "/dashboard",
      icon: Earth,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: Search,
    },
    {
      title: "Collections",
      url: "/dashboard/collections",
      icon: Inbox,
    },
    {
      title: "Preferences",
      url: "/dashboard/settings",
      icon: Settings,
    }
  ]

function NavLink({title, url, Icon}: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === url

    return (
        <SidebarMenuItem key={title}>
            <SidebarMenuButton asChild isActive={isActive}>
                <Link href={url}>
                    <Icon />
                    <span>{title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export default function NavLinks() {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <NavLink key={item.title} title={item.title} url={item.url} Icon={item.icon}/>
            ))}
        </SidebarMenu>
    );
}