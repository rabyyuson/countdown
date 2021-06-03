import React, { FunctionComponent } from 'react'
import { Props } from './interfaces'

const Clock: FunctionComponent<Props> = ({ time }) => {
  const {
    hours,
    minutes,
    seconds,
  } = time
  return (
    <>
      <div>
        {`${hours}:${minutes}:${seconds}`}
      </div>
    </>
  )
}

export default Clock
