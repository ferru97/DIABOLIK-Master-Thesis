pragma solidity ^0.7.0;

interface ResultCallbackInterface {
  function result(address payable user, uint amount) external;
}