/*-----------------------------------------------------------------
 *  TO DO
 *
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * IMPORTANT NOTE : DO NOT REMOVE FROM CODE:
 *      Verification of rgtHash in curated, tokenless asset classes are not secure beyond the honorable intentions
 * of authorized recorders. All blockchain info is readable, so a bad actor could trivially obtain a copy of the
 * correct rgtHash on chain. This "stumbling block" measure is in place primarily to keep honest people honest, and
 * to require an actual, malicious effort to bypass security rather than a little copy-paste. Actual decentralized
 * security is provided with tokenized assets, which do not rely on the coercive trust relationship that creates the
 * incentive for recorders not to engage in malicious practices.
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * Order of require statements:
 * 1: (modifiers)
 * 2: checking custodial status
 * 3: checking the asset existance
 * 4: checking the idendity and credentials of the caller
 * 5: checking the suitability of provided data for the proposed operation
 * 6: checking the suitability of asset details for the proposed operation
 * 7: verifying that provided verification data matches required data
 * 8: verifying that message contains any required payment
 *
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * Contract Resolution Names -
 *  assetToken
 *  assetClassToken
 *  PRUF_APP
 *  PRUF_NP
 *  PRUF_simpleEscrow
 *  PRUF_AC_MGR
 *  PRUF_AC_Minter
 *  T_PRUF_APP
 *  T_PRUF_NP
 *  T_PRUF_simpleEscrow
 *
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * CONTRACT Types:
 * 0   --NONE
 * 1   --Custodial
 * 2   --Non-Custodial
 * Owner (onlyOwner)
 * other = unauth
 *
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * ASSET CLASS Types:
 * 1   --Custodial
 * 2   --Non-Custodial
 *
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * Record status field key
 *
 * 0 = no status, Non transferrable. Default asset creation status
 *       default after FMR, and after status 5 (essentially a FMR) (IN frontend)
 * 1 = transferrable
 * 2 = nontransferrable
 * 3 = stolen
 * 4 = lost
 * 5 = transferred but not reImported (no new rghtsholder information) implies that asset posessor is the owner.
 *       must be re-imported by ACadmin through regular onboarding process
 *       no actions besides modify RGT to a new rightsholder can be performed on a statuss 5 asset (no status changes) (Frontend)
 * 6 = in supervised escrow, locked until timelock expires, but can be set to lost or stolen
 *       Status 1-6 Actions cannot be performed by automation.
 *       only ACAdmins can set or unset these statuses, except 5 which can be set by automation
 * 7 = out of Supervised escrow (user < 5)
 *
 * 50 Locked escrow
 * 51 = transferrable, automation set/unset (secret confirmed)(ACAdmin can unset)
 * 52 = non-transferrable, automation set/unset (secret confirmed)(ACAdmin can unset)
 * 53 = stolen (automation set)(ONLY ACAdmin can unset)
 * 54 = lost (automation set/unset)(ACAdmin can unset)
 * 55 = asset transferred automation set/unset (secret confirmed)(Only ACAdmin can unset) ####DO NOT USE????
 * 56 = escrow - automation set/unset (secret confirmed)(ACAdmin can unset)
 * 57 = out of escrow
 * 58 = out of locked escrow
 * 59 = Recyclable
 * 60 = Burned (can only be reimported by an ACAdmin can unset)
 *
*-----------------------------------------------------------------

*-----------------------------------------------------------------
 * Authorized User Types   registeredUsers[]
 * 1 - 4 = Standard User types
 * 1 - all priveleges
 * 2 - all but force-modify
 * 5 - 9 = Robot (cannot create of force-modify)
 * Other = unauth
 *
 *-----------------------------------------------------------------
*/


// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.7;

import "./PRUF_core_065.sol";

