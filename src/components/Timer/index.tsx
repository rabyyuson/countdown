import React from 'react'
import { ThemeProvider } from 'styled-components'
import fetch from 'cross-fetch'
import get from 'lodash/get'
import { StateProps } from '../../interfaces'
import Countdown from '../Countdown'
import Controls from '../Controls'
import config from '../../config.json'

class Timer extends React.Component<{}, StateProps> {
  constructor(props: {}) {
    super(props)

    this.getKoalaTheme = this.getKoalaTheme.bind(this)

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
      }
    }
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

  componentDidMount() {
    this.getKoalaTheme()
  }

  render() {
    const { theme } = this.state

    return (
      <ThemeProvider theme={theme}>
        <Countdown />
        <Controls />
      </ThemeProvider>
    )
  }
}

export default Timer
