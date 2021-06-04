import { FunctionComponent } from 'react'
import { Props } from './interface'
import styled from 'styled-components'

const Clock: FunctionComponent<Props> = ({ time }) => {
  const { hours, minutes, seconds } = time

  const Container = styled.div`
    width: 400px;
    border: 1px dashed red;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
  `

  return (
    <Container>
      <div>
        {`${Number(hours) < 10 ? `0${hours}` : hours}`}:
      </div>
      <div>
        {`${Number(minutes) < 10 ? `0${minutes}` : minutes}`}:
      </div>
      <div>
        {`${Number(seconds) < 10 ? `0${seconds}` : seconds}`}
      </div>
    </Container>
  )
}

export default Clock
