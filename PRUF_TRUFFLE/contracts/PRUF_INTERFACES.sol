/*-----------------------------------------------------------V0.6.8
__/\\\\\\\\\\\\\ _____/\\\\\\\\\ _______/\\../\\ ___/\\\\\\\\\\\\\\\
 _\/\\\/////////\\\ _/\\\///////\\\ ____\//..\//____\/\\\///////////__
  _\/\\\.......\/\\\.\/\\\.....\/\\\ ________________\/\\\ ____________
   _\/\\\\\\\\\\\\\/__\/\\\\\\\\\\\/_____/\\\____/\\\.\/\\\\\\\\\\\ ____
    _\/\\\/////////____\/\\\//////\\\ ___\/\\\___\/\\\.\/\\\///////______
     _\/\\\ ____________\/\\\ ___\//\\\ __\/\\\___\/\\\.\/\\\ ____________
      _\/\\\ ____________\/\\\ ____\//\\\ _\/\\\___\/\\\.\/\\\ ____________
       _\/\\\ ____________\/\\\ _____\//\\\.\//\\\\\\\\\ _\/\\\ ____________
        _\/// _____________\/// _______\/// __\///////// __\/// _____________
         *-------------------------------------------------------------------*/

/*-----------------------------------------------------------------
 *  TO DO
 *
 *---------------------------------------------------------------*/

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.7;

interface PRUF_TKN_Interface {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
}

interface AC_TKN_Interface {
    function ownerOf(uint256 tokenId)
        external
        view
        returns (address tokenHolderAdress);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function mintACToken(
        address _recipientAddress,
        uint256 _tokenId,
        string calldata _tokenURI
    ) external returns (uint256 tokenId);

    function reMintACToken(
        address _recipientAddress,
        uint256 _tokenId,
        string calldata _tokenURI
    ) external returns (uint256 tokenId);

    function name() external view returns (string memory tokenName);

    function symbol() external view returns (string memory tokenSymbol);

    function tokenURI(uint256 tokenId)
        external
        view
        returns (string memory URI);
}

interface A_TKN_Interface {
    function ownerOf(uint256 tokenId)
        external
        returns (address tokenHolderAdress);

    function discard(uint256 tokenId) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function mintAssetToken(
        address _recipientAddress,
        uint256 _tokenId,
        string calldata _tokenURI
    ) external returns (uint256 tokenId);

    function reMintAssetToken(address _recipientAddress, uint256 _tokenId)
        external
        returns (uint256 tokenId);

    function validateNakedToken(  //throws if authcode does not match
        uint256 tokenId,
        uint32 _assetClass,
        string calldata _authCode
    ) external;

    function tokenExists(uint256 tokenId)
        external
        returns (uint8 uint8_Bool_type_0_170);

    function name() external view returns (string memory tokenName);

    function symbol() external view returns (string memory tokenSymbol);

    function setURI(uint256 tokenId, string memory _tokenURI) external;
}

interface ID_TKN_Interface {
    function ownerOf(uint256 tokenId)
        external
        returns (address tokenHolderAdress);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function mintPRUF_IDToken(
        address _recipientAddress,
        uint256 _tokenId,
        string calldata _tokenURI
    ) external returns (uint256 tokenId);

    function reMintPRUF_IDToken(address _recipientAddress, uint256 _tokenId)
        external
        returns (uint256 tokenId);

    function tokenExists(uint256 tokenId)
        external
        returns (uint8 uint8_Bool_type_0_170);

    function name() external view returns (string memory tokenName);

    function symbol() external view returns (string memory tokenSymbol);

    function setURI(uint256 tokenId, string memory _tokenURI) external;

    function balanceOf(address owner) external view returns (uint256 balance);
}

interface AC_MGR_Interface {
    function getUserType(bytes32 _userHash, uint32 _assetClass)
        external
        view
        returns (uint8 userTypeInAssetClass);

    function getAC_data(uint32 _assetClass)
        external
        returns (
            uint32 assetClassRoot,
            uint8 custodyType,
            uint32 discount,
            uint32 extendedData
        );

    function getAC_discount(uint32 _assetClass)
        external
        returns (
            uint256
        );
    
    function increasePriceShare(uint32 _assetClass, uint256 _increaseAmount)
        external;

    function isSameRootAC(uint32 _assetClass1, uint32 _assetClass2)
        external
        returns (uint8 uint8_Bool_type_0_170);

