export interface Props {
  theme: {
    forms: {
      "font_size": number | null;
      "font_color": string | null;
      "font_family": string | null;
      "border_color": string | null;
      "field_height": number | null;
      "border_radius": number | null;
      "background_color": string | null;
      "placeholder_color": string | null;
    },
    global: {
      "body_color": string | null;
      "error_color": string | null;
      "border_radius": number | null;
      "footer_enabled"?: boolean | null;
      "loading_bar_color"?: string | null;
      "primary_active_color": string | null;
      "primary_border_color": string | null;
      "secondary_body_color": string | null;
    },
    primaryFontFamily: {
      "bold": string | null;
      "light": string | null;
      "medium": string | null;
      "regular": string | null;
    };
    text: {
      "primary_text_size": number | null;
      "primary_text_color": string | null;
      "secondary_text_size": number | null;
      "secondary_text_color": string | null;
    };
  };
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  intervalId: number;
}
