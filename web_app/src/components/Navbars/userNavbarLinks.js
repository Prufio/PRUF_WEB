import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import '../../assets/css/custom.css'
import { isMobile } from "react-device-detect";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import swal from 'sweetalert'
import Search from '@material-ui/icons/Search'
import uaDefault from '../../assets/img/default-icon.png'
import mmDefault from '../../assets/img/mm-icon.png'

// core components
import CustomInput from 'components/CustomInput/CustomInput.js'
import Button from 'components/CustomButtons/Button.js'

import styles from 'assets/jss/material-dashboard-pro-react/components/userNavbarLinksStyle.js'

const useStyles = makeStyles(styles)

export default function HeaderLinks(props) {
    const [searchBarVal, setSearchBarVal] = React.useState('')

    // const handleSearchBar = (e) => {
    //   console.log(e.target.value);
    //   setSearchBarVal(e.target.value);
    // };

    const classes = useStyles()
    const { rtlActive } = props
    const searchButton =
        classes.top +
        ' ' +
        classes.searchButton +
        ' ' +
        classNames({
            [classes.searchRTL]: rtlActive,
        })
    // const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    //   [classes.dropdownItemRTL]: rtlActive,
    // });
    const wrapper = classNames({
        [classes.wrapperRTL]: rtlActive,
    })
    // const managerClasses = classNames({
    //   [classes.managerClasses]: true,
    // });
    return (
        <>
                <div className={wrapper}>
                    <span
                        onClick={() => window.dispatchEvent(props.mmLogin)}
                    >
                        <img className="udButton" src={mmDefault}/>
                    </span>
                    <div
                        onClick={() => window.dispatchEvent(props.udLogin)}
                        className="flexRowButtons"
                    >
                        <img className="udButton" src={uaDefault}/>
                        {props.udSub}
                    </div>
                </div>
        </>
    )
}

HeaderLinks.propTypes = {
    rtlActive: PropTypes.bool,
}
