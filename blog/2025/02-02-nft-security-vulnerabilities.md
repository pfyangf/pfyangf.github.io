---
slug: nft-security-vulnerabilities
title: NFT智能合约安全漏洞全解析
authors: [autosec]
tags: [NFT安全, ERC-721, ERC-1155, 智能合约, Web3安全]
---

# NFT智能合约安全漏洞全解析

NFT（非同质化代币）市场在2021-2023年间爆发式增长，但随之而来的是各种安全问题。从合约漏洞到钓鱼攻击，NFT生态系统面临着多重安全挑战。

<!--truncate-->

## NFT标准概述

### ERC-721 vs ERC-1155

```solidity
// ERC-721: 每个代币都是唯一的
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

// ERC-1155: 支持批量操作和半同质化代币
interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
}
```

## 常见安全漏洞

### 1. 重入攻击

```solidity
// 存在重入漏洞的NFT合约
contract VulnerableNFT is ERC721 {
    uint256 public constant PRICE = 0.1 ether;
    
    function mint() external payable {
        require(msg.value >= PRICE, "Insufficient payment");
        
        uint256 tokenId = totalSupply();
        _safeMint(msg.sender, tokenId);
        
        // 危险：在铸造后退款
        if (msg.value > PRICE) {
            (bool success, ) = msg.sender.call{value: msg.value - PRICE}("");
            require(success, "Refund failed");
        }
    }
}

// 攻击合约
contract NFTAttacker is IERC721Receiver {
    VulnerableNFT public nft;
    uint256 public attackCount;
    
    function attack() external payable {
        nft.mint{value: msg.value}();
    }
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public override returns (bytes4) {
        // 重入攻击
        if (attackCount < 10 && address(nft).balance > 0) {
            attackCount++;
            nft.mint{value: 0.1 ether}();
        }
        return this.onERC721Received.selector;
    }
    
    receive() external payable {
        // 在退款时重入
        if (address(nft).balance > 0) {
            nft.mint{value: 0.1 ether}();
        }
    }
}
```

**修复方案：**

```solidity
contract SecureNFT is ERC721, ReentrancyGuard {
    uint256 public constant PRICE = 0.1 ether;
    
    function mint() external payable nonReentrant {
        require(msg.value >= PRICE, "Insufficient payment");
        
        uint256 tokenId = totalSupply();
        
        // 先更新状态
        _mint(msg.sender, tokenId);
        
        // 最后处理退款
        if (msg.value > PRICE) {
            (bool success, ) = msg.sender.call{value: msg.value - PRICE}("");
            require(success, "Refund failed");
        }
    }
}
```

### 2. 元数据操纵

```solidity
// 不安全：元数据可以被修改
contract UnsafeMetadata is ERC721 {
    mapping(uint256 => string) public tokenURIs;
    
    function setTokenURI(uint256 tokenId, string memory uri) external {
        // 任何人都可以修改！
        tokenURIs[tokenId] = uri;
    }
}

// 安全实现
contract SecureMetadata is ERC721 {
    string private baseURI;
    mapping(uint256 => bytes32) public immutableMetadata;
    
    constructor(string memory _baseURI) {
        baseURI = _baseURI;
    }
    
    function mint(uint256 tokenId, bytes32 metadataHash) external {
        _mint(msg.sender, tokenId);
        // 元数据哈希不可变
        immutableMetadata[tokenId] = metadataHash;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId)));
    }
    
    // 验证元数据完整性
    function verifyMetadata(
        uint256 tokenId,
        string memory metadata
    ) external view returns (bool) {
        return keccak256(bytes(metadata)) == immutableMetadata[tokenId];
    }
}
```

### 3. 访问控制漏洞

```solidity
// 漏洞：缺少访问控制
contract VulnerableNFTMint is ERC721 {
    function mint(address to, uint256 tokenId) external {
        // 任何人都可以铸造！
        _mint(to, tokenId);
    }
}

// 安全实现
contract SecureNFTMint is ERC721, Ownable {
    uint256 public maxSupply = 10000;
    uint256 public totalMinted;
    mapping(address => bool) public whitelist;
    
    // 白名单铸造
    function whitelistMint() external {
        require(whitelist[msg.sender], "Not whitelisted");
        require(totalMinted < maxSupply, "Max supply reached");
        
        whitelist[msg.sender] = false; // 防止重复铸造
        _mint(msg.sender, totalMinted);
        totalMinted++;
    }
    
    // 公开铸造（带限制）
    mapping(address => uint256) public mintedPerAddress;
    uint256 public constant MAX_PER_ADDRESS = 5;
    
    function publicMint(uint256 amount) external payable {
        require(amount <= MAX_PER_ADDRESS, "Exceeds max per tx");
        require(
            mintedPerAddress[msg.sender] + amount <= MAX_PER_ADDRESS,
            "Exceeds max per address"
        );
        require(totalMinted + amount <= maxSupply, "Exceeds max supply");
        require(msg.value >= PRICE * amount, "Insufficient payment");
        
        for (uint256 i = 0; i < amount; i++) {
            _mint(msg.sender, totalMinted);
            totalMinted++;
        }
        
        mintedPerAddress[msg.sender] += amount;
    }
    
    // 仅所有者可以添加白名单
    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }
}
```

