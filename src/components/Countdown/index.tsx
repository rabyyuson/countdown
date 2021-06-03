import React, { ChangeEvent, MouseEvent } from 'react'
import { ThemeProvider } from 'styled-components'
import fetch from 'cross-fetch'
import get from 'lodash/get'
import { Props } from './interfaces'
import Clock from '../Clock'
import Controls from '../Controls'
import config from '../../config.json'

class Countdown extends React.Component<{}, Props> {
  hoursInput: HTMLInputElement | null;
  minutesInput: HTMLInputElement | null;
  secondsInput: HTMLInputElement | null;

  constructor(props: {}) {
    super(props)

    this.hoursInput = null
    this.minutesInput = null
    this.secondsInput = null

    this.setHoursInputRef = this.setHoursInputRef.bind(this)
    this.setMinutesInputRef = this.setMinutesInputRef.bind(this)
    this.setSecondsInputRef = this.setSecondsInputRef.bind(this)

    this.getKoalaTheme = this.getKoalaTheme.bind(this)
    this.handleHoursInputOnChange = this.handleHoursInputOnChange.bind(this)
    this.handleMinutesInputOnChange = this.handleMinutesInputOnChange.bind(this)
    this.handleSecondsInputOnChange = this.handleSecondsInputOnChange.bind(this)
    this.handleCancelButtonOnClick = this.handleCancelButtonOnClick.bind(this)
    this.handlePauseButtonOnClick = this.handlePauseButtonOnClick.bind(this)
    this.handleResumeButtonOnClick = this.handleResumeButtonOnClick.bind(this)
    this.handleStartButtonOnClick = this.handleStartButtonOnClick.bind(this)

    this.state = {
      theme: {
        "forms": {
          "font_size": null,
          "font_color": null,
          "font_family": null,
          "border_color": null,
          "field_height": 0,
          "border_radius": null,
          "background_color": null,
          "placeholder_color": null,
        },
        "global": {
          "body_color": null,
          "error_color": null,
          "border_radius": 0,
          "primary_active_color": null,
          "primary_border_color": null,
          "secondary_body_color": null,
        },
        "primaryFontFamily": {
          "bold": null,
          "light": null,
          "medium": null,
          "regular": null,
        },
        "text": {
          "primary_text_size": 0,
          "primary_text_color": null,
          "secondary_text_size": 0,
          "secondary_text_color": null,
        }
      },
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }
  }

  componentDidMount() {
    this.getKoalaTheme()
  }

  getKoalaTheme() {
    fetch(config.koala.api, { method: 'GET', headers: { 'X-Organization-Id': '1' } })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from remote server")
        }
        return response.json()
      })
      .then((visualConfigurations) => {
        const data = get(visualConfigurations, 'data.data')
        const forms = get(data, 'forms') || {}
        const global = get(data, 'global') || {}
        const primaryFontFamily = get(data, 'primary_font_family') || {}
        const text = get(data, 'text') || {}
        
        this.setState({
          theme: {
            forms,
            global,
            primaryFontFamily,
            text,
          }
        })
      })
      .catch((error) => console.error(error))
  }

  handleHoursInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { hours, ...rest } = this.state.time
    const hoursToAssign = (Number(value) > 24) ? 24 : value
    
    this.setState({ time: {
      hours: Number(hoursToAssign),
      ...rest
    }})

    if (this.hoursInput) {
      this.hoursInput.value = String(hoursToAssign)
    }
  }

  handleMinutesInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { minutes, ...rest } = this.state.time
    const minutesToAssign = (Number(value) > 60) ? 60 : value

    this.setState({ time: {
      minutes: Number(minutesToAssign),
      ...rest
    }})

    if (this.minutesInput) {
      this.minutesInput.value = String(minutesToAssign)
    }
  }

  handleSecondsInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { seconds, ...rest } = this.state.time
    const secondsToAssign = (Number(value) > 60) ? 60 : value

    this.setState({ time: {
      seconds: Number(secondsToAssign),
      ...rest
    }})

    if (this.secondsInput) {
      this.secondsInput.value = String(secondsToAssign)
    }
  }

  handleCancelButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    console.log(event)
  }

  handlePauseButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    console.log(event)
  }

  handleResumeButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    console.log(event)
  }

  handleStartButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    this.setState({
      time: {
        hours: Number(this.hoursInput?.value) || 0,
        minutes: Number(this.minutesInput?.value) || 0,
        seconds: Number(this.secondsInput?.value) || 0,
      }
    })
  }

  setHoursInputRef(element: HTMLInputElement | null) {
    this.hoursInput = element
  }

  setMinutesInputRef(element: HTMLInputElement | null) {
    this.minutesInput = element
  }

  setSecondsInputRef(element: HTMLInputElement | null) {
    this.secondsInput = element
  }

  render() {
    const { theme, time } = this.state
    
    return (
      <ThemeProvider theme={theme}>
        <Clock time={time} />
        <Controls
          handleHoursInputOnChange={this.handleHoursInputOnChange}
          handleMinutesInputOnChange={this.handleMinutesInputOnChange}
          handleSecondsInputOnChange={this.handleSecondsInputOnChange}
          handleCancelButtonOnClick={this.handleCancelButtonOnClick}
          handlePauseButtonOnClick={this.handlePauseButtonOnClick}
          handleResumeButtonOnClick={this.handleResumeButtonOnClick}
          handleStartButtonOnClick={this.handleStartButtonOnClick}
          setHoursInputRef={this.setHoursInputRef}
          setMinutesInputRef={this.setMinutesInputRef}
          setSecondsInputRef={this.setSecondsInputRef}
        />
      </ThemeProvider>
    )
  }
}

export default Countdown
