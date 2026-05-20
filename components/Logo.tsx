import Image from "next/image";
import logo from "@/public/tpg-logo.png";

export function Logo() {
  return (
    <Image
      src={logo}
      alt="The Points Guy"
      priority
      className="h-8 w-auto"
      sizes="220px"
    />
  );
}
