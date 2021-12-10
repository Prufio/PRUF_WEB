import bs58 from "bs58";
import { QRCode } from "react-qrcode-logo";
import React from "react";
import "../assets/css/custom.css";

function buildWindowUtils() {

  const _generateCardPrint = (obj) => {
    var date = Date().toLocaleString();

    return (
      <div className="printForm">
        {obj !== undefined && (
          <>
            <div className="printQR">
              <QRCode
                value={`https://indevapp.pruf.io/#/user/search/${obj.id}`}
                size="160"
                fgColor="#002a40"
                // logoWidth="24.4"
                // logoHeight="32"
                // logoImage="https://pruf.io/assets/images/pruf-u-logo-with-border-323x429.png"
                quietZone="2"
                ecLevel="M"
              />
            </div>
            <div className="cardHref">https://app.pruf.io</div>
            <div className="cardDate">{date}</div>
            <div className="printFormContent">
              {/* <img
                className="printImageBackgroundForm"
                src={require("../Resources/Images/PrufPrintBackground.png")}
                alt="Pruf Print Background" /> */}
              <div className="printQR2">
                <QRCode
                  value={`https://indevapp.pruf.io/#/user/search/${obj.id}`}
                  size="120"
                  fgColor="#002a40"
                  quietZone="2"
                  ecLevel="L"
                />
              </div>
              <p className="cardNamePrint">Name : {obj.name}</p>
              <p className="cardAcPrint">Node : {obj.nodeName}</p>
              <h4 className="cardIdxPrint">Asset ID : {obj.id}</h4>
            </div>
          </>
        )}
      </div>
    );
  };

  window.utils = {
    generateCardPrint: _generateCardPrint,
  };

  return;
}

export default buildWindowUtils;
