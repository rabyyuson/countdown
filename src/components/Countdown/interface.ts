export interface Props {
  theme: {
    global: {
      "body_color": string | null;
      "error_color": string | null;
      "border_radius": number | null;
      "footer_enabled"?: boolean | null;
      "loading_bar_color"?: string | null;
      "primary_active_color": string | null;
      "primary_border_color": string | null;
      "secondary_body_color": string | null;
    };
    header: {
      "logo": string | undefined,
      "cart_icon": string | null,
      "font_size": number | null,
      "font_color": string | null,
      "font_family": string | null,
      "account_icon": string | null,
      "border_color": string | null,
      "border_radius": number | null,
      "background_color": string | null,
      "background_image": string | null,
      "active_font_color": string | null,
      "mobile_logo_width": number | null,
      "desktop_logo_width": number | null,
      "active_border_color": string | null,
      "active_background_color": string | null,
    };
  };
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  intervalId: number;
}
