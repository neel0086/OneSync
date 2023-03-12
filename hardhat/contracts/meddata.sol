//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract meddata {
    uint256 public totalRecord;

    struct Record {
        uint256 id;
        string title;
        string description;
        bool islisted;
        string imageURI;
        address[] owners;
        uint256 timestamp;
    }
    

    constructor() payable {}

    Record[] public records;
    mapping(address => uint256) setOwnership;

    address[] public temp;

    function firstOwner() public {
        temp.push(msg.sender);
        setOwnership[msg.sender] = records.length;
    }

    function NewRrecord(
        string memory _title,
        string memory _description,
        string memory _imageURI
    ) external payable {
        firstOwner();
        records.push(
            Record({
                id: block.timestamp,
                title: _title,
                description: _description,
                islisted: true,
                imageURI: _imageURI,
                owners: temp,
                timestamp: block.timestamp
            })
        );

        totalRecord += 1;
    }

    function getAllRecords() public view returns (Record[] memory) {
        require(records.length > 0, "no records");

        Record[] memory tempRecords = new Record[](records.length);

        for (uint256 i = 0; i < records.length; i++) {
            for (uint256 j = 0; j < records[i].owners.length; j++) {
                if (records[i].owners[j] == msg.sender) {
                    tempRecords[i] = records[i];
                }
            }
        }

        return tempRecords;
    }
    function getOneRecord(uint256 _id) public view returns (Record memory) {
        require(records.length > 0, "no records");
        for(uint256 i=0;i<records.length;i++){
            if(records[i].id == _id ){
                return records[i];
            }
        }
        
        
        require(true,"Record not found");
        return Record({
                id: 0,
                title: '',
                description: '',
                islisted: false,
                imageURI: '',
                owners: new address[](0),
                timestamp: 0
            });
        
    }

    function newOwner(address _newOwner) external payable {
        require(records.length > 0, "no records");
        for (uint256 i = 0; i < records.length; i++) {
            for (uint256 j = 0; j < records[i].owners.length; j++) {
                if (records[i].owners[j] == msg.sender) {
                    records[i].owners.push(_newOwner);
                    break;
                }
            }
        }
    }
    
    function removeOwner(address _removeOwner) external payable returns(Record[] memory) {
        
        require(records.length > 0, "no records");
        for (uint256 i = 0; i < records.length; i++) {
            for (uint256 j = 0; j < records[i].owners.length; j++) {
                if (
                    records[i].owners[j] == _removeOwner &&
                    records[i].owners[0] == msg.sender
                ) {
                    records[i].owners[j] = records[i].owners[
                        records[i].owners.length - 1
                    ];
                    records[i].owners.pop();
                    break;
                }
            }
        }
        return records;
    }
    
}
