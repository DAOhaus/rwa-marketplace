// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTFactory is ERC721URIStorage, Ownable, Pausable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	struct NFTData {
		string status;
		address linkedToken;
		string[] linkedTokenInterfaces;
		bool locked;
		bool paused;
	}

	mapping(uint256 => NFTData) public nftData;
	mapping(address => uint256[]) public tokensByAddress;

	bool public onlyOwnerCanMint = false;

	event TokenMinted(uint256 indexed tokenId, address indexed to);
	event MetadataLocked(uint256 tokenId);
	event MetadataUnlocked(uint256 tokenId);
	event TokenPaused(uint256 tokenId);
	event TokenUnpaused(uint256 tokenId);

	constructor(
		string memory _name,
		string memory _symbol
	) ERC721(_name, _symbol) {}

	function setOnlyOwnerCanMint(bool _onlyOwnerCanMint) external onlyOwner {
		onlyOwnerCanMint = _onlyOwnerCanMint;
	}

	function mint(
		address to,
		string memory tokenURI,
		address linkedToken,
		string[] memory linkedTokenInterfaces
	) public whenNotPaused {
		require(
			!onlyOwnerCanMint || msg.sender == owner(),
			"Minting is restricted to the owner"
		);

		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, tokenURI);

		tokensByAddress[to].push(tokenId); // Add token to the new owner's list

		nftData[tokenId] = NFTData({
			status: "active",
			linkedToken: linkedToken,
			linkedTokenInterfaces: linkedTokenInterfaces,
			locked: false,
			paused: false
		});

		emit TokenMinted(tokenId, to);
	}

	// Callable by both owner and individual NFT holder
	function updateNFT(
		uint256 tokenId,
		string memory status,
		string memory tokenURI
	) public {
		require(_exists(tokenId), "NFT does not exist");
		require(
			msg.sender == owner() || msg.sender == ownerOf(tokenId),
			"Caller is not the owner or NFT owner"
		);
		require(!nftData[tokenId].locked, "Metadata is locked");

		if (bytes(status).length > 0) nftData[tokenId].status = status;
		if (bytes(tokenURI).length > 0) _setTokenURI(tokenId, tokenURI);
	}

	// Callable by both owner and individual NFT holder
	// If called by NFT holder, then it is one-way and needs admin to unlock
	function lock(uint256 tokenId) public {
		require(_exists(tokenId), "NFT does not exist");
		require(
			msg.sender == owner() || msg.sender == ownerOf(tokenId),
			"Caller is not the owner or NFT owner"
		);

		nftData[tokenId].locked = true;
		emit MetadataLocked(tokenId);
	}

	function unlock(uint256 tokenId) public onlyOwner {
		require(_exists(tokenId), "NFT does not exist");
		nftData[tokenId].locked = false;
		emit MetadataUnlocked(tokenId);
	}

	function pauseAll() public onlyOwner {
		_pause();
	}

	function unpauseAll() public onlyOwner {
		_unpause();
	}

	function pauseToken(uint256 tokenId) public {
		require(_exists(tokenId), "NFT does not exist");
		require(
			msg.sender == owner() || msg.sender == ownerOf(tokenId),
			"Caller is not the owner or NFT owner"
		);
		nftData[tokenId].paused = true;
		emit TokenPaused(tokenId);
	}

	function unpauseToken(uint256 tokenId) public onlyOwner {
		require(_exists(tokenId), "NFT does not exist");
		require(
			msg.sender == owner() || msg.sender == ownerOf(tokenId),
			"Caller is not the owner or NFT owner"
		);
		nftData[tokenId].paused = false;
		emit TokenUnpaused(tokenId);
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal virtual override whenNotPaused {
		require(!nftData[tokenId].paused, "Token is paused");

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
