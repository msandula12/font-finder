import { ReactNode } from "react";

export interface ConditionalClasses {
  [key: string]: boolean;
}

export interface Font {
  category: string;
  family: string;
}

export interface Message {
  message: ReactNode;
  type: "app" | "user";
}
