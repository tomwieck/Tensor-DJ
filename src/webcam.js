import React from 'react'
import './webcam.css';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

const flip = true; // whether to flip the webcam
const webcam = new tmImage.Webcam(window.innerWidth / 2, window.innerHeight, flip); // width, height, flip
const maxPredictions = 40;
var model = false;
const URL = 'https://teachablemachine.withgoogle.com/models/exLTYR64h/';
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";


// Load the image model and setup the webcam

export default class Webcam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prediction: false,
            model: '',
        }
        this.startWebcam = this.startWebcam.bind(this);
        this.loop = this.loop.bind(this);
        this.predict = this.predict.bind(this);
    }

    sendData = async (model) => {
        this.props.parentCallback(model);
    };

    async componentDidMount() {
        await this.startWebcam()
    }
    render() {
        // const prediction = (n) => {
        //     return this.state.prediction;
        // }
        return (
            <div className="webcam-and-label">
                <div className="webcam-container" id="webcam-container"></div>
            </div>
        );
    } // close render scope


    async startWebcam(props) {
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);


        // Convenience function to setup a webcam
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(this.loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        return webcam.canvas;
        // return <div id="webcam-container"></div>

        // labelContainer = document.getElementById("label-container");
        // for (let i = 0; i < maxPredictions; i++) { // and class labels
        //     labelContainer.appendChild(document.createElement("div"));
        // }
    }

    async loop() {
        webcam.update(); // update the webcam frame
        if (model) {
            await this.predict();
        }
        window.requestAnimationFrame(this.loop);
    }

    // run the webcam image through the image model
    async predict() {
        let predictedSong = '';
        // let model = await tmImage.load(modelURL, metadataURL);
        if (!model) {
            return;
        } else {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);

            for (let i = 0; i < maxPredictions; i++) {
                if (prediction[i].probability.toFixed(2) > 0.9) {
                    predictedSong = prediction[i].className;
                }

                if (predictedSong) {
                    this.sendData(predictedSong);
                }
            }
        }
    }
}// close class scope