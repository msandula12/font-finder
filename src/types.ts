import { ReactNode } from "react";

export interface Message {
  message: ReactNode;
  type: "app" | "user";
}
