pragma solidity ^0.7.1;


contract Values {

    int128 public a;
    int128 public b;

    function setA(int128 v)
    public
    {
        a = v;
    }

    function setB(int128 v)
    public
    {
        b = v;
    }
}
