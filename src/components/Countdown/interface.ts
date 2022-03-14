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
  };
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  intervalId: number;
}
