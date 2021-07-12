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
    const handleSearch = () => {
        console.log(searchBarVal.includes('0x'))
        console.log(
            searchBarVal.substring(
                searchBarVal.trim().indexOf('0x'),
                searchBarVal.trim().length
            ).length === 66
        )
        if (
            searchBarVal.includes('0x') &&
            searchBarVal.substring(
                searchBarVal.trim().indexOf('0x'),
                searchBarVal.trim().length
            ).length === 66
        ) {
            window.location.href =
                '/#/bridge/search/' +
                searchBarVal.substring(
                    searchBarVal.indexOf('0x'),
                    searchBarVal.trim().length
                )
            return window.location.reload()
        } else {
            return swal({
                title: 'Not a valid asset ID!',
                text: 'Please submit a valid asset ID.',
                icon: 'warning',
                button: 'Close',
            })
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
                    <CustomInput
                        rtlActive={rtlActive}
                        formControlProps={{
                            className: classes.top + ' ' + classes.search,
                        }}
                        inputProps={{
                            onChange: (e) => setSearchBarVal(e.target.value),
                            placeholder: 'Search Asset ID',
                            inputProps: {
                                'aria-label': 'Search Asset ID',
                                className: classes.searchInput,
                            },
                        }}
                    />
                    <Button
                        color="white"
                        onClick={() => handleSearch()}
                        aria-label="edit"
                        justIcon
                        round
                        className={searchButton}
                    >
                        <Search
                            className={
                                classes.headerLinksSvg + ' ' + classes.searchIcon
                            }
                        />
                    </Button>
                </div>
            )}
        </>
    )
}

HeaderLinks.propTypes = {
    rtlActive: PropTypes.bool,
}
