//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract syncdata {
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

    struct CouponDetails {
        string code;
        uint256 value;
        uint expiryTime;
    }

    uint[] public sellingFileId;
    Record[] public records;

    constructor() payable {}

    address[] temp = new address[](0);
    address[] demo = new address[](0);
    uint256 totalEtherReceived;

    mapping(uint256 => CouponDetails) public coupons;
    mapping(address => uint[]) accessList;
    mapping(address => uint[]) createdBy;
    mapping(address => mapping(uint => bool)) isBought;
    mapping(address => mapping(uint => bool)) isDeposited;
    mapping(uint => address[]) txnDetails;

    event CouponGenerated(string code, uint256 value, uint256 expiryTime);
    event CouponRedeemed(string code, address user, uint256 redeemedTime);

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

    function sellTheFile(uint id, string memory preview, uint price) external {
        require(id < records.length, "give file id is invalid");
        require(
            records[id].owner == msg.sender,
            "you are not owner of this file"
        );
        require(
            records[id].price == 0,
            "you are already added this file to sell"
        );
        isBought[msg.sender][id] = true; // owner already own this file SO we can say he already bought this file and it is neccecary so don't remove it

        // records[id].accessibleBy.pop(); // now owner does not have contro of this file [MEANS:-any one can buy this image and see it owner can't restrict them]
        sellingFileId.push(id);
        records[id].preview = preview;
        records[id].price = price;
    }

    function getOwnersRecords() public view returns (Record[] memory){  
        Record[] memory tempRecords = new Record[](
            createdBy[msg.sender].length
        );
        for(uint i=0;i<createdBy[msg.sender].length;i++){
            tempRecords[i] = records[createdBy[msg.sender][i]];
        }
        return tempRecords;
    }

    function buyFileId(uint id) public payable {
        require(id < records.length, "give file id is invalid");
        for (uint i = 0; i < sellingFileId.length; i++) {
            if (id == sellingFileId[i]) {
                if (isBought[msg.sender][id]) {
                    require(false, "you already bought this file");
                } else {
                    require(
                        msg.sender.balance >= records[id].price,
                        "Insufficient balance"
                    );
                    (payable(records[id].owner)).transfer(msg.value);
                    isBought[msg.sender][id] = true;
                    records[id].accessibleBy.push(msg.sender);
                    accessList[msg.sender].push(id);
                    return;
                }
            }
        }
    }

    function giveContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function addToContractBalance() public payable {
        // Transfer the amount of ether sent with the transaction to the contract address
        address payable contractAddress = payable(address(this));
        contractAddress.transfer(msg.value);
    }

    function getSellingRecord() public view returns (Record[] memory) {
        uint cnt = 0;
        for (uint i = 0; i < sellingFileId.length; i++) {
            if (false == isBought[msg.sender][sellingFileId[i]]) {
                cnt += 1;
            }
        }
        Record[] memory tempRecords = new Record[](cnt);
        uint j = 0;
        for (uint i = 0; i < sellingFileId.length; i++) {
            if (false == isBought[msg.sender][sellingFileId[i]]) {
                tempRecords[j++] = records[sellingFileId[i]];
            }
        }
        return tempRecords;
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
        if (false == isAccessible && 0 != tempRecord.price)
            isAccessible = isBought[msg.sender][_id];
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

    function generateCoupon(
        uint256 id,
        string memory code,
        uint256 value,
        uint256 expiryTime
    ) public returns (string memory) {
        // require(coupons[id].expiryTime == 0, "Coupon code already exists");
        expiryTime = block.timestamp + 3600;
        
        coupons[id] = CouponDetails(code, value, expiryTime);
        emit CouponGenerated(code, value, expiryTime);
        return code;
    }
    function redeemCoupon(uint256 id, string memory code) public {
        // require(
        //     coupons[id].expiryTime < block.timestamp,
        //     "Coupon code has expired"
        // );
        if (coupons[id].expiryTime > block.timestamp) {
            isBought[msg.sender][id] = true;
            records[id].accessibleBy.push(msg.sender);
            accessList[msg.sender].push(id);
            uint256 redeemedTime = block.timestamp;
            delete coupons[id];
            emit CouponRedeemed(code, msg.sender, redeemedTime);
        }
    }
}
