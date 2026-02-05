---
slug: solidity-security-patterns
title: "Solidity Security Patterns: Writing Secure Smart Contracts"
authors: [autosec]
tags: [Solidity, smart contract security, security patterns, best practices, Web3]
---

# Solidity Security Patterns: Writing Secure Smart Contracts

Writing secure smart contracts requires more than just knowing Solidity syntax. It demands understanding common vulnerabilities and applying proven security patterns. This guide covers essential patterns every Solidity developer should know.

<!--truncate-->

## Fundamental Security Patterns

### 1. Checks-Effects-Interactions Pattern

The most important pattern for preventing reentrancy attacks.

```solidity
contract SecureWithdrawal {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        // CHECKS: Validate conditions
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        
        // EFFECTS: Update state
        balances[msg.sender] -= amount;
        
        // INTERACTIONS: External calls
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### 2. Pull Over Push Pattern

Instead of pushing payments, let users pull them.

```solidity
contract PullPayment {
    mapping(address => uint256) public pendingWithdrawals;
    
    function allowWithdrawal(address payee, uint256 amount) internal {
        pendingWithdrawals[payee] += amount;
    }
    
    function withdraw() external {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### 3. Rate Limiting

Protect against spam and abuse.

```solidity
contract RateLimited {
    mapping(address => uint256) public lastActionTime;
    mapping(address => uint256) public actionCount;
    
    uint256 public constant COOLDOWN_PERIOD = 1 hours;
    uint256 public constant MAX_ACTIONS_PER_PERIOD = 10;
    
    modifier rateLimit() {
        if (block.timestamp > lastActionTime[msg.sender] + COOLDOWN_PERIOD) {
            actionCount[msg.sender] = 0;
            lastActionTime[msg.sender] = block.timestamp;
        }
        
        require(
            actionCount[msg.sender] < MAX_ACTIONS_PER_PERIOD,
            "Rate limit exceeded"
        );
        
        actionCount[msg.sender]++;
        _;
    }
    
    function performAction() external rateLimit {
        // Action logic
    }
}
```

## Access Control Patterns

### 1. Role-Based Access Control (RBAC)

```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RBACExample is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        // Mint logic
    }
    
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        // Burn logic
    }
    
    function grantMinterRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }
}
```

### 2. Multi-Signature Pattern

```solidity
contract MultiSig {
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public required;
    
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }
    
    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }
    
    modifier txExists(uint256 txId) {
        require(txId < transactions.length, "Transaction does not exist");
        _;
    }
    
    modifier notExecuted(uint256 txId) {
        require(!transactions[txId].executed, "Transaction already executed");
        _;
    }
    
    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "Owners required");
        require(
            _required > 0 && _required <= _owners.length,
            "Invalid required number"
        );
        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        required = _required;
    }
    
    function submitTransaction(
        address to,
        uint256 value,
        bytes memory data
    ) external onlyOwner returns (uint256) {
        uint256 txId = transactions.length;
        
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
            executed: false,
            confirmations: 0
        }));
        
        return txId;
    }
    
    function confirmTransaction(uint256 txId)
        external
        onlyOwner
        txExists(txId)
        notExecuted(txId)
    {
        require(!confirmations[txId][msg.sender], "Transaction already confirmed");
        
        confirmations[txId][msg.sender] = true;
        transactions[txId].confirmations++;
        
        if (transactions[txId].confirmations >= required) {
            executeTransaction(txId);
        }
    }
    
    function executeTransaction(uint256 txId) internal {
        Transaction storage transaction = transactions[txId];
        transaction.executed = true;
        
        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction execution failed");
    }
}
```

## State Machine Pattern

Enforce valid state transitions.

```solidity
contract Crowdfunding {
    enum State { Fundraising, Expired, Successful }
    
    State public state = State.Fundraising;
    uint256 public deadline;
    uint256 public goal;
    uint256 public totalRaised;
    
    modifier inState(State _state) {
        require(state == _state, "Invalid state");
        _;
    }
    
    modifier checkDeadline() {
        if (block.timestamp > deadline && state == State.Fundraising) {
            state = totalRaised >= goal ? State.Successful : State.Expired;
        }
        _;
    }
    
    function contribute() external payable inState(State.Fundraising) checkDeadline {
        require(msg.value > 0, "Contribution must be positive");
        
        totalRaised += msg.value;
        
        if (totalRaised >= goal) {
            state = State.Successful;
        }
    }
    
    function withdraw() external inState(State.Successful) {
        // Withdrawal logic
    }
    
    function refund() external inState(State.Expired) {
        // Refund logic
    }
}
```

## Emergency Stop Pattern

```solidity
contract EmergencyStop {
    address public owner;
    bool public stopped;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier stopInEmergency() {
        require(!stopped, "Contract is stopped");
        _;
    }
    
    modifier onlyInEmergency() {
        require(stopped, "Not in emergency");
        _;
    }
    
    function toggleContractActive() external onlyOwner {
        stopped = !stopped;
    }
    
    function deposit() external payable stopInEmergency {
        // Normal operation
    }
    
    function emergencyWithdraw() external onlyInEmergency {
        // Emergency operation
    }
}
```

## Secure Randomness Pattern

```solidity
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract SecureRandom is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    
    mapping(bytes32 => address) public requestToSender;
    
    event RandomnessRequested(bytes32 requestId);
    event RandomnessFulfilled(bytes32 requestId, uint256 randomness);
    
    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        keyHash = _keyHash;
        fee = _fee;
    }
    
    function getRandomNumber() external returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        
        requestId = requestRandomness(keyHash, fee);
        requestToSender[requestId] = msg.sender;
        
        emit RandomnessRequested(requestId);
        return requestId;
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = randomness;
        emit RandomnessFulfilled(requestId, randomness);
    }
}
```

## Upgrade Patterns

### Transparent Proxy Pattern

```solidity
contract TransparentProxy {
    address public implementation;
    address public admin;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }
    
    function upgradeTo(address newImplementation) external onlyAdmin {
        require(newImplementation != address(0), "Invalid address");
        implementation = newImplementation;
    }
    
    fallback() external payable {
        address impl = implementation;
        
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
```

## Gas Optimization Patterns

### 1. Packing Storage Variables

```solidity
contract GasOptimized {
    // Bad: Uses 3 storage slots
    uint256 a;  // slot 0
    uint128 b;  // slot 1
    uint128 c;  // slot 2
    
    // Good: Uses 2 storage slots
    uint256 x;      // slot 0
    uint128 y;      // slot 1
    uint128 z;      // slot 1 (packed with y)
}
```

### 2. Using Events for Data Storage

```solidity
contract EventStorage {
    event DataStored(uint256 indexed id, bytes data);
    
    // Instead of storing in state (expensive)
    // mapping(uint256 => bytes) public data;
    
    // Emit events (cheaper)
    function storeData(uint256 id, bytes memory data) external {
        emit DataStored(id, data);
    }
}
```

## Testing Patterns

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Security Patterns", function() {
    let contract;
    let owner, user1, user2;
    
    beforeEach(async function() {
        [owner, user1, user2] = await ethers.getSigners();
        
        const Contract = await ethers.getContractFactory("SecureContract");
        contract = await Contract.deploy();
        await contract.deployed();
    });
    
    describe("Access Control", function() {
        it("Should only allow owner to perform admin actions", async function() {
            await expect(
                contract.connect(user1).adminFunction()
            ).to.be.revertedWith("Not owner");
        });
    });
    
    describe("Reentrancy Protection", function() {
        it("Should prevent reentrancy attacks", async function() {
            const Attacker = await ethers.getContractFactory("ReentrancyAttacker");
            const attacker = await Attacker.deploy(contract.address);
            
            await expect(
                attacker.attack({ value: ethers.utils.parseEther("1") })
            ).to.be.reverted;
        });
    });
    
    describe("Rate Limiting", function() {
        it("Should enforce rate limits", async function() {
            for (let i = 0; i < 10; i++) {
                await contract.performAction();
            }
            
            await expect(
                contract.performAction()
            ).to.be.revertedWith("Rate limit exceeded");
        });
    });
});
```

## Conclusion

Secure smart contract development requires:

- 🔒 **Consistent application of security patterns**
- 🧪 **Comprehensive testing**
- 📊 **Regular audits**
- 🔄 **Continuous learning**

Remember: **Security is not a feature, it's a requirement.**

---

**AutoSec** - Building secure Web3 applications through proven patterns and best practices.
