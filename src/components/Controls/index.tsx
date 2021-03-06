import { FunctionComponent } from 'react'
import { Props } from './interface'
import styled from 'styled-components'

const ControlsContainer = styled.div`
  width: 500px;
  border-radius: 0 0 ${(props) => props.theme.global.border_radius * 2 || 0}px ${(props) => props.theme.global.border_radius * 2 || 0}px;
  background-color: ${(props) => props.theme.global.body_color || "#ececec"};
  border: 2px solid ${(props) => props.theme.global.primary_border_color || "#ddd"};
  border-top: none;
  margin: 0 auto;

  @media (max-width: 560px) {
    width: 100%;
    border-radius: 0;
    padding: 0;
    border: none;
  }
`

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  @media (max-width: 560px) {
    display: block;
    margin: 0;
    padding: 0;
  }
`

const InputBlock = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  padding: 0 25px;

  &:before {
    content: ':';
    font-size: 60px;
    font-family: Arial;
    position: absolute;
    right: -15px;
  }

  @media (max-width: 560px) {
    padding: 0;

    &:before {
      display: none;
    }
  }
`

const Input = styled.input`
  width: 100%;
  font-size: 60px;
  font-weight: bold;
  color: #000;
  background: none;
  outline: none;
  text-align: center;
  border: none;
  border-bottom: 2px solid #111;
  border-radius: 0;
  display: block;
  font-family: Arial;
  margin-top: -1px;
  margin-bottom: 5px;

  @media (max-width: 560px) {
    width: 120px;
    margin: 0 auto;
  }
`

const InputLabel = styled.label`
  font-size: 14px;
  color: #4c4c4c;
`

const ButtonContainer = styled.div`
  padding: 40px 20px 0 20px;
  margin-bottom: 20px;
`

const ControlButton = styled.button`
  width: 100%;
  padding: 20px;
  font-size: 26px;
  text-transform: uppercase;
  cursor: pointer;
  background: ${(props) => props.color ? props.color : '#111'};
  color: #fff;
  border: none;
  font-weight: bold;
  border-radius: ${(props) => props.theme.global.border_radius || 0}px ${(props) => props.theme.global.border_radius || 0}px ${(props) => props.theme.global.border_radius || 0}px ${(props) => props.theme.global.border_radius || 0}px;

  @media (max-width: 560px) {
    border-radius: 0;
    border: none;
  }
`

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
  <ControlsContainer>
    {!intervalId && (
      <InputContainer>
        <InputBlock>
          <Input
            type="number"
            placeholder="00"
            min="00"
            max="23"
            ref={setHoursInputRef}
            onChange={handleHoursInputOnChange}
          />
          <InputLabel>Hours</InputLabel>
        </InputBlock>
        <InputBlock>
          <Input
            type="number"
            placeholder="00"
            min="00"
            max="59"
            ref={setMinutesInputRef}
            onChange={handleMinutesInputOnChange}
          />
          <InputLabel>Minutes</InputLabel>
        </InputBlock>
        <InputBlock>
          <Input
            type="number"
            placeholder="00"
            min="00"
            max="59"
            ref={setSecondsInputRef}
            onChange={handleSecondsInputOnChange}
          />
          <InputLabel>Seconds</InputLabel>
        </InputBlock>
      </InputContainer>
    )}
    <ButtonContainer>
      {!intervalId && (
        <ControlButton onClick={handleStartButtonOnClick}>
          Start
        </ControlButton>
      )}
      {!!intervalId && (
        <ControlButton color={'#da1616'} onClick={handleStopButtonOnClick}>
          Stop
        </ControlButton>
      )}
    </ButtonContainer>
  </ControlsContainer>
)

export default Controls
