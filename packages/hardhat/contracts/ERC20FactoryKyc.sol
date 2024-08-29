// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC20OwnableKyc.sol";
import "./ERC20Factory.sol";

contract ERC20FactoryKyc is ERC20Factory {
	event WhitelistUpdated(
		address indexed token,
		address indexed account,
		bool isWhitelisted
	);
	event WhitelistStatusChanged(address indexed token, bool isEnabled);
	event KYCCheckStatusChanged(address indexed token, bool isEnabled);
	event SanctionsCheckStatusChanged(address indexed token, bool isEnabled);
	event KYCContractSet(address indexed token, address kycContract);

	function createToken(
		string memory name_,
		string memory symbol_,
		address tokenOwner_,
		address associatedNFT_,
		uint256 associatedNFTId_,
		address[] memory membersToFund,
		uint256[] memory amountsToFund,
		address kycContract_
	) external {
		ERC20OwnableKyc token = new ERC20OwnableKyc(
			name_,
			symbol_,
			tokenOwner_,
			address(this),
			associatedNFT_,
			associatedNFTId_,
			membersToFund,
			amountsToFund,
			kycContract_
		);

		tokensByOwner[tokenOwner_].push(address(token));
		allTokens.push(address(token));

		emit TokenCreated(tokenOwner_, address(token));
	}

	// Set Whitelist for an address on the ERC20Ownable contract
	function setWhitelist(
		address token,
		address account,
		bool isWhitelisted
	) external onlyOwner {
		require(
			ERC20OwnableKyc(token).factory() == address(this),
			"Invalid token"
		);
		ERC20OwnableKyc(token).updateWhitelist(account, isWhitelisted);
		emit WhitelistUpdated(token, account, isWhitelisted);
	}

	// Toggle the whitelist functionality on/off
	function toggleWhitelist(address token, bool enabled) external onlyOwner {
		require(
			ERC20OwnableKyc(token).factory() == address(this),
			"Invalid token"
		);
		ERC20OwnableKyc(token).toggleWhitelist(enabled);
		emit WhitelistStatusChanged(token, enabled);
	}

	// Toggle the KYC check functionality on/off
	function toggleKYCCheck(address token, bool enabled) external onlyOwner {
		require(
			ERC20OwnableKyc(token).factory() == address(this),
			"Invalid token"
		);
		ERC20OwnableKyc(token).toggleKYCCheck(enabled);
		emit KYCCheckStatusChanged(token, enabled);
	}

	// Toggle the sanctions check functionality on/off
	function toggleSanctionsCheck(
		address token,
		bool enabled
	) external onlyOwner {
		require(
			ERC20OwnableKyc(token).factory() == address(this),
			"Invalid token"
		);
		ERC20OwnableKyc(token).toggleSanctionsCheck(enabled);
		emit SanctionsCheckStatusChanged(token, enabled);
	}

	// Set the KYC contract address on the ERC20Ownable contract
	function setKYCContract(
		address token,
		address kycContract
	) external onlyOwner {
		require(
			ERC20OwnableKyc(token).factory() == address(this),
			"Invalid token"
		);
		ERC20OwnableKyc(token).setKYCContract(kycContract);
		emit KYCContractSet(token, kycContract);
	}
}
