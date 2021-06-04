import { FunctionComponent } from 'react'
import { Props } from './interface'
import styled from 'styled-components'

const ClockContainer = styled.div`
  width: 500px;
  background-color: ${(props) => props.theme.global.body_color || "#fff"};
  border: 2px solid ${(props) => props.theme.global.primary_border_color || "#fff"};
  border-bottom: none;
  border-top: none;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  overflow: hidden;
`

const TimeBlock = styled.div`
  width: 100%;
  text-align: center;
  position: relative;

  &:before {
    content: ':';
    font-size: 60px;
    font-family: Arial;
    position: absolute;
    right: -12px;
  }
`

const Time = styled.div`
  font-size: 60px;
  font-weight: bold;
  font-family: Arial;
  margin-bottom: 8px;
`

const TimeLabel = styled.label`
  font-size: 14px;
  color: #4c4c4c;
`

const Clock: FunctionComponent<Props> = ({
  intervalId,
  time
}) => {
  const { hours, minutes, seconds } = time

  return (
    <ClockContainer>
      {!!intervalId && (
        <>
          <TimeBlock>
            <Time>
              {`${Number(hours) < 10 ? `0${hours}` : hours}`}
            </Time>
            <TimeLabel>Hours</TimeLabel>
          </TimeBlock>
          <TimeBlock>
            <Time>
              {`${Number(minutes) < 10 ? `0${minutes}` : minutes}`}
            </Time>
            <TimeLabel>Minutes</TimeLabel>
          </TimeBlock>
          <TimeBlock>
            <Time>
              {`${Number(seconds) < 10 ? `0${seconds}` : seconds}`}
            </Time>
            <TimeLabel>Seconds</TimeLabel>
          </TimeBlock>
        </>
      )}
    </ClockContainer>
  )
}

export default Clock