### 4. 随机数可预测性

```solidity
// 不安全的随机数生成
contract UnsafeRandom is ERC721 {
    function mintRandom() external {
        // 可预测！
        uint256 randomId = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % 10000;
        
        _mint(msg.sender, randomId);
    }
}

// 使用 Chainlink VRF 的安全实现
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract SecureRandomNFT is ERC721, VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    
    mapping(bytes32 => address) public requestToSender;
    
    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        keyHash = _keyHash;
        fee = _fee;
    }
    
    function requestRandomMint() external returns (bytes32) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToSender[requestId] = msg.sender;
        
        return requestId;
    }
    
    function fulfillRandomness(
        bytes32 requestId,
        uint256 randomness
    ) internal override {
        address sender = requestToSender[requestId];
        uint256 tokenId = randomness % 10000;
        
        _mint(sender, tokenId);
    }
}
```

## 真实攻击案例

### Akutars NFT 事件（2022年4月）

**损失**：34 million 美元永久锁定

**问题代码：**

```solidity
contract AkutarsVulnerable {
    uint256 public totalRefundAmount;
    
    function claimRefund() external {
        uint256 refundAmount = refunds[msg.sender];
        require(refundAmount > 0, "No refund available");
        
        refunds[msg.sender] = 0;
        totalRefundAmount -= refundAmount;
        
        // 问题：需要所有人都claim才能提取
        require(totalRefundAmount == 0, "Not all refunds claimed");
        
        payable(owner).transfer(address(this).balance);
    }
}
```

**问题分析：**
- 合约要求所有退款都被领取后才能提取资金
- 如果有一个地址不领取退款，资金永久锁定
- 实际上有一个地址无法领取，导致所有资金被锁

### Meebits 合约漏洞（2021年5月）

**漏洞类型**：重入攻击

```solidity
// 简化的漏洞代码
contract MeebitsVulnerable {
    function mintWithPunk(uint256 punkIndex) external {
        require(punkOwner[punkIndex] == msg.sender, "Not punk owner");
        
        // 先铸造NFT
        _mint(msg.sender, nextTokenId);
        nextTokenId++;
        
        // 后标记已使用
        punkUsed[punkIndex] = true;
    }
}
```

**攻击方式：**
攻击者可以在 `_mint` 的回调中再次调用 `mintWithPunk`，因为 `punkUsed` 还未设置。

## 安全最佳实践

### 1. 完整的访问控制

```solidity
contract SecureNFTAccessControl is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    bool public paused;
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    function mint(address to, uint256 tokenId) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mint(to, tokenId);
    }
    
    function pause() external onlyRole(PAUSER_ROLE) {
        paused = true;
    }
    
    function unpause() external onlyRole(PAUSER_ROLE) {
        paused = false;
    }
}
```

### 2. 批量操作的 Gas 优化

```solidity
contract GasOptimizedNFT is ERC721A {
    // ERC721A 优化了批量铸造的 gas 消耗
    
    function batchMint(uint256 quantity) external payable {
        require(quantity <= 20, "Max 20 per tx");
        require(msg.value >= PRICE * quantity, "Insufficient payment");
        
        // 单次调用铸造多个
        _mint(msg.sender, quantity);
    }
}
```

### 3. 版税实现（ERC-2981）

```solidity
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract NFTWithRoyalty is ERC721, ERC2981 {
    constructor() {
        // 设置默认版税：5%给创作者
        _setDefaultRoyalty(msg.sender, 500); // 500 = 5%
    }
    
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

### 4. 元数据冻结机制

```solidity
contract FreezableMetadata is ERC721 {
    mapping(uint256 => bool) public metadataFrozen;
    mapping(uint256 => string) private _tokenURIs;
    
    event MetadataFrozen(uint256 indexed tokenId);
    
    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        require(!metadataFrozen[tokenId], "Metadata is frozen");
        _tokenURIs[tokenId] = uri;
    }
    
    function freezeMetadata(uint256 tokenId) external onlyOwner {
        metadataFrozen[tokenId] = true;
        emit MetadataFrozen(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }
}
```

## 审计清单

在部署NFT合约前，确保检查：

- ✅ 重入攻击防护
- ✅ 访问控制正确实现
- ✅ 元数据不可篡改或有冻结机制
- ✅ 随机数生成安全（使用VRF）
- ✅ 整数溢出保护（Solidity 0.8+自动检查）
- ✅ 紧急暂停机制
- ✅ 版税实现（如需要）
- ✅ Gas优化
- ✅ 事件日志完整
- ✅ 升级机制安全（如使用代理模式）

## 总结

NFT安全需要关注：

1. **智能合约层面**：防止重入、访问控制、随机数安全
2. **元数据层面**：确保不可篡改性和完整性
3. **经济模型层面**：防止价格操纵和套利
4. **用户交互层面**：防止钓鱼和社会工程攻击

记住：**一个小漏洞可能导致整个NFT项目的崩溃**。

---

**AutoSec建议**：在主网部署前，务必进行专业安全审计和充分测试。
