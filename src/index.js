import React from 'react'
import 'whatwg-fetch'
import { render } from 'react-dom'

class App extends React.Component {
  state = {
    records: []
  }

  async componentDidMount() {
    const resp = await fetch('http://localhost:8888/.netlify/functions/airtable/airtable.js/', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    const records = await resp.json()

    if (records) {
      this.setState({ records })
    }
  }

  render() {
    let { records } = this.state
    return (
      <div className="App">
        <div>
          {records.length
            ? records.map(record =>
              <div key={record.id}>
                <p><b>ID:</b> {record.id}</p>
                <p><b>Artist:</b> {record.artist}</p>
                <p><b>Title:</b> {record.title}</p>
                <p><b>Label:</b> {record.label}</p>
                <p><b>Year:</b> {record.year}</p>
                <br></br>
              </div>
            )
            : <p>Loading...</p>
          }
        </div>
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
)