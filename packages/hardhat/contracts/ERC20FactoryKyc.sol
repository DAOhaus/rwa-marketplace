// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC20OwnableKyc.sol";
import "./ERC20Factory.sol";

contract ERC20FactoryKyc is ERC20Factory {
	constructor(string memory _name) ERC20Factory(_name) {}

	function createToken(
		string memory name_,
		string memory symbol_,
		address tokenOwner_,
		address associatedNFT_,
		uint256 associatedNFTId_,
		address[] memory membersToFund,
		uint256[] memory amountsToFund
	) external override returns (address) {
		ERC20OwnableKyc token = new ERC20OwnableKyc(
			name_,
			symbol_,
			tokenOwner_,
			address(this),
			associatedNFT_,
			associatedNFTId_,
			membersToFund,
			amountsToFund
		);

		tokensByOwner[tokenOwner_].push(address(token));
		allTokens.push(address(token));

		emit TokenCreated(tokenOwner_, address(token));
		return address(token);
	}
}
