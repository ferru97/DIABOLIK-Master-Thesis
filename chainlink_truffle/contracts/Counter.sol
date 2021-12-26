pragma solidity ^0.7.1;


contract Counter {

    uint256 public count;

    function update( uint a)
    public
    returns(uint)
    {
        count += a;
    }
}
/*
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "a",
        "type": "uint256"
    }
    ],
    "name": "update",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}*/