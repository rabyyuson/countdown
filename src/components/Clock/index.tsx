import { FunctionComponent } from 'react'
import { Props } from './interface'

const Clock: FunctionComponent<Props> = ({ time }) => {
  const { hours, minutes, seconds } = time

  return (
    <>
      <div>
        <div>
          {`${Number(hours) < 10 ? `0${hours}` : hours}`}:
        </div>
        <div>
          {`${Number(minutes) < 10 ? `0${minutes}` : minutes}`}:
        </div>
        <div>
          {`${Number(seconds) < 10 ? `0${seconds}` : seconds}`}
        </div>
      </div>
    </>
  )
}

export default Clock
