import { ConditionalClasses } from "@/types";

// Basic implementation of "classnames" library
export function cx(...classNames: (string | ConditionalClasses)[]): string {
  return classNames
    .map((className) => {
      if (typeof className === "string") {
        return className;
      }
      if (typeof className === "object") {
        return Object.keys(className)
          .filter((key) => className[key])
          .join(" ");
      }
      return undefined;
    })
    .filter(Boolean)
    .join(" ");
}
