import { ChangeEvent, MouseEvent } from 'react'

export interface Props {
  intervalId: number;
  handleHoursInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMinutesInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSecondsInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStartButtonOnClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleStopButtonOnClick: (event: MouseEvent<HTMLButtonElement>) => void;
  setHoursInputRef: (element: HTMLInputElement | null) => void;
  setMinutesInputRef: (element: HTMLInputElement | null) => void;
  setSecondsInputRef: (element: HTMLInputElement | null) => void;
}
