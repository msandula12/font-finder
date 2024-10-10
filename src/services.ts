import {
  GOOGLE_FONTS_API,
  MAX_FONTS_TO_DISPLAY,
  OPENAI_URL,
} from "@/constants";
import { Font } from "@/types";

export async function getGoogleFonts(descriptors: string[]): Promise<Font[]> {
  const response = await fetch(
    `${GOOGLE_FONTS_API}?key=${
      import.meta.env.VITE_GOOGLE_FONTS_API_KEY
    }&sort=popularity`
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();

  const matchedFonts: Font[] = data.items.filter((font: Font) =>
    descriptors.some(
      (term) =>
        font.family.toLowerCase().includes(term.toLowerCase()) ||
        font.category.toLowerCase().includes(term.toLowerCase())
    )
  );

  return matchedFonts.slice(0, MAX_FONTS_TO_DISPLAY);
}

export async function getFontDescriptorsFromGpt(
  userPrompt: string
): Promise<string[]> {
  const response = await fetch(OPENAI_URL, {
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates search terms for fonts based on natural language descriptions. Provide a comma-separated list of relevant terms.",
        },
        {
          content: `Generate search terms for fonts described as: ${userPrompt}`,
          role: "user",
        },
      ],
      model: "gpt-3.5-turbo",
    }),
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Response status: ${error.error?.message}`);
  }

  const data = await response.json();

  return data.choices[0]?.message?.content
    .split(",")
    .map((term: string) => term.trim());
}
