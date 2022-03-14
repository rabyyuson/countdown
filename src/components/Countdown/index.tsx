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

  @media (max-width: 560px) {
    margin: 0;
  }
`

const LogoContainer = styled.div`
  padding: 40px 80px;
  width: 340px;
  margin: 0 auto;
  border-radius: ${(props) => props.theme.global.border_radius * 2 || 0}px ${(props) => props.theme.global.border_radius * 2 || 0}px 0 0;
  background-color: ${(props) => props.theme.global.body_color || "#ececec"};
  border: 2px solid ${(props) => props.theme.global.primary_border_color || "#ddd"};
  border-bottom: none;

  @media (max-width: 560px) {
    width: 100%;
    border-radius: 0;
    padding: 0;
    border: none;
  }
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
        return
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
            <svg viewBox="0 0 675 162">
              <g>
                <path d="M257.1,126.3c-0.8,0-1.1-0.6-1.1-1l-10.5-35.9v35.9c0,0.8-0.4,1-1.1,1h-12.2c-0.8,0-1.1-0.6-1.1-1V36.3c0-0.6,0.4-1,1.1-1h24.5c10.1,0,13.7,4.7,13.7,12.6v26.7c0,7.3-2.4,11.8-10.6,12.6l12,38.1c0.1,0.8-0.4,1-1.1,1H257.1z M245.5,48.4v25.7h9.8c0.5,0,0.7-0.1,0.7-0.7V49.1c0-0.5-0.1-0.7-0.7-0.7H245.5z"/>
                <path d="M305.2,35.3c0.8,0,1.1,0.6,1.1,1l15.4,88.9c0,0.6-0.4,1-1.1,1h-12.8c-0.5,0-1.1-0.4-1.1-1l-3.1-21.7h-11.3l-3.4,21.7c0,0.6-0.4,1-1.1,1H275c-0.7,0-1.1-0.4-1.1-1l16.2-88.9c0-0.4,0.3-1,1.1-1H305.2z M294.3,90.5h7.5l-3.5-25.1L294.3,90.5z"/>
                <path d="M327.7,125.2V36.3c0-0.6,0.4-1,1.1-1h26.5c10.1,0,13.7,4.7,13.7,12.6v21.5c0,6.9-1.9,9.5-4.3,11.4c2.4,2,4.3,4.6,4.3,11.4v21.3c0,8.1-3,12.7-13.6,12.7h-14.1H341h-12.2C328,126.3,327.7,125.6,327.7,125.2z M342.1,48.4v25.7H354c0.5,0,0.7-0.1,0.7-0.7V49.1c0-0.5-0.1-0.7-0.7-0.7H342.1z M342.1,87.3v25.9H354c0.5,0,0.7-0.1,0.7-0.6V87.9c0-0.5-0.1-0.6-0.7-0.6H342.1z"/>
                <path d="M386.4,126.3c-0.8,0-1.1-0.6-1.1-1v-30l-13.5-58.9c-0.1-0.6,0.5-1,1.1-1h12.2c0.7,0,1,0.4,1.1,1l6.3,31.3l6.1-31.3c0.1-0.6,0.5-1,1.1-1h12.4c0.5,0,1.2,0.4,1,1l-13.3,58.9v30c0,0.8-0.5,1-1.1,1H386.4z"/>
                <path d="M446.9,126.3c-0.8,0-1.1-0.6-1.1-1v-30l-13.5-58.9c-0.1-0.6,0.5-1,1.1-1h12.2c0.7,0,1,0.4,1.1,1l6.3,31.3l6.1-31.3c0.1-0.6,0.5-1,1.1-1h12.4c0.5,0,1.2,0.4,1,1l-13.3,58.9v30c0,0.8-0.5,1-1.1,1H446.9z"/>
                <path d="M492.8,113.8H504c0.5,0,0.7-0.1,0.7-0.6V36.3c0-0.6,0.5-1,1.1-1h12.4c0.5,0,1,0.4,1,1v77.9c0,8.1-3,12.7-13.6,12.7h-13.7c-10.9,0-14-4.7-14-12.5V36.3c0-0.6,0.4-1,1.1-1h12.2c0.7,0,1.1,0.4,1.1,1v76.8C492.2,113.7,492.3,113.8,492.8,113.8z"/>
                <path d="M528.6,47.4c0-8.1,3.7-12.7,13.7-12.7h13.9c10.1,0,13.7,4.7,13.7,12.6v12.1c0,0.6-0.4,0.9-1.1,0.9h-12.2c-0.5,0-1.1-0.3-1.1-0.9V48.4c0-0.5-0.1-0.6-0.7-0.6h-11.1c-0.5,0-0.7,0.1-0.7,0.6v25.1c0,0.5,0.1,0.7,0.7,0.7h12.5c10.7,0,13.7,4.7,13.7,12.5v27.6c0,8.1-3,12.7-13.6,12.7h-13.7c-10.9,0-14-4.7-14-12.5v-13.4c0-0.7,0.4-0.9,1.1-0.9h12.2c0.5,0,1.1,0.3,1.1,0.9v12.1c0,0.5,0.1,0.6,0.7,0.6h11.1c0.5,0,0.7-0.1,0.7-0.6V87.9c0-0.5-0.1-0.6-0.7-0.6h-12.5c-9.8,0-13.7-1.8-13.7-12.5V47.4z"/>
                <path d="M578.7,114.5V47.4c0-8.1,3.7-12.7,13.7-12.7h13.9c10.1,0,13.7,4.7,13.7,12.6v67c0,8.1-3,12.7-13.6,12.7h-13.7C581.8,126.9,578.7,122.3,578.7,114.5z M604.9,47.8h-11.1c-0.5,0-0.7,0.1-0.7,0.6v64.7c0,0.5,0.1,0.6,0.7,0.6h11.1c0.5,0,0.7-0.1,0.7-0.6V48.4C605.6,47.9,605.5,47.8,604.9,47.8z"/>
                <path d="M658.9,126.3c-0.8,0-1.1-0.6-1.1-1L645,82v43.3c0,0.8-0.4,1-1.1,1h-12c-0.8,0-1.1-0.6-1.1-1V36.3c0-0.6,0.4-1,1.1-1h12.2c0.7,0,1.1,0.4,1.1,1l12.8,43.3V36.3c0-0.6,0.4-1,1.1-1h12c0.5,0,1.1,0.4,1.1,1v88.9c0,0.8-0.5,1-1.1,1H658.9z"/>
              </g>
              <path fill="#F24141" d="M1.3,0C0.6,0,0,0.6,0,1.3v159.5c0,0.7,0.6,1.3,1.3,1.3h195.5c0.7,0,1.3-0.6,1.3-1.3V0H1.3z M108,125.7H90V108h18V125.7z M162,72v18v18v18h-18h-18v-18h18V90h-36H90v17.7H72V90V72h18V54H54v72H36V54V36h18h36h18v18v18h36V36h18V72z"/>
            </svg>
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
