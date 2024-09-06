// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFTFactory.sol";

interface IKintoKYC {
	function isKYC(address user) external view returns (bool);
	function isSanctionsSafe(address user) external view returns (bool);
}

contract NFTFactoryKyc is NFTFactory {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	struct NFTKYCData {
		bool kycCheckEnabled;
		bool whitelistEnabled;
		address kycContract;
		mapping(address => bool) whitelist;
	}

	mapping(uint256 => NFTKYCData) public nftKycData;

	event KYCCheckEnabled(uint256 tokenId, bool enabled);
	event SanctionsCheckEnabled(uint256 tokenId, bool enabled);
	event WhitelistEnabled(uint256 tokenId, bool enabled);
	event KYCContractUpdated(uint256 tokenId, address kycContract);
	event AddressWhitelisted(uint256 tokenId, address user, bool status);

	constructor(string memory _name, string memory _symbol) NFTFactory(_name, _symbol) {}

	// Overriding the mint function to handle additional parameters and whitelist initialization
	function mint(
		address to,
		string memory tokenURI,
		address linkedToken,
		string[] memory linkedTokenInterfaces,
		bool kycCheckEnabled,
		bool whitelistEnabled,
		address kycContract,
		address[] memory whitelistAddresses // New parameter for whitelist addresses
	) public {
		require(!onlyOwnerCanMint || msg.sender == owner(), "Minting is restricted to the owner");

		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, tokenURI);

		// Initialize the struct without the mapping because of nested mapping error
		nftData[tokenId].status = "active";
		nftData[tokenId].linkedToken = linkedToken;
		nftData[tokenId].linkedTokenInterfaces = linkedTokenInterfaces;
		nftData[tokenId].locked = false;
		nftData[tokenId].paused = false;
		nftKycData[tokenId].kycCheckEnabled = kycCheckEnabled;
		nftKycData[tokenId].whitelistEnabled = whitelistEnabled;
		nftKycData[tokenId].kycContract = kycContract;

		// Update the whitelist mapping separately
		for (uint256 i = 0; i < whitelistAddresses.length; i++) {
			nftKycData[tokenId].whitelist[whitelistAddresses[i]] = true;
		}

		tokensByAddress[to].push(tokenId); // Add token to the new owner's list

		emit TokenMinted(tokenId, to);
	}

	// Callable by both owner and individual NFT holder
	function updateNFT(
		uint256 tokenId,
		string memory status,
		string memory tokenURI,
		bool kycCheckEnabled,
		bool whitelistEnabled,
		address kycContract,
		address[] memory whitelistAddresses
	) public {
		require(_exists(tokenId), "NFT does not exist");
		require(msg.sender == owner() || msg.sender == ownerOf(tokenId), "Caller is not the owner or NFT owner");
		require(!nftData[tokenId].locked, "Metadata is locked");

		if (bytes(status).length > 0) nftData[tokenId].status = status;
		if (bytes(tokenURI).length > 0) _setTokenURI(tokenId, tokenURI);

		// Set kycCheckEnabled if provided
		if (kycCheckEnabled) {
			nftKycData[tokenId].kycCheckEnabled = kycCheckEnabled;
		}

		// Set whitelistEnabled if provided
		if (whitelistEnabled) {
			nftKycData[tokenId].whitelistEnabled = whitelistEnabled;
		}

		// Set kycContract if a valid address is provided
		if (kycContract != address(0)) {
			nftKycData[tokenId].kycContract = kycContract;
		}

		// Set whitelist addresses if provided
		if (whitelistAddresses.length > 0) {
			for (uint256 i = 0; i < whitelistAddresses.length; i++) {
				nftKycData[tokenId].whitelist[whitelistAddresses[i]] = true;
			}
		}
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal virtual override whenNotPaused {
		require(!nftData[tokenId].paused, "Token is paused");

		// Check if KYC is enabled and validate with KYC contract
		if (nftKycData[tokenId].kycCheckEnabled) {
			require(
				IKintoKYC(nftKycData[tokenId].kycContract).isKYC(to) &&
					IKintoKYC(nftKycData[tokenId].kycContract).isSanctionsSafe(to),
				"Recipient has not passed KYC or is not SanctionsSafe"
			);
		}

		// Check if whitelist is enabled and the recipient is in the whitelist
		if (nftKycData[tokenId].whitelistEnabled) {
			require(nftKycData[tokenId].whitelist[to], "Recipient is not in the whitelist");
		}

		if (from != address(0)) {
			// Remove token from the previous owner's list
			uint256 index;
			uint256[] storage tokens = tokensByAddress[from];
			for (uint256 i = 0; i < tokens.length; i++) {
				if (tokens[i] == tokenId) {
					index = i;
					break;
				}
			}
			tokens[index] = tokens[tokens.length - 1];
			tokens.pop();
		}

		if (to != address(0)) {
			// Add token to the new owner's list
			tokensByAddress[to].push(tokenId);
		}

		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}
}
