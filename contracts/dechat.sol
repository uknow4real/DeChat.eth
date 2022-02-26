// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract DeChat {

    address owner;

    mapping(address => string) addressToUsername;
    mapping(address => address) addressToRoom;

    constructor() {
        owner = msg.sender;
    }

    function createRoom() external {
        address room_id = address(bytes20(sha256(abi.encodePacked(msg.sender,block.timestamp))));
        addressToRoom[msg.sender] = room_id;
    }

    function getRoom(address _address) external view returns (address) {
        return addressToRoom[_address];
    }

    function createUser(string memory _name) external {
        addressToUsername[msg.sender] = _name;
    }

    function getUsername(address _user) external view returns (string memory) {
        return addressToUsername[_user];
    }

    function kill() external {
        if (owner == msg.sender) {
            selfdestruct(payable(owner));
        }
    }
}