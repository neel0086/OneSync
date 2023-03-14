//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract meddata {
    struct Record {
        uint256 id;
        string title;
        string description;
        bool islisted;
        string imageURL;
        address owner;
        address[] accessibleBy;
        uint256 timestamp;
        uint price;
        string preview;
    }

    constructor() payable {}

    Record[] public records;

    mapping(address => uint[]) accessList;
    mapping(address => uint[]) createdBy;

    address[] temp = new address[](0);

    function NewRrecord(
        string memory _title,
        string memory _description,
        string memory _imageURL
    ) external payable {
        accessList[msg.sender].push(records.length);
        createdBy[msg.sender].push(records.length);
        uint length = records.length;
        temp.push(msg.sender);
        records.push(
            Record({
                id: length,
                title: _title,
                description: _description,
                islisted: true,
                imageURL: _imageURL,
                owner: msg.sender,
                accessibleBy: temp,
                timestamp: block.timestamp,
                price: 0,
                preview: ""
            })
        );
        temp.pop();
    }

    function getAllRecords() public view returns (Record[] memory) {
        require(accessList[msg.sender].length > 0, "no records");

        Record[] memory tempRecords = new Record[](
            accessList[msg.sender].length
        );

        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            tempRecords[i] = (records[accessList[msg.sender][i]]);
        }

        return tempRecords;
    }

    function getOneRecord(uint256 _id) public view returns (Record memory) {
        require(_id < records.length, "given file id is not exists");
        Record memory tempRecord = records[_id]; // will it going to create copy or referecnce

        bool isAccessible = false;

        for (uint i = 0; i < records[_id].accessibleBy.length; i++) {
            if (records[_id].accessibleBy[i] == msg.sender) {
                isAccessible = true;
            }
        }
        require(isAccessible, "you don't have access to this file");
        return tempRecord;
    }

    function newOwner(address _newOwner, uint id) external {
        require(id < records.length, "give file id is invalid");
        require(
            msg.sender == records[id].owner,
            "you are not owner of this file"
        );
        require(
            _newOwner != records[id].owner,
            "as owner of this file you alread have a access"
        );

        for (uint i = 0; i < accessList[_newOwner].length; i++) {
            if (id == accessList[_newOwner][i]) {
                require(
                    false,
                    "this address already have a access to this file"
                );
            }
        }
        accessList[_newOwner].push(id);
        records[id].accessibleBy.push(_newOwner);
    }

    function getAccessList(uint id) public view returns (address[] memory) {
        require(id < records.length, "give file id is invalid");
        return records[id].accessibleBy;
    }

    function removeOwner(address _removeOwner, uint id) external {
        require(id < records.length, "give file id is invalid");
        require(
            msg.sender == records[id].owner,
            "you are not owner of this file"
        );
        require(
            _removeOwner != msg.sender,
            "as owner of the file and you can't remove your self from access to this file"
        );

        uint length = accessList[_removeOwner].length;
        for (uint i = 0; i < accessList[_removeOwner].length; i++) {
            if (id == accessList[_removeOwner][i]) {
                if (1 == accessList[_removeOwner].length) {
                    accessList[_removeOwner].pop();
                } else {
                    accessList[_removeOwner][i] = accessList[_removeOwner][
                        length - 1
                    ];
                    accessList[_removeOwner].pop();
                }
                uint temp_length = records[id].accessibleBy.length;
                for (uint j = 0; j < records[id].accessibleBy.length; j++) {
                    if (_removeOwner == records[id].accessibleBy[j]) {
                        records[id].accessibleBy[j] = records[id].accessibleBy[
                            temp_length - 1
                        ];
                        records[id].accessibleBy.pop();
                    }
                }
                return;
            }
        }
        require(false, "you doesn't give access to this address at all!!");
    }
}
