import * as React from "react";
import { cn } from "../utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-[1.4rem] border border-black/5 bg-white shadow-[0_12px_28px_rgba(25,28,31,0.10)]", className)} {...props} />;
}
