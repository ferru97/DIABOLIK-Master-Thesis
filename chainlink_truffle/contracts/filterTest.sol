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


    function kek()
    public
    pure
    returns(uint128)
    {
        string memory c = "5";
        bytes16 n = bytes16(keccak256(bytes(c)));
        uint128 m = uint128(n);
        return m;
    }
}