contract PRUF_AC_MGR is PRUF {
    using SafeMath for uint256;
    using SafeMath for uint8;

    mapping(uint16 => Costs) private cost; // Cost per function by asset class
    //Costs private baseCost;
    address AC_minterAddress;
    mapping(uint16 => AC) internal AC_data; // AC info database
    mapping(string => uint16) internal AC_number;

    uint256 private priceThreshold; //threshold of price where fractional pricing is implemented

    /*
     * @dev Verify user credentials
     * Originating Address:
     *      is owner
     */
    modifier isAdmin() {
        require(
            (msg.sender == owner()) || (msg.sender == AC_minterAddress),
            "PAM:IA:Calling address does not belong to an Admin"
        );
        _;
    }

    /*
     * @dev Verify caller holds ACtoken of passed assetClass
     */
    modifier isACtokenHolderOfClass(uint16 _assetClass) {
        uint256 assetClass256 = uint256(_assetClass);
        require(
            (AssetClassTokenContract.ownerOf(assetClass256) == msg.sender),
            "PAM:IACTHoC:msg.sender not authorized in asset class"
        );
        _;
    }

    //--------------------------------------------External Functions--------------------------
    /*
     * @dev Authorize / Deauthorize / Authorize users for an address be permitted to make record modifications
     * ----------------INSECURE -- keccak256 of address must be generated clientside in release.
     */
    function OO_addUser(
        address _authAddr,
        uint8 _userType,
        uint16 _assetClass
    ) external isACtokenHolderOfClass(_assetClass) {
        require(
            (_userType == 0) ||
                (_userType == 1) ||
                (_userType == 2) ||
                (_userType == 9) ||
                (_userType == 99),
            "PAM:AU:Invalid user type"
        );
        //^^^^^^^checks^^^^^^^^^

        bytes32 addrHash = keccak256(abi.encodePacked(_authAddr));

        registeredUsers[addrHash].userType = _userType;
        registeredUsers[addrHash].authorizedAssetClass = _assetClass;
        //^^^^^^^effects^^^^^^^^^
        emit REPORT("Internal user database access!"); //report access to the internal user database
        //^^^^^^^interactions^^^^^^^^^
    }

    /*
     * @dev Mints asset class @ address
     */
    function createAssetClass(
        uint256 _tokenId,
        address _recipientAddress,
        string calldata _name,
        uint16 _assetClass,
        uint16 _assetClassRoot,
        uint8 _custodyType
    ) external isAdmin {
        AC memory _ac = AC_data[_assetClassRoot];

        require((_tokenId != 0), "PAM:CAC: Token id cannot be 0"); //sanity check inputs
        require((_custodyType != 0), "PAM:CAC:CustodyType cannot be 0"); //sanity check inputs
        require( //has valid root
            (_ac.custodyType != 0) || (_assetClassRoot == _assetClass),
            "PAM:CAC:Root asset class does not exist"
        );
        //^^^^^^^checks^^^^^^^^^

        AC_number[_name] = _assetClass;
        AC_data[_assetClass].name = _name;
        AC_data[_assetClass].assetClassRoot = _assetClassRoot;
        AC_data[_assetClass].custodyType = _custodyType;
        //^^^^^^^effects^^^^^^^^^

        AssetClassTokenContract.mintACToken(
            _recipientAddress,
            _tokenId,
            "pruf.io/assetClassToken"
        );
        //^^^^^^^interactions^^^^^^^^^
    }

    /*
     * @dev Set function costs and payment address per asset class, in Wei
     */
    function ACTH_setCosts(
        uint16 _class,
        uint256 _newRecordCost,
        uint256 _transferAssetCost,
        uint256 _createNoteCost,
        uint256 _reMintRecordCost,
        uint256 _changeStatusCost,
        uint256 _forceModifyCost,
        address _paymentAddress
    ) external isACtokenHolderOfClass(_class) {

        //^^^^^^^checks^^^^^^^^^
        cost[_class].newRecordCost = _newRecordCost;
        cost[_class].transferAssetCost = _transferAssetCost;
        cost[_class].createNoteCost = _createNoteCost;
        cost[_class].reMintRecordCost = _reMintRecordCost;
        cost[_class].changeStatusCost = _changeStatusCost;
        cost[_class].forceModifyCost = _forceModifyCost;
        cost[_class].paymentAddress = _paymentAddress;
        //^^^^^^^effects^^^^^^^^^
    }

    /*
     * @dev Retrieve AC_data @ _tokenId
     */
    function getAC_data(uint16 _assetClass)
        external
        view
        returns (
            uint16,
            uint8,
            uint256
        )
    {
        //^^^^^^^effects^^^^^^^^^
        return (
            AC_data[_assetClass].assetClassRoot,
            AC_data[_assetClass].custodyType,
            AC_data[_assetClass].extendedData
        );
        //^^^^^^^interactions^^^^^^^^^
    }

    /*
     * @dev Retrieve AC_name @ _tokenId
     */
    function getAC_name(uint256 _tokenId)
        external
        view
        returns (string memory)
    {
        uint16 assetClass = uint16(_tokenId);
        //^^^^^^^effects^^^^^^^^^
        return (AC_data[assetClass].name);
        //^^^^^^^interactions^^^^^^^^^
    }

    /*
     * @dev Retrieve AC_number @ AC_name
     */
    function resolveAssetClass(string memory _name)
        external
        view
        returns (uint16)
    //^^^^^^^checks^^^^^^^^^
    {
        return (AC_number[_name]);
        //^^^^^^^interactions^^^^^^^^^
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function getNewRecordCosts(uint16 _assetClass)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {
        AC memory AC_info = getACinfo(_assetClass);
        Costs memory costs = cost[_assetClass];
        uint16 rootAssetClass = AC_info.assetClassRoot;
        Costs memory rootCosts = cost[rootAssetClass];
        uint256 assetClass256 = uint256(_assetClass);

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        return (
            rootCosts.paymentAddress,
            rootCosts.newRecordCost,
            costs.paymentAddress,
            costs.newRecordCost
        );
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function getTransferAssetCosts(uint16 _assetClass)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {
        AC memory AC_info = getACinfo(_assetClass);
        Costs memory costs = cost[_assetClass];
        uint16 rootAssetClass = AC_info.assetClassRoot;
        Costs memory rootCosts = cost[rootAssetClass];
        uint256 assetClass256 = uint256(_assetClass);

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        return (
            rootCosts.paymentAddress,
            rootCosts.transferAssetCost,
            costs.paymentAddress,
            costs.transferAssetCost
        );
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function getCreateNoteCosts(uint16 _assetClass)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {
        AC memory AC_info = getACinfo(_assetClass);
        Costs memory costs = cost[_assetClass];
        uint16 rootAssetClass = AC_info.assetClassRoot;
        Costs memory rootCosts = cost[rootAssetClass];
        uint256 assetClass256 = uint256(_assetClass);

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        return (
            rootCosts.paymentAddress,
            rootCosts.createNoteCost,
            costs.paymentAddress,
            costs.createNoteCost
        );
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function getReMintRecordCosts(uint16 _assetClass)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {
        AC memory AC_info = getACinfo(_assetClass);
        Costs memory costs = cost[_assetClass];
        uint16 rootAssetClass = AC_info.assetClassRoot;
        Costs memory rootCosts = cost[rootAssetClass];
        uint256 assetClass256 = uint256(_assetClass);

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        return (
            rootCosts.paymentAddress,
            rootCosts.reMintRecordCost,
            costs.paymentAddress,
            costs.reMintRecordCost
        );
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function getChangeStatusCosts(uint16 _assetClass)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {
        AC memory AC_info = getACinfo(_assetClass);
        Costs memory costs = cost[_assetClass];
        uint16 rootAssetClass = AC_info.assetClassRoot;
        Costs memory rootCosts = cost[rootAssetClass];
        uint256 assetClass256 = uint256(_assetClass);

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        return (
            rootCosts.paymentAddress,
            rootCosts.changeStatusCost,
            costs.paymentAddress,
            costs.changeStatusCost
        );
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function getForceModifyCosts(uint16 _assetClass)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {
        AC memory AC_info = getACinfo(_assetClass);
        Costs memory costs = cost[_assetClass];
        uint16 rootAssetClass = AC_info.assetClassRoot;
        Costs memory rootCosts = cost[rootAssetClass];
        uint256 assetClass256 = uint256(_assetClass);

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        return (
            rootCosts.paymentAddress,
            rootCosts.forceModifyCost,
            costs.paymentAddress,
            costs.forceModifyCost
        );
    }

    /*
     * @dev Retrieve function costs per asset class, in Wei
     */
    function retrieveCosts(uint16 _assetClass)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        uint256 assetClass256 = uint256(_assetClass);
        Costs memory costs = cost[_assetClass];

        require(
            (AssetClassTokenContract.ownerOf(assetClass256) !=
                AssetClassTokenAddress), //this will throw in the token contract if not minted
            "PAM:Costs:Asset class not yet populated"
        );
        //^^^^^^^checks^^^^^^^^

        return (
            costs.newRecordCost,
            costs.transferAssetCost,
            costs.createNoteCost,
            costs.reMintRecordCost,
            costs.changeStatusCost,
            costs.forceModifyCost,
            costs.paymentAddress
        );
        //^^^^^^^interactions^^^^^^^^^
    }

    /*
     * @dev Serve a User Record
     */
    function getUserExt(bytes32 _userHash)
        external
        view
        returns (uint8, uint16)
    {
        return (
            registeredUsers[_userHash].userType,
            registeredUsers[_userHash].authorizedAssetClass
        );
        //^^^^^^^interactions^^^^^^^^^
    }
}