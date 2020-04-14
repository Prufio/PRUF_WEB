pragma solidity ^0.6.0;

import "./Ownable.sol";

contract Storage is Ownable {
   
    struct Record {
        bytes32 registrar; // Address hash of registrar 
        bytes32 registrant;  // KEK256 Registered  owner
        bytes32 lastRegistrar; //// Address hash of last non-automation registrar
        uint8 status; // Status - Transferrable, locked, in transfer, stolen, lost, etc.
        uint8 extra; // extra status for future expansion
        uint8 forceModCount; // Number of times asset has been forceModded.
        string description; // publically viewable asset description
        string note; // publically viewable immutable notes
    }
    
    
    // mapping(bytes32 => IndexReference) internal index;
    mapping(bytes32 => Record) internal database; //registry
    mapping(bytes32 => uint8) internal registeredUsers; //authorized registrar database
}