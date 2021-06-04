import { ChangeEvent, MouseEvent } from 'react'

const Controls = ({
  handleHoursInputOnChange,
  handleMinutesInputOnChange,
  handleSecondsInputOnChange,
  handleStartButtonOnClick,
  handleStopButtonOnClick,
  setHoursInputRef,
  setMinutesInputRef,
  setSecondsInputRef,
}: {
  handleHoursInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMinutesInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSecondsInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStartButtonOnClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleStopButtonOnClick: (event: MouseEvent<HTMLButtonElement>) => void;
  setHoursInputRef: (element: HTMLInputElement | null) => void;
  setMinutesInputRef: (element: HTMLInputElement | null) => void;
  setSecondsInputRef: (element: HTMLInputElement | null) => void;
}) => {
  return (
    <>
      <div>
        <div>
          <h3>Hours</h3>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="23"
            ref={setHoursInputRef}
            onChange={handleHoursInputOnChange}
          />
        </div>
        <div>
          <h3>Minutes</h3>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="59"
            ref={setMinutesInputRef}
            onChange={handleMinutesInputOnChange}
          />
        </div>
        <div>
          <h3>Seconds</h3>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="59"
            ref={setSecondsInputRef}
            onChange={handleSecondsInputOnChange}
          />
        </div>
      </div>
      <div>
        <button onClick={handleStartButtonOnClick}>Start</button>
        <button onClick={handleStopButtonOnClick}>Stop</button>
      </div>
    </>
  )
}

export default Controls
