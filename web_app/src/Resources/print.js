import { Print } from '@material-ui/icons';
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


class Printer extends React.Component {
    render() {
        return (
            <div>
                <ReactToPrint content={() => this.componentRef}>
                    <PrintContextConsumer>
                        {({ handlePrint }) => (
                            <div onClick={handlePrint}>
                            <Print />
                            </div>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <div style={{ display: "none" }}><ComponentToPrint ref={el => (this.componentRef = el)} /></div>
            </div>
        );
    }
}


export default Printer;