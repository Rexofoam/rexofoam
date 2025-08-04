"use client";

import Image from "next/image";
import { useNavigation } from "@/utils/navigation";

interface HeaderProps {
  variant?: "home" | "details";
  className?: string;
}

export default function Header({
  variant = "home",
  className = "",
}: HeaderProps) {
  const navigation = useNavigation();

  const handleLogoClick = () => {
    navigation.goHome();
  };

  if (variant === "home") {
    return (
      <div className={`flex flex-col items-center space-y-6 ${className}`}>
        {/* Logo */}
        <Image
          onClick={handleLogoClick}
          src="/images/logo.png"
          alt="Maplesea Logo"
          width={280}
          height={280}
          className="cursor-pointer hover:scale-105 transition-transform duration-200"
          priority
        />
      </div>
    );
  }

  return (
    <header
      className={`w-full flex items-center justify-center px-4 py-2 bg-gray/90 backdrop-blur-lg shadow-md z-10 ${className}`}
    >
      <Image
        onClick={handleLogoClick}
        src="/images/logo-flat.png"
        alt="Maplesea Logo Flat"
        width={400}
        height={140}
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
        priority
      />
    </header>
  );
}

export { Header };
