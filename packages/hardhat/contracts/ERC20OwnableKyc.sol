// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./ERC20Ownable.sol";

interface IKintoKYC {
	function isKYC(address user) external view returns (bool);
	function isSanctionsSafe(address user) external view returns (bool);
}

contract ERC20OwnableKyc is ERC20Ownable {
	// State variables for whitelist and KYC/sanctions checks
	mapping(address => bool) private whitelist;
	bool public whitelistEnabled = false;
	bool public kycCheckEnabled = false;
	address public kycContract = 0x33F28C3a636B38683a38987100723f2e2d3d038e;

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
		uint256[] memory amountsToFund
	) ERC20Ownable(name_, symbol_, owner_, factory_, linkedNFT_, linkedNFTId_, membersToFund, amountsToFund) {}

	// Function to update the whitelist
	function updateWhitelist(address account, bool isWhitelisted) external onlyOwner {
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

	function setKYCContract(address kycContract_) external onlyOwner {
		kycContract = kycContract_;
		emit KYCContractSet(kycContract_);
	}

	function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
		super._beforeTokenTransfer(from, to, amount);

		// Check whitelist
		if (whitelistEnabled) {
			require(whitelist[to], "Recipient is not whitelisted");
		}

		// Check KYC
		if (kycCheckEnabled) {
			require(
				IKintoKYC(kycContract).isKYC(to) && IKintoKYC(kycContract).isSanctionsSafe(to),
				"Recipient has not passed KYC"
			);
		}
	}
}
