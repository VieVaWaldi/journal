"use client";
import Link from "next/link";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/ThemeToggle";

interface NavigationConentProps {
  isMobile?: boolean;
  setOpen?: (newOpen: boolean) => void;
}

export default function NavigationConent({
  isMobile,
  setOpen,
}: NavigationConentProps) {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    cn(
      navigationMenuTriggerStyle(),
      pathname === href && "border-b-2 border-primary",
      isMobile && "w-full text-lg py-4"
    );

  return (
    <>
      <Link href="/" legacyBehavior passHref>
        <NavigationMenuLink
          onClick={() => setOpen?.(false)}
          className={linkClass("/")}
        >
          Home
        </NavigationMenuLink>
      </Link>
      <Link href="/input" legacyBehavior passHref>
        <NavigationMenuLink
          onClick={() => setOpen?.(false)}
          className={linkClass("/input")}
        >
          Input
        </NavigationMenuLink>
      </Link>
      <ThemeToggle />
    </>
  );
}
