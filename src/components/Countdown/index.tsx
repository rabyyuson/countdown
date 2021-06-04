import React, { ChangeEvent, MouseEvent } from 'react'
import { ThemeProvider } from 'styled-components'
import fetch from 'cross-fetch'
import get from 'lodash/get'
import { Props } from './interface'
import Clock from '../Clock'
import Controls from '../Controls'
import config from '../../config.json'
import styled from 'styled-components'

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
    this.handleStartButtonOnClick = this.handleStartButtonOnClick.bind(this)
    this.handleStopButtonOnClick = this.handleStopButtonOnClick.bind(this)
    this.resetCountdown = this.resetCountdown.bind(this)

    this.state = {
      theme: {
        forms: {
          "font_size": null,
          "font_color": null,
          "font_family": null,
          "border_color": null,
          "field_height": 0,
          "border_radius": null,
          "background_color": null,
          "placeholder_color": null,
        },
        global: {
          "body_color": null,
          "error_color": null,
          "border_radius": 0,
          "primary_active_color": null,
          "primary_border_color": null,
          "secondary_body_color": null,
        },
        header: {
          "logo": undefined,
          "cart_icon": null,
          "font_size": 0,
          "font_color": null,
          "font_family": null,
          "account_icon": null,
          "border_color": null,
          "border_radius": 0,
          "background_color": null,
          "background_image": null,
          "active_font_color": null,
          "mobile_logo_width": 0,
          "desktop_logo_width": 0,
          "active_border_color": null,
          "active_background_color": null,
        },
        text: {
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
        const header = get(data, 'header') || {}
        const text = get(data, 'text') || {}

        this.setState({
          theme: {
            forms,
            global,
            header,
            text,
          }
        })
      })
      .catch((error) => console.error(error))
  }

  handleHoursInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { hours, ...rest } = this.state.time
    const hoursToAssign = Number(value) > 23 ? 23 : value
    
    this.setState({ time: {
      hours: Number(hoursToAssign),
      ...rest,
    }})

    if (this.hoursInput) {
      this.hoursInput.value = String(hoursToAssign)
    }
  }

  handleMinutesInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const { minutes, ...rest } = this.state.time
    const minutesToAssign =  Number(value) > 59 ? 59 : value

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
    const secondsToAssign = Number(value) > 59 ? 59 : value

    this.setState({ time: {
      seconds: Number(secondsToAssign),
      ...rest,
    }})

    if (this.secondsInput) {
      this.secondsInput.value = String(secondsToAssign)
    }
  }

  handleStartButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    const { hours, minutes, seconds } = this.state.time
    if (!hours && !minutes && !seconds) {
      return
    }

    const selectedTime = new Date()
    selectedTime.setHours(selectedTime.getHours() + hours)
    selectedTime.setMinutes(selectedTime.getMinutes() + minutes)
    selectedTime.setSeconds(selectedTime.getSeconds() + seconds)

    const intervalId = window.setInterval(() => {
      const now = new Date()
      const timeDifference = selectedTime.getTime() - now.getTime()
      if (timeDifference < 1000) {
        this.resetCountdown()
      }

      const calculatedHours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
      const calculatedMinutes = Math.floor((timeDifference / 1000 / 60) % 60)
      const calculatedSeconds = Math.floor((timeDifference / 1000) % 60)

      this.setState({
        time: {
          hours: calculatedHours,
          minutes: calculatedMinutes,
          seconds: calculatedSeconds,
        }
      })
    }, 1000)

    this.setState({ intervalId })
  }

  handleStopButtonOnClick(event: MouseEvent<HTMLButtonElement>) {
    if (!this.state.intervalId) {
      return
    }

    this.resetCountdown()
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

  resetCountdown() {
    window.clearInterval(this.state.intervalId)
    
    this.setState({
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      intervalId: 0,
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

  render() {
    const { intervalId, theme, time } = this.state

    const LogoContainer = styled.div`
      width: 400px;
      margin: 0 auto;
      border: 1px dashed red;
    `

    const Logo = styled.img.attrs((props) => ({
      src: props.theme.header && props.theme.header.logo
    }))`
      width: 100%;
    `

    console.log(theme)

    return (
      <ThemeProvider theme={theme}>
        <LogoContainer>
          <Logo />
        </LogoContainer>

        <Clock time={time} />

        <Controls
          intervalId={intervalId}
          handleHoursInputOnChange={this.handleHoursInputOnChange}
          handleMinutesInputOnChange={this.handleMinutesInputOnChange}
          handleSecondsInputOnChange={this.handleSecondsInputOnChange}
          handleStartButtonOnClick={this.handleStartButtonOnClick}
          handleStopButtonOnClick={this.handleStopButtonOnClick}
          setHoursInputRef={this.setHoursInputRef}
          setMinutesInputRef={this.setMinutesInputRef}
          setSecondsInputRef={this.setSecondsInputRef}
        />
      </ThemeProvider>
    )
  }
}

export default Countdown
