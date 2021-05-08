import React from "react";
import Copyright from 'react-simple-snake'
import Card from "components/Card/Card.js";
import "../assets/css/custom.css";

export default function Counter() {
    return (
        <Card className="CopyrightBackground">
            <Copyright percentageWidth="50"/>
        </Card>
    );
}
