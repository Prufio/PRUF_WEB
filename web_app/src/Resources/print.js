import { Print } from '@material-ui/icons';
import React from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import Icon from '@material-ui/core/Icon';
import "../assets/css/custom.css";

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div>
                {window.utils.generateCardPrint(this.props.obj)}
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
                            <Icon onClick={handlePrint} className="footerIcon">
                            <Print />
                            </Icon>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <div style={{ display: "none" }}><ComponentToPrint obj={this.props.obj} ref={el => (this.componentRef = el)} /></div>
            </div>
        );
    }
}


export default Printer;