    function getAC_name(uint32 _tokenId)
        external
        view
        returns (string memory ACname);

    function resolveAssetClass(string calldata _name)
        external
        returns (uint32 assetClass);

    function ContractAC_auth(uint32 _assetClass, bytes32 _authContractNameHash)
        external
        returns (uint8 contractTypeInAssetClass);

    function retrieveCosts(uint32 _assetClass, uint16 _service)
        external
        returns (
            uint256 serviceCost,
            address paymentAddress
        );

    function getServiceCosts(uint32 _assetClass, uint16 _service)
        external
        returns (
            address,
            uint256,
            address,
            uint256
        );

}


interface STOR_Interface {
    function newRecord(
        bytes32 _idxHash,
        bytes32 _rgt,
        uint32 _assetClass,
        uint32 _countDownStart
    ) external;

    function modifyRecord(
        bytes32 _idxHash,
        bytes32 _rgtHash,
        uint8 _assetStatus,
        uint32 _countDown,
        uint256 _incrementForceCount,
        uint256 _incrementNumberOfTransfers
    ) external;

    function changeAC(bytes32 _idxHash, uint32 _newAssetClass) external;

    function setEscrow(bytes32 _idxHash, uint8 _newAssetStatus) external;

    function endEscrow(bytes32 _idxHash) external;

    function setStolenOrLost(bytes32 _idxHash, uint8 _newAssetStatus) external;

    function modifyIpfs1(bytes32 _idxHash, bytes32 _Ipfs1) external;

    function modifyIpfs2(bytes32 _idxHash, bytes32 _Ipfs2) external;

    function retrieveRecord(bytes32 _idxHash)
        external
        returns (
            bytes32 rightsHolder,
            uint8 assetStatus,
            uint32 assetClass,
            uint32 countDown,
            uint32 countDownStart,
            bytes32 Ipfs1,
            bytes32 Ipfs2
        );

    function resolveContractAddress(string calldata _name)
        external
        returns (address addressOfNamedContract);

    function ContractInfoHash(address _addr, uint32 _assetClass)
        external
        returns (uint8 contractTypeInAssetClass, bytes32 hashOfContractName);
}

interface ECR_MGR_Interface {
    function setEscrow(
        bytes32 _idxHash,
        uint8 _newAssetStatus,
        bytes32 _escrowOwnerAddressHash,
        uint256 _timelock
    ) external;

    function endEscrow(bytes32 _idxHash) external;

    function permissiveEndEscrow(bytes32 _idxHash) external;

    function retrieveEscrowOwner(bytes32 _idxHash)
        external
        returns (bytes32 hashOfEscrowOwnerAdress);

    function retrieveEscrowData(bytes32 _idxHash)
        external
        returns (
            bytes32 controllingContractNameHash,
            bytes32 escrowOwnerAddressHash,
            uint256 timelock
        );

    function retrieveEscrowDataLight(bytes32 _idxHash)
        external
        view
        returns (
        uint8 _escrowData,
        uint8 _u8_1,
        uint8 _u8_2,
        uint8 _u8_3,
        uint16 _u16_1,
        uint16 _u16_2,
        uint32 _u32_1,
        address _addr_1
    );

    function retrieveEscrowDataHeavy(bytes32 _idxHash)
        external
        view
        returns (
            uint32 _u32_2,
            uint32 _u32_3,
            uint32 _u32_4,
            address _addr_2,
            bytes32 _b32_1,
            bytes32 _b32_2,
            uint256 _u256_1,
            uint256 _u256_2
    );

    function setEscrowDataLight(
        bytes32 _idxHash,
        uint8 _escrowData,
        uint8 _u8_1,
        uint8 _u8_2,
        uint8 _u8_3,
        uint16 _u16_1,
        uint16 _u16_2,
        uint32 _u32_1,
        address _addr_1) 
    external;

    function setEscrowDataHeavy(
        bytes32 _idxHash,
        uint32 _u32_2,
        uint32 _u32_3,
        uint32 _u32_4,
        address _addr_2,
        bytes32 _b32_1,
        bytes32 _b32_2,
        uint256 _u256_1,
        uint256 _u256_2) 
    external;
}

interface RCLR_Interface {
    function discard(bytes32 _idxHash) external;

    function recycle(bytes32 _idxHash) external;
}

interface APP_Interface {
    function transferAssetToken(address _to, bytes32 _idxHash) external;
}
