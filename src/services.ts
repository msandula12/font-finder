import { GOOGLE_FONTS_CSS_API, OPENAI_URL } from "@/constants";

export async function getGoogleFontStyles(fontNames: string[]) {
  const queryString = fontNames
    .map((font) => `family=${font.replace(/\s/g, "+")}`)
    .join("&");

  const response = await fetch(
    `${GOOGLE_FONTS_CSS_API}?key=${
      import.meta.env.VITE_GOOGLE_FONTS_API_KEY
    }&${queryString}`
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const fontCss = await response.text();

  return fontCss;
}

export async function getGptResponse(userPrompt: string) {
  const PROMPT_TEXT =
    "Give me the names of 5 Google Fonts that meet the following look and feel (I only want the names of the fonts, no other details, in an array)";

  const response = await fetch(OPENAI_URL, {
    body: JSON.stringify({
      messages: [
        {
          content: `${PROMPT_TEXT}: ${userPrompt}`,
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

  return data;
}
