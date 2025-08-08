"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Image
            src="/tab-logo.ico"
            alt="MapleSEA Tracker Logo"
            width={20}
            height={20}
            className="rounded"
          />
          <span>© 2025 MapleSEA Tracker. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
