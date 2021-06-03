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
      },
      intervalId: 0,
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
    const { minutes, seconds } = this.state.time
    const isMoreThanADay = Number(value) > 24
    const minutesToAssign = isMoreThanADay ? 0 : minutes
    const secondsToAssign = isMoreThanADay ? 0 : seconds
    let hoursToAssign
    if (isMoreThanADay) {
      hoursToAssign = 24
    } else {
      hoursToAssign = value
    }

    if ((Number(value) > 23) && (Number(minutes) > 0 || Number(seconds) > 0)) {
      hoursToAssign = 23
    }
    
    this.setState({ time: {
      hours: Number(hoursToAssign),
      minutes: Number(minutesToAssign),
      seconds: Number(secondsToAssign),
    }})

    if (this.hoursInput) {
      this.hoursInput.value = String(hoursToAssign)
    }
  }

  handleMinutesInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { hours, seconds } = this.state.time
    const isMoreThanAnHour = Number(value) > 60
    const minutesToAssign = isMoreThanAnHour ? 60 : value
    const isADay = hours === 24
    const hoursToAssign = (isADay && Number(value) > 0) ? 23 : hours

    this.setState({ time: {
      hours: hoursToAssign,
      minutes: Number(minutesToAssign),
      seconds,
    }})

    if (this.minutesInput) {
      this.minutesInput.value = String(minutesToAssign)
    }

    if (this.hoursInput) {
      this.hoursInput.value = String(hoursToAssign)
    }
  }

  handleSecondsInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { hours, minutes } = this.state.time
    const secondsToAssign = (Number(value) > 60) ? 60 : value
    const isADay = hours === 24
    const hoursToAssign = (isADay && Number(value) > 0) ? 23 : hours

    this.setState({ time: {
      hours: hoursToAssign,
      minutes,
      seconds: Number(secondsToAssign),
    }})

    if (this.secondsInput) {
      this.secondsInput.value = String(secondsToAssign)
    }

    if (this.hoursInput) {
      this.hoursInput.value = String(hoursToAssign)
    }
  }

  handleCancelButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    const { intervalId } = this.state
    window.clearInterval(intervalId)

    this.setState({
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    })

    if (this.hoursInput) {
      this.hoursInput.value = ""
    }

    if (this.minutesInput) {
      this.minutesInput.value = ""
    }

    if (this.secondsInput) {
      this.secondsInput.value = ""
    }
  }

  handlePauseButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    console.log(event)
  }

  handleResumeButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    console.log(event)
  }

  handleStartButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    const selectedTime = new Date()
    const { hours, minutes, seconds } = this.state.time
    selectedTime.setHours(selectedTime.getHours() + hours)
    selectedTime.setMinutes(selectedTime.getMinutes() + minutes)
    selectedTime.setSeconds(selectedTime.getSeconds() + seconds)

    const intervalId = window.setInterval(() => {
      const now = new Date()
      const timeDifference = selectedTime.getTime() - now.getTime()

      this.setState({
        time: {
          hours: Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((timeDifference / 1000 / 60) % 60),
          seconds: Math.floor((timeDifference / 1000) % 60),
        }
      })
    }, 1000)

    this.setState({ intervalId })
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
