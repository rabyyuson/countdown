import React, { ChangeEvent, MouseEvent } from 'react'
import { ThemeProvider } from 'styled-components'
import fetch from 'cross-fetch'
import get from 'lodash/get'
import { Props } from './interface'
import Clock from '../Clock'
import Controls from '../Controls'
import Footer from '../Footer'
import config from '../../config.json'
import styled from 'styled-components'

const LogoWrapper = styled.div`
  margin: 40px 0 0 0;
`

const LogoContainer = styled.div`
  padding: 20px;
  width: 460px;
  margin: 0 auto;
  border-radius: ${(props) => props.theme.global.border_radius * 2 || 0}px ${(props) => props.theme.global.border_radius * 2 || 0}px 0 0;
  background-color: ${(props) => props.theme.global.body_color || "#fff"};
  border: 2px solid ${(props) => props.theme.global.primary_border_color || "#fff"};
  border-bottom: none;
`

const Logo = styled.img.attrs((props) => ({
  src: props.theme.header && props.theme.header.logo
}))`
  width: 100%;
`

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
        const global = get(data, 'global') || {}
        const header = get(data, 'header') || {}

        this.setState({
          theme: {
            global,
            header,
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

    return (
      <ThemeProvider theme={theme}>
        <LogoWrapper>
          <LogoContainer>
            <Logo />
          </LogoContainer>
        </LogoWrapper>

        <Clock
          intervalId={intervalId}
          time={time}
        />

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

        <Footer />
      </ThemeProvider>
    )
  }
}

export default Countdown
