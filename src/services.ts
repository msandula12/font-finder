import { GOOGLE_FONTS_CSS_API, OPENAI_URL, PROMPT_TEXT } from "@/constants";

export async function getGoogleFontStyles(fontNames: string[]) {
  const fontsQueryString = fontNames
    .map((font) => `family=${font.replace(/\s/g, "+")}`)
    .join("&");

  const fontsResponse = await fetch(
    `${GOOGLE_FONTS_CSS_API}?key=${
      import.meta.env.VITE_GOOGLE_FONTS_API_KEY
    }&${fontsQueryString}`
  );

  if (!fontsResponse.ok) {
    throw new Error(`Response status: ${fontsResponse.status}`);
  }

  const fontCss = await fontsResponse.text();

  return fontCss;
}

export async function getGptResponse(userPrompt: string) {
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
