import React from 'react'
import { ThemeProvider } from 'styled-components'
import fetch from 'cross-fetch'
import config from '../config.json'

class InternalDeadline extends React.Component {
  constructor(props: {}) {
    super(props)

    this.getTheme = this.getTheme.bind(this)

    this.state = {
      theme: {
        global: {}
      }
    }
  }

  getTheme() {
    fetch(
      config.koala.api,
      {
        method: 'GET',
        headers: { 'X-Organization-Id': '1' },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        const {
          data,
          error,
          error_description,
        } = response

        if (error) {
          throw new Error(error_description ? error_description : error)
        }

        console.log(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  componentDidMount() {
    this.getTheme()
  }

  // ToDo: update theme
  render() {
    return (
      <ThemeProvider theme={{ main: 'mediumseagreen' }}>
        Countdown
      </ThemeProvider>
    )
  }
}

export default InternalDeadline
