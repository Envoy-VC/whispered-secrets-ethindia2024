// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract WhisperedSecrets {
    // GameId => Votes for Killer
    mapping(string => string[]) public votes;

    event VoteForKiller(string gameId, string userId);

    constructor() {}

    function vote(string memory gameId, string memory userId) public {
        votes[gameId].push(userId);
        emit VoteForKiller(gameId, userId);
    }
}
