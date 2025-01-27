"use client";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import NavigationConent from "./NavigationContent";
import { useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 w-full bg-background border-b">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationConent />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      {/* Mobile Navigation (Sheet) */}
      <nav className="md:hidden fixed bottom-0 right-0 m-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="Open navigation menu">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="w-[200px] flex flex-col">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation menu
              </SheetDescription>
            </SheetHeader>
            <NavigationMenu className="flex-col justify-end">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationConent isMobile setOpen={handleOpenChange} />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
