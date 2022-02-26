// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract DeChat {

    address owner;

    mapping(address => string) addressToUsername;
    mapping(address => address[]) addressToRoom;
    mapping(address => address) allRooms;

    constructor() {
        owner = msg.sender;
    }

    function createRoom() external {
        address room_id = address(bytes20(sha256(abi.encodePacked(msg.sender,block.timestamp))));
        addressToRoom[msg.sender].push(room_id);
        allRooms[room_id] = room_id;
    }

    function getOwnRooms(address _address) external view returns (address[] memory) {
        return addressToRoom[_address];
    }

    function checkRoom(address _address) external view returns (bool) {
        if (allRooms[_address] == _address) {
            return true;
        } else {
            return false;
        }
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