/*  TO DO
 * Recheck user level security and user permissioning /modifiers (after all is done)
 * implement escrow
 *
 *_______________________________________
 * implement remint_asset ?????????     |
 *-----------------------------------------------------------------------------------------------------------------
 * Should all assets have a token, minted to reside within the contract for curated / "nontokenized" asset classes?
 * If so, make a move-token function that can be enabled later (set to an address to control it)
 * we gotta figure out this token thing.
 *-----------------------------------------------------------------------------------------------------------------
 *
 * IMPORTANT NOTE : DO NOT REMOVE FROM CODE:
 *      Verification of rgtHash in curated, tokenless asset classes is not secure beyond the honorable intentions
 * of authorized recorders. All blockchain info is readable, so a bad actor could trivially obtain a copy of the
 * correct rgtHash on chain. This "stumbling block" measure is in place primarily to keep honest people honest, and
 * to require an actual, malicious effort to bypass security rather than a little copy-paste. Actual decentralized
 * security is provided with tokenized assets, which do not rely on the coercive trust relationship that creates the
 * incentive for recorders not to engage in malicious practices.
 *
 *
 *
 * Order of require statements:
 * 1: (modifiers)
 * 2: checking the idendity and credentials of the caller
 * 3: checking the asset existance
 * 4: checking the suitability of provided data for the proposed operation
 * 5: checking the suitability of asset details for the proposed operation
 * 6: verifying that provided verification data matches required data
 * 7: verifying that message contains any required payment
 *
 *
 */

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.2;
import "./PullPayment.sol";
import "./_ERC721/IERC721Receiver.sol";

interface AssetClassTokenInterface {
    function ownerOf(uint256) external view returns (address);

    function transferAssetClassToken(
        address from,
        address to,
        bytes32 idxHash
    ) external;
}

interface AssetTokenInterface {
    function transferAssetToken(
        address from,
        address to,
        bytes32 idxHash
    ) external;
}

interface StorageInterface {
    function newRecord(
        bytes32 _userHash,
        bytes32 _idxHash,
        bytes32 _rgt,
        uint16 _assetClass,
        uint256 _countDownStart,
        bytes32 _Ipfs1
    ) external;

    function modifyRecord(
        bytes32 _userHash,
        bytes32 _idxHash,
        bytes32 _rgtHash,
        uint8 _assetStatus,
        uint256 _countDown,
        uint8 _forceCount
    ) external;

    function setStolenOrLost(
        bytes32 _userHash,
        bytes32 _idxHash,
        uint8 _newAssetStatus
    ) external;

    function modifyIpfs(
        bytes32 _userHash,
        bytes32 _idxHash,
        bytes32 _Ipfs1,
        bytes32 _Ipfs2
    ) external;

    function setEscrow(
        bytes32 _userHash,
        bytes32 _idxHash,
        uint8 _newAssetStatus,
        uint256 _escrowTime
    ) external;

    function endEscrow(
        bytes32 _userHash,
        bytes32 _idxHash,
        uint8 _newAssetStatus
    ) external;

    function retrieveRecord(bytes32 _idxHash)
        external
        returns (
            bytes32,
            bytes32,
            bytes32,
            uint8,
            uint8,
            uint16,
            uint256,
            uint256,
            bytes32,
            bytes32
        );

    function _verifyRightsHolder(bytes32, bytes32) external returns (uint256);

    function blockchainVerifyRightsHolder(bytes32, bytes32)
        external
        returns (uint8);

    function retrieveCosts(uint16 _assetClass)
        external
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        );

    function resolveContractAddress(string calldata _name)
        external
        returns (address);
}

