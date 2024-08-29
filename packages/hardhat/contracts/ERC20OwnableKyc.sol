// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./ERC20FactoryKyc.sol";
import "./ERC20Ownable.sol";

interface IKYC {
	function isKYC(address _address) external view returns (bool);
}

interface ISanctions {
	function isSanctionsSafe(address _account) external view returns (bool);
}

contract ERC20OwnableKyc is ERC20Ownable {
	// State variables for whitelist and KYC/sanctions checks
	mapping(address => bool) private whitelist;
	bool public whitelistEnabled = false;
	bool public kycCheckEnabled = false;
	bool public sanctionsCheckEnabled = false;
	address public kycContract;

	// Events for whitelist and KYC/sanctions checks
	event WhitelistUpdated(address indexed account, bool isWhitelisted);
	event WhitelistStatusChanged(bool isEnabled);
	event KYCCheckStatusChanged(bool isEnabled);
	event SanctionsCheckStatusChanged(bool isEnabled);
	event KYCContractSet(address kycContract_);

	constructor(
		string memory name_,
		string memory symbol_,
		address owner_,
		address factory_,
		address linkedNFT_,
		uint256 linkedNFTId_,
		address[] memory membersToFund,
		uint256[] memory amountsToFund,
		address kycContract_,
		address sanctionsContract_
	)
		ERC20Ownable(
			name_,
			symbol_,
			owner_,
			factory_,
			linkedNFT_,
			linkedNFTId_,
			membersToFund,
			amountsToFund
		)
	{
		kycContract = kycContract_;
	}

	// Function to update the whitelist
	function updateWhitelist(
		address account,
		bool isWhitelisted
	) external onlyOwner {
		whitelist[account] = isWhitelisted;
		emit WhitelistUpdated(account, isWhitelisted);
	}

	// Function to enable/disable the whitelist
	function toggleWhitelist(bool enabled) external onlyOwner {
		whitelistEnabled = enabled;
		emit WhitelistStatusChanged(enabled);
	}

	// Function to enable/disable KYC checks
	function toggleKYCCheck(bool enabled) external onlyOwner {
		kycCheckEnabled = enabled;
		emit KYCCheckStatusChanged(enabled);
	}

	// Function to enable/disable sanctions checks
	function toggleSanctionsCheck(bool enabled) external onlyOwner {
		sanctionsCheckEnabled = enabled;
		emit SanctionsCheckStatusChanged(enabled);
	}

	function setKYCContract(address kycContract_) external onlyOwner {
		kycContract = kycContract_;
		emit KYCContractSet(kycContract_);
	}

	function _transferOwnership(address newOwner) internal override {
		address oldOwner = owner();
		super._transferOwnership(newOwner);
		// Check if the factory address is defined and not an empty address
		if (factory != address(0)) {
			ERC20FactoryKyc(factory).notifyOwnershipChange(oldOwner, newOwner);
		}
		emit OwnershipTransferred(oldOwner, newOwner);
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 amount
	) internal override {
		super._beforeTokenTransfer(from, to, amount);

		// Check whitelist
		if (whitelistEnabled) {
			require(whitelist[to], "Recipient is not whitelisted");
		}

		// Check KYC
		if (kycCheckEnabled) {
			require(
				IKYC(kycContract).isKYC(to),
				"Recipient has not passed KYC"
			);
		}

		// Check sanctions
		if (sanctionsCheckEnabled) {
			require(
				ISanctions(kycContract).isSanctionsSafe(to),
				"Recipient is sanctioned"
			);
		}
	}
}
