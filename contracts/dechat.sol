pragma solidity ^0.8.12;

contract DeChat {
    
    address owner;

    mapping(address => string) addressToUsername;

    constructor() {
        owner = msg.sender;
    }

    function createUser(string memory _name) external {
        addressToUsername[msg.sender] = _name;
    }

    function getUsernameForAddress(address _user) external view returns (string memory) {
        return addressToUsername[_user];
    }

    function kill() external {
        if (owner == msg.sender) {
            selfdestruct(payable(owner));
        }
    }
}