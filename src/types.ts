import { ReactNode } from "react";

export interface ConditionalClasses {
  [key: string]: boolean;
}

export interface Message {
  message: ReactNode;
  type: "app" | "user";
}
