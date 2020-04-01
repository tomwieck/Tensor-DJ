import React from 'react'
import 'whatwg-fetch'
import { render } from 'react-dom'
import Webcam from './webcam.js'
import './index.css'

class App extends React.Component {
  state = {
    newRecords: [],
    records: []
  };

  constructor(props) {
    super(props);
    this.callbackFunction = this.callbackFunction.bind(this);
    this.newRecords = this.newRecords.bind(this);
  }

  callbackFunction = (childData) => {
    let newRecords = this.state.records.filter((e) => e.id === childData + '')

    if (newRecords.length > 0) {
      this.setState({ newRecords: newRecords })
    }
  };

  newRecords() {
    return this.state.newRecords;
  }

  async componentDidMount() {
    // const resp = await fetch('http://localhost:8888/.netlify/functions/airtable/airtable.js/', {
    const resp = await fetch('https://tensor-dj.netlify.com/.netlify/functions/airtable/airtable.js/', {
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
    return (
      <div className="app">
        <Webcam parentCallback={this.callbackFunction} />
        {this.newRecords() &&
          <div className="records">
            {this.newRecords().length
              ? this.newRecords().map(record =>
                <div key={record.id}>
                  <h1>
                    Artist:
                  </h1>
                  <h2>
                    {record.artist}
                  </h2>
                  <br></br>
                  <h1>
                    Title:
                  </h1>
                  <h2>
                    {record.title}
                  </h2>
                  <br></br>
                  <h1>
                    Label:
                  </h1>
                  <h2>
                    {record.label}
                  </h2>
                  <br></br>
                  <h1>
                    Year:
                  </h1>
                  <h2>
                    {record.year}
                  </h2>
                  <br></br>
                  <p><b>ID:</b> {record.id}</p>
                  <br></br>
                </div>
              )
              : <p>Loading...</p>
            }
          </div>}
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('root'),
)