contract FrontEnd is PullPayment, Ownable, IERC721Receiver {
    using SafeMath for uint256;

    struct Record {
        bytes32 recorder; // Address hash of recorder
        bytes32 rightsHolder; // KEK256 Registered  owner
        bytes32 lastRecorder; // Address hash of last non-automation recorder
        uint8 assetStatus; // Status - Transferrable, locked, in transfer, stolen, lost, etc.
        uint8 forceModCount; // Number of times asset has been forceModded.
        uint16 assetClass; // Type of asset
        uint256 countDown; // Variable that can only be dencreased from countDownStart
        uint256 countDownStart; // Starting point for countdown variable (set once)
        bytes32 Ipfs1; // Publically viewable asset description
        bytes32 Ipfs2; // Publically viewable immutable notes
        uint256 timeLock; // Time sensitive mutex
    }

    struct User {
        uint8 userType; // User type: 1 = human, 9 = automated
        uint16 authorizedAssetClass; // Asset class in which user is permitted to transact
    }

    struct Costs {
        uint256 newRecordCost; // Cost to create a new record
        uint256 transferAssetCost; // Cost to transfer a record from known rights holder to a new one
        uint256 createNoteCost; // Cost to add a static note to an asset
        uint256 reMintRecordCost; // Extra
        uint256 changeStatusCost; // Extra
        uint256 forceModifyCost; // Cost to brute-force a record transfer
    }

    mapping(bytes32 => User) private registeredUsers; // Authorized recorder database

    address storageAddress;
    address internal mainWallet;
    StorageInterface private Storage; // Set up external contract interface

    // address minterContractAddress;
    address AssetTokenAddress;
    AssetTokenInterface AssetTokenContract; //erc721_token prototype initialization
    address AssetClassTokenAddress;
    AssetClassTokenInterface AssetClassTokenContract; //erc721_token prototype initialization
    // --------------------------------------Events--------------------------------------------//

    event REPORT(string _msg);
    // --------------------------------------Modifiers--------------------------------------------//
    /*
     * @dev Verify user credentials
     * Originating Address:
     *      Exists in registeredUsers as a usertype 1 or 9
     *      Is authorized for asset class
     */
    modifier isAuthorized() {
        User memory user = registeredUsers[keccak256(
            abi.encodePacked(msg.sender)
        )];

        require(
            (user.userType == 1) || (user.userType == 9),
            "ST:MOD-UA-ERR:User not registered"
        );
        _;
    }

    //----------------------Internal Admin functions / onlyowner or isAdmin----------------------//
    /*
     * @dev Address Setters
     */
    function OO_setAssetClassTokenAddress(address _contractAddress)
        external
        onlyOwner
    {
        require(_contractAddress != address(0), "Invalid contract address");
        AssetClassTokenAddress = _contractAddress;
        AssetClassTokenContract = AssetClassTokenInterface(_contractAddress);
    }

    function OO_setAssetTokenAddress(address _contractAddress)
        external
        onlyOwner
    {
        require(_contractAddress != address(0), "Invalid contract address");
        AssetTokenAddress = _contractAddress;
        AssetTokenContract = AssetTokenInterface(_contractAddress);
    }

    function OO_TX_asset_Token(address _to, bytes32 _idxHash)
        external
        virtual
        onlyOwner
    {
        AssetTokenContract.transferAssetToken(address(this), _to, _idxHash);
    }

    function OO_TX_AC_Token(address _to, bytes32 _idxHash)
        external
        virtual
        onlyOwner
    {
        AssetClassTokenContract.transferAssetClassToken(
            address(this),
            _to,
            _idxHash
        );
    }

    // function OO_setMinterAddress(address _contractAddress)
    //     external
    //     onlyOwner
    // {
    //     require(_contractAddress != address(0), "Invalid contract address");
    //     minterContractAddress = _contractAddress;
    // }
    /*
     * @dev Set storage contract to interface with
     */
    function OO_setStorageContract(address _storageAddress) external onlyOwner {
        require(
            _storageAddress != address(0),
            "ADMIN: storage address cannot be zero"
        );

        Storage = StorageInterface(_storageAddress);
    }

    /*
     * @dev Set wallet for contract to direct payments to
     */

    function OO_setMainWallet(address _addr) external onlyOwner {
        mainWallet = _addr;
    }

    /*
     * @dev Authorize / Deauthorize / Authorize users for an address be permitted to make record modifications
     * ----------------INSECURE -- keccak256 of address must be generated clientside in release.
     */
    function OO_addUser(
        address _authAddr,
        uint8 _userType,
        uint16 _authorizedAssetClass
    ) external onlyOwner {
        require(
            (_userType == 0) ||
                (_userType == 1) ||
                (_userType == 9) ||
                (_userType == 99),
            "ST:OO-AU-ERR:Invalid user type"
        );

        bytes32 hash;
        hash = keccak256(abi.encodePacked(_authAddr));

        emit REPORT("Internal user database access!"); //report access to the internal user database
        registeredUsers[hash].userType = _userType;
        registeredUsers[hash].authorizedAssetClass = _authorizedAssetClass;
    }

    //--------------------------------------External functions--------------------------------------------//

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /*
     * @dev Wrapper for newRecord
     */
    function $newRecord(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        uint16 _assetClass,
        uint256 _countDownStart,
        bytes32 _Ipfs
    ) external payable isAuthorized {
        User memory callingUser = getUser();
        Costs memory cost = getCost(_assetClass);

        require(
            callingUser.userType == 1,
            "NR: User not authorized to create records"
        );
        require(
            callingUser.authorizedAssetClass == _assetClass,
            "NR: User not authorized to create records in specified asset class"
        );
        require(_rgtHash != 0, "NR: rights holder cannot be zero");
        require(
            msg.value >= cost.newRecordCost,
            "NR: tx value too low. Send more eth."
        );

        bytes32 userHash = keccak256(abi.encodePacked(msg.sender));

        Storage.newRecord(
            userHash,
            _idxHash,
            _rgtHash,
            _assetClass,
            _countDownStart,
            _Ipfs
        );

        deductPayment(cost.newRecordCost);
    }

    /*
     * @dev Modify **Record**.rightsHolder without confirmation required
     */
    function $forceModRecord(bytes32 _idxHash, bytes32 _rgtHash)
        external
        payable
        isAuthorized
        returns (uint8)
    {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        Costs memory cost = getCost(rec.assetClass);

        require(
            callingUser.userType == 1,
            "FMR: User not authorized to force modify records"
        );
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "FMR: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "FMR: Record does not exist");
        require(_rgtHash != 0, "FMR: rights holder cannot be zero");
        require(
            (rec.assetStatus != 3) &&
                (rec.assetStatus != 4) &&
                (rec.assetStatus != 9) &&
                (rec.assetStatus != 10),
            "FMR: Cannot modify asset in lost or stolen status"
        );
        require(
            (rec.assetStatus != 6) && (rec.assetStatus != 12),
            "FMR: Cannot modify asset in Escrow"
        );
        require(
            (rec.assetStatus != 5),
            "FMR:ERR-Cannot change status of asset in transferred status."
        );
        require(rec.assetStatus < 200, "FMR: Record locked");
        require(
            msg.value >= cost.forceModifyCost,
            "FMR: tx value too low. Send more eth."
        );

        if (rec.forceModCount < 255) {
            rec.forceModCount++;
        }

        rec.assetStatus = 0;
        rec.rightsHolder = _rgtHash;

        writeRecord(_idxHash, rec);

        deductPayment(cost.forceModifyCost);

        return rec.forceModCount;
    }

    /*
     * @dev Reimport **Record**.rightsHolder (no confirmation required -
     * posessor is considered to be owner). sets rec.assetStatus to 0.
     */
    function $reimportRecord(bytes32 _idxHash, bytes32 _rgtHash)
        external
        payable
        isAuthorized
        returns (uint8)
    {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        Costs memory cost = getCost(rec.assetClass);

        require(
            callingUser.userType == 1,
            "RR: User not authorized to reimport assets"
        );
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "RR: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "RR: Record does not exist");
        require(
            rec.assetStatus == 5,
            "RR: Only status 5 assets can be reimported"
        );
        require(rec.assetStatus < 200, "RR: Record locked");
        require(
            msg.value >= cost.reMintRecordCost,
            "RR: tx value too low. Send more eth."
        );

        rec.assetStatus = 0;
        rec.rightsHolder = _rgtHash;

        writeRecord(_idxHash, rec);

        deductPayment(cost.reMintRecordCost);

        return rec.assetStatus;
    }

    /*
     * @dev Modify **Record**.assetStatus with confirmation required
     */
    function _modStatus(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        uint8 _newAssetStatus
    ) external isAuthorized returns (uint8) {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "MS: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "MS: Record does not exist");
        require(_newAssetStatus < 200, "MS: user cannot set status > 199");
        require(
            (rec.assetStatus != 6) && (rec.assetStatus != 6),
            "MS: Cannot change status of asset in Escrow"
        );
        require(
            (rec.assetStatus != 5),
            "MS:ERR-Cannot change status of asset in transferred status."
        );
        require(rec.assetStatus < 200, "MS: Record locked");
        require(
            rec.rightsHolder == _rgtHash,
            "MS: ERR-Rightsholder does not match supplied data"
        );

        rec.assetStatus = _newAssetStatus;

        writeRecord(_idxHash, rec);

        return rec.assetStatus;
    }

    /*
     * @dev set **Record**.assetStatus to lost or stolen, with confirmation required.
     */
    function _setLostOrStolen(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        uint8 _newAssetStatus
    ) external isAuthorized returns (uint8) {
        Record memory rec = getRecord(_idxHash);
        rec.assetStatus = _newAssetStatus;
        User memory callingUser = getUser();
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "MS: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "MS: Record does not exist");
        require(
            (_newAssetStatus == 3) ||
                (_newAssetStatus == 4) ||
                (_newAssetStatus == 9) ||
                (_newAssetStatus == 10),
            "SS:ERR-Must set to a lost or stolen status"
        );
        require(
            (rec.assetStatus != 5),
            "SS:ERR-Transferred asset cannot be set to lost or stolen after transfer."
        );
        require(rec.assetStatus < 200, "RR: Record locked");
        require(
            rec.rightsHolder == _rgtHash,
            "MS: ERR-Rightsholder does not match supplied data"
        );

        bytes32 userHash = keccak256(abi.encodePacked(msg.sender));

        Storage.setStolenOrLost(userHash, _idxHash, rec.assetStatus);

        return rec.assetStatus;
    }

    /*
     * @dev Decrement **Record**.countdown with confirmation required
     */
    function _decCounter(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        uint256 _decAmount
    ) external isAuthorized returns (uint256) {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "DC: User not authorized to modify records in specified asset class"
        );
        require( //------------------------------------------should the counter still work when an asset is in escrow?
            (rec.assetStatus != 6) && (rec.assetStatus != 6), //If so, it must not erase the recorder, or escrow termination will be broken!
            "DC: Cannot modify asset in Escrow"
        );
        require((rec.rightsHolder != 0), "DC: Record does not exist");
        require(_decAmount > 0, "DC: cannot decrement by negative number");
        require(rec.assetStatus < 200, "DC: Record locked");
        require(
            rec.rightsHolder == _rgtHash,
            "DC: Rightsholder does not match supplied data"
        );

        if (rec.countDown > _decAmount) {
            rec.countDown = rec.countDown.sub(_decAmount);
        } else {
            rec.countDown = 0;
        }

        writeRecord(_idxHash, rec);
        return (rec.countDown);
    }

    /*
     * @dev Transfer Rights to new rightsHolder with confirmation
     */
    function $transferAsset(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        bytes32 _newrgtHash
    ) external payable isAuthorized returns (uint8) {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        Costs memory cost = getCost(rec.assetClass);
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "TA: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "MS: Record does not exist");
        require(_newrgtHash != 0, "TA:ERR-new Rightsholder cannot be blank");
        require( //-------------------------------------Should an asset in escrow be transferrable?
            ((rec.assetStatus != 6) && (rec.assetStatus != 6)), //Should it be contingent on the original recorder address?
            "MS: Cannot transfer asset in Escrow" //If so, it must not erase the recorder, or escrow termination will be broken!
        );
        require(
            (rec.assetStatus == 1) || (rec.assetStatus == 7),
            "TA:ERR--Asset assetStatus is not transferrable"
        );
        require(rec.assetStatus < 200, "RR: Record locked");
        require(
            rec.rightsHolder == _rgtHash,
            "TA:ERR-Rightsholder does not match supplied data"
        );
        require(
            msg.value >= cost.transferAssetCost,
            "TA: tx value too low. Send more eth."
        );

        rec.rightsHolder = _newrgtHash;

        writeRecord(_idxHash, rec);

        deductPayment(cost.transferAssetCost);

        return (170);
    }

    /*
     * @dev Modify **Record**.Ipfs1 with confirmation
     */
    function _modIpfs1(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        bytes32 _IpfsHash
    ) external isAuthorized returns (bytes32) {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        //Costs memory cost = getCost(rec.assetClass);

        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "MI1: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "MI1: Record does not exist");
        require(rec.Ipfs1 != _IpfsHash, "MI1:ERR--New data same as old");
        require( //-------------------------------------Should an asset in escrow be modifiable?
            ((rec.assetStatus != 6) && (rec.assetStatus != 6)), //Should it be contingent on the original recorder address?
            "MI1: Cannot modify asset in Escrow" //If so, it must not erase the recorder, or escrow termination will be broken!
        );
        require(rec.assetStatus < 200, "MI1: Record locked");
        require(
            rec.rightsHolder == _rgtHash,
            "MI1:ERR--Rightsholder does not match supplied data"
        );

        rec.Ipfs1 = _IpfsHash;

        writeRecordIpfs(_idxHash, rec);

        return rec.Ipfs1;
    }

    /*
     * @dev Modify **Record**.Ipfs2 with confirmation
     */
    function $addIpfs2Note(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        bytes32 _IpfsHash
    ) external payable isAuthorized returns (bytes32) {
        Record memory rec = getRecord(_idxHash);
        User memory callingUser = getUser();
        Costs memory cost = getCost(rec.assetClass);
        require(
            callingUser.authorizedAssetClass == rec.assetClass,
            "MI2:ERR--MI1: User not authorized to modify records in specified asset class"
        );
        require((rec.rightsHolder != 0), "MI1: Record does not exist");
        require( //-------------------------------------Should an asset in escrow be modifiable?
            ((rec.assetStatus != 6) && (rec.assetStatus != 6)), //Should it be contingent on the original recorder address?
            "MI1: Cannot modify asset in Escrow" //If so, it must not erase the recorder, or escrow termination will be broken!
        );
        require(rec.assetStatus < 200, "MI1: Record locked");
        require(
            rec.Ipfs2 == 0,
            "MI2:ERR--Ipfs2 has data already. Overwrite not permitted"
        );
        require(
            rec.rightsHolder == _rgtHash,
            "MI2:ERR--Rightsholder does not match supplied data"
        );
        require(
            msg.value >= cost.createNoteCost,
            "MI2:ERR--tx value too low. Send more eth."
        );

        rec.Ipfs2 = _IpfsHash;

        writeRecordIpfs(_idxHash, rec);

        deductPayment(cost.createNoteCost);

        return rec.Ipfs2;
    }

    //--------------------------------------------------------------------------------------Private functions
    /*
     * @dev Get a User Record from Storage @ msg.sender
     */
    function getUser() private view returns (User memory) {
        //User memory callingUser = getUser();
        User memory user;
        user = registeredUsers[keccak256(abi.encodePacked(msg.sender))];
        return user;
    }

    //--------------------------------------------------------------------------------------Storage Reading private functions
    /*
     * @dev Get a Record from Storage @ idxHash
     */
    function getRecord(bytes32 _idxHash) private returns (Record memory) {
        Record memory rec;

        {
            //Start of scope limit for stack depth
            (
                bytes32 _recorder,
                bytes32 _rightsHolder,
                bytes32 _lastRecorder,
                uint8 _assetStatus,
                uint8 _forceModCount,
                uint16 _assetClass,
                uint256 _countDown,
                uint256 _countDownStart,
                bytes32 _Ipfs1,
                bytes32 _Ipfs2
            ) = Storage.retrieveRecord(_idxHash); // Get record from storage contract

            rec.recorder = _recorder;
            rec.rightsHolder = _rightsHolder;
            rec.lastRecorder = _lastRecorder;
            rec.assetStatus = _assetStatus;
            rec.forceModCount = _forceModCount;
            rec.assetClass = _assetClass;
            rec.countDown = _countDown;
            rec.countDownStart = _countDownStart;
            rec.Ipfs1 = _Ipfs1;
            rec.Ipfs2 = _Ipfs2;
        } //end of scope limit for stack depth

        return (rec); // Returns Record struct rec
    }

    /*
     * @dev retrieves costs from Storage and returns Costs struct
     */
    function getCost(uint16 _class) private returns (Costs memory) {
        Costs memory cost;
        (
            cost.newRecordCost,
            cost.transferAssetCost,
            cost.createNoteCost,
            cost.reMintRecordCost,
            cost.changeStatusCost,
            cost.forceModifyCost
        ) = Storage.retrieveCosts(_class);

        return (cost);
    }

    //--------------------------------------------------------------------------------------Storage Writing private functions

    /*
     * @dev Write an Ipfs Record to Storage @ idxHash
     */
    function writeRecordIpfs(bytes32 _idxHash, Record memory _rec) private {
        bytes32 userHash = keccak256(abi.encodePacked(msg.sender)); // Get a userhash for authentication and recorder logging

        Storage.modifyIpfs(userHash, _idxHash, _rec.Ipfs1, _rec.Ipfs2); // Send data to storage
    }

    /*
     * @dev Write a Record to Storage @ idxHash
     */
    function writeRecord(bytes32 _idxHash, Record memory _rec) private {
        bytes32 userHash = keccak256(abi.encodePacked(msg.sender)); // Get a userhash for authentication and recorder logging

        Storage.modifyRecord(
            userHash,
            _idxHash,
            _rec.rightsHolder,
            _rec.assetStatus,
            _rec.countDown,
            _rec.forceModCount
        ); // Send data and writehash to storage
    }

    /*--------------------------------------------------------------------------------------PAYMENT FUNCTIONS
     * @dev Deducts payment from transaction
     */
    function deductPayment(uint256 _amount) private {
        uint256 messageValue = msg.value;
        uint256 change;

        change = messageValue.sub(_amount);

        _asyncTransfer(mainWallet, _amount);
        _asyncTransfer(msg.sender, change);
    }

    /*
     * @dev Withdraws user's Escrow amount
     */
    function $withdraw() external virtual payable {
        withdrawPayments(msg.sender);
    }
}