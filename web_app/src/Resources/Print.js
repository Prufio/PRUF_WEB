import React from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div>
                {window.utils.generateCardPrint()}
            </div>
        );
    }
}


class Example extends React.Component {
    render() {
        return (
            <div>
                <ReactToPrint content={() => this.componentRef}>
                    <PrintContextConsumer>
                        {({ handlePrint }) => (
                            <div>
                                <button
                                    onClick={handlePrint}
                                    className="printButton"
                                >
                                    <img
                                        className="printImageForm"
                                        title="Print Asset Info"
                                        src={require("../Resources/print.png")}
                                        alt="Pruf Print" />
                                </button>
                            </div>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <div style={{ display: "none" }}><ComponentToPrint ref={el => (this.componentRef = el)} /></div>
            </div>
        );
    }
}


export default Example;