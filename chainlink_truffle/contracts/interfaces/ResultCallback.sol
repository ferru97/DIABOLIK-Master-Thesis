pragma solidity ^0.7.0;

interface ResultCallbackInterface {
  function result(uint64 id, bytes calldata data) external;
}