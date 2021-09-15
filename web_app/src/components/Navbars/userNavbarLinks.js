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
    const addToken = async () => {
        if(props.tokenAddress && window.ethereum){
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20', // Initially only supports ERC20, but eventually more!
                  options: {
                    address: props.tokenAddress, // The address that the token is at.
                    symbol: "PRUF", // A ticker symbol or shorthand, up to 5 chars.
                    decimals: "18", // The number of decimals in the token
                    image: "https://preview.redd.it/2yzbaaqa0f361.png?auto=webp&s=b4dcb15cb4a27dd5262116618f4d6f4b9d723d64", // A string url of the token logo
                  },
                },
              });
        }
    }
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
            {!isMobile && (
                <div className={wrapper}>
                    <Button
                        color="white"
                        onClick={() => addToken()}
                        aria-label="edit"
                        className="info"
                    >
                        Add $PRUF to wallet
                    </Button>
                </div>
            )}
        </>
    )
}

HeaderLinks.propTypes = {
    rtlActive: PropTypes.bool,
}
