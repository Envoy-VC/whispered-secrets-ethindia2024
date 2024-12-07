// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {WhisperedSecrets} from "src/WhisperedSecrets.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Counter with deployer address", deployerAddress);

        WhisperedSecrets secrets = new WhisperedSecrets();

        console.log("Deployed WhisperedSecrets at address: %s", address(secrets));
        vm.stopBroadcast();
    }
}
