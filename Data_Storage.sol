pragma solidity ^0.6.0;
//pragma experimental ABIEncoderV2;

import "./Ownable.sol";

contract Storage is Ownable {
   
    struct Record {
        bytes32 registrar; // Address hash of registrar 
        bytes32 registrant;  // KEK256 Registered  owner
        bytes32 lastRegistrar; //// Address hash of last non-automation registrar
        uint8 status; // Status - Transferrable, locked, in transfer, stolen, lost, etc.
        uint8 forceModCount; // Number of times asset has been forceModded.
        uint16 assetClass; //Type of asset
        uint countDown; // variable that can only be dencreased from countDownStart
        uint countDownStart; //starting point for countdown variable (set once)
        bytes32 description; // publically viewable asset description
        bytes32 note; // publically viewable immutable notes
    }
    
    struct User {
        uint8 userType; // Status - Transferrable, locked, in transfer, stolen, lost, etc.
        uint16 authorizedAssetClass; // extra status for future expansion
    }
    
    struct Costs{
        uint newRecord;
        uint modStatus;
        uint transferAsset;
        uint changeDescription;
        uint decrementCountdown;
        uint forceMod;
        uint addNote;
    }
    
    /*
    * User types:
    * 1 read only
    * 2 Read & Emit Only 
    * 3 Emit Only
    * 99 read / write / Emit
    * Owner (onlyOwner)
    */
    mapping(address => uint8) internal dataStorageUsers;
    
    mapping(bytes32 => Record) internal database; //registry
    
    mapping(bytes32 => User) internal registeredUsers; //authorized registrar database
    
    mapping(uint16 => Costs) internal cost; //cost per function by asset class
    
    
    
    //--------------------------------------------------------------------------Events----------------------------------------------------------
        /*
     * @dev emit a string
     */
    event REPORT (string _msg);
    
    
    /*
     * @dev emit a record
     */
    //event EMIT_RECORD (Record record);  //use when ABIencoder V2 is ready for prime-time
    event EMIT_RECORD (bytes32, bytes32, bytes32, uint8, uint8, uint16, uint, uint, bytes32, bytes32);
    

    
    
    //--------------------------------------------internal Admin functions //onlyowner----------------------------------------------------------
    
    
    function SET_User (address _addr, uint8 _userType) public onlyOwner {
        require ( 
            ((_userType >= 0) && (_userType <= 3)) || (_userType == 99) ,
            "Invalid Usertype"
        );
        emit REPORT ("DS:SU: internal user database access!");  //report access to the internal user database
        dataStorageUsers[_addr] = _userType;
    }
    
    
    function XRETRIEVE_COSTS (uint16 _assetClass) external view returns (uint, uint, uint, uint, uint, uint, uint) {
        require (
            authContracts(1,2,99),
            "DS:rR: user not authorized"
        );

        return (cost[_assetClass].newRecord, cost[_assetClass].modStatus, cost[_assetClass].transferAsset, cost[_assetClass].changeDescription, 
                cost[_assetClass].decrementCountdown, cost[_assetClass].forceMod, cost[_assetClass].addNote );
    }
   
    /*
     * @dev Set function costs per asset class, in Wei
     */
    function _SET_costs (uint16 _assetClass, uint _newRecord, uint _modStatus, uint _transferAsset, 
                        uint _changeDescription, uint _decrementCountdown, uint _forceMod, uint _addNote) public onlyOwner {
                            
        cost[_assetClass].newRecord = _newRecord;
        cost[_assetClass].modStatus = _modStatus;
        cost[_assetClass].transferAsset = _transferAsset;
        cost[_assetClass].changeDescription = _changeDescription;
        cost[_assetClass].decrementCountdown = _decrementCountdown;
        cost[_assetClass].forceMod = _forceMod;
        cost[_assetClass].addNote = _addNote;
    }
    
    
    //----------------------------------------external contract functions  //authuser----------------------------------------------------------
    
    /*
    * implement:
    read fullHash, write note, registrars --add_note
    read fullHash, write comment, registrars --change_comment
    read fullHash, write status, registrars --change_status
    read fullHash, write registrant, registrars --transfer_asset
    read fullHash, write registrant, registrars, FMC++ --force_mod
    read fullHash, write registrant, registrars, assetClass,countDownStart --new_record
    read fullHash, write countDown, registrars, assetClass,countDownStart --Decrement_countdown
    


    /*
     * @dev emit a complete record at _idxHash
     */
    function emitRecord (bytes32 _idxHash) external returns (bool) {
        require (
            authContracts(2,3,99),
            "DS:eR: user not authorized"
        );
        
        //emit EMIT_RECORD (database[_idx]);  //use when ABIencoder V2 is ready for prime-time
        emit EMIT_RECORD (database[_idxHash].registrar, database[_idxHash].registrant, database[_idxHash].lastRegistrar, database[_idxHash].status, 
                database[_idxHash].forceModCount, database[_idxHash].assetClass, database[_idxHash].countDown, database[_idxHash].countDownStart, 
                database[_idxHash].description, database[_idxHash].note);
        return(true);
    }
    
    
    
    /*
     * @dev return a record minus description and note
     */
    function retrieveRecord (bytes32 _idxHash) external view returns (bytes32, bytes32, bytes32, uint8, uint8, uint16, uint, uint) {  
        require (
            authContracts(1,2,99),
            "DS:rR: user not authorized"
        );
        
        bytes32 idxHash = _idxHash ; //keccak256(abi.encodePacked(_idx));
        return (database[idxHash].registrar, database[idxHash].registrant, database[idxHash].lastRegistrar, database[idxHash].status, 
                database[idxHash].forceModCount, database[idxHash].assetClass, database[idxHash].countDown, database[idxHash].countDownStart);
    }
    
    
    //------------------------------------------------------------private functions-------------------------------------------------------------------
    
    /*
     * @dev check msg.sender against authorized adresses
     */
    function authContracts (uint8 _userTypeA, uint8 _userTypeB, uint8 _userTypeC) private view returns (bool) {
        if (
            (dataStorageUsers[msg.sender] == _userTypeA) ||
            (dataStorageUsers[msg.sender] == _userTypeB) || 
            (dataStorageUsers[msg.sender] == _userTypeC)){
            return (true);    
        } else {
            return(false);
        }
    }
}