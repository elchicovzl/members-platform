"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const { role } = props;

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Resumen',
      active: pathname === `/${params.storeId}`,
      roles: ["ADMIN", "MODERATOR", "SUPERADMIN"],
    },
    { 
      href: `/${params.storeId}/giveways`,
      label: 'Sorteos',
      active: pathname === `/${params.storeId}/giveways`,
      roles: ["ADMIN", "MODERATOR", "SUPERADMIN"],
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Opciones',
      active: pathname === `/${params.storeId}/settings`,
      roles: ["ADMIN", "SUPERADMIN"],
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
         route.roles.includes(role) ?
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
            )}
          >
            {route.label}
        </Link> : ""
      ))}
    </nav>
  )
};