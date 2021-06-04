import { FunctionComponent } from 'react'
import { Props } from './interface'

const Controls: FunctionComponent<Props> = ({
  intervalId,
  handleHoursInputOnChange,
  handleMinutesInputOnChange,
  handleSecondsInputOnChange,
  handleStartButtonOnClick,
  handleStopButtonOnClick,
  setHoursInputRef,
  setMinutesInputRef,
  setSecondsInputRef
}) => (
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
      {!intervalId && (
        <button onClick={handleStartButtonOnClick}>Start</button>
      )}
      {!!intervalId && (
        <button onClick={handleStopButtonOnClick}>Stop</button>
      )}
    </div>
  </>
)

export default Controls
