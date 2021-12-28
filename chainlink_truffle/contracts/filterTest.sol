pragma solidity ^0.7.0;

contract Filter {
  


    function test() public view returns(int){
        int192 x = 340282366920938463463374607431768211472;
        
        int128 data = int128((x << 64)>>64);
        int64 id = int64(x >> 128);
        
        int192[3] memory arr;
        arr = [int192(340282366920938463463374607431768211472),int192(340282366920938463463374607431768211472),int192(340282366920938463463374607431768211472)];
        int found = 0;
        
        for(uint i=0; i<arr.length; i++){
            id = int64( arr[i] >> 128);
            if(id==1)
                found++;
        }
 
        return found;
    }

    function x()
    public
    view
    returns(address)
    {
        return msg.sender;
    }

    function y()
    public
    view
    returns(address)
    {
        return z();
    }

    function z()
    public
    view
    returns(address)
    {
        return msg.sender;
    }


    function kekUINT()
    public
    pure
    returns(uint128)
    {
        uint256 z = 0;
        string memory num = uint2str(z);
        bytes16 n = bytes16(keccak256(bytes(num)));
        uint128 m = uint128(n);
        return m;
    }


    function kekSTRING()
    public
    pure
    returns(uint128)
    {
        string memory c = "0";
        bytes16 n = bytes16(keccak256(bytes(c)));
        uint128 m = uint128(n);
        return m;
    }


    function toBytes(uint256 x) public pure returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
