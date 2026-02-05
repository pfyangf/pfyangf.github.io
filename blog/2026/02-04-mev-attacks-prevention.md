---
slug: mev-attacks-prevention
title: "MEV攻击全景图：从三明治攻击到防御策略"
authors: [autosec]
tags: [MEV, 抢跑攻击, 三明治攻击, DeFi安全, 区块链安全]
date: 2026-02-04T10:00
---

# MEV攻击全景图：从三明治攻击到防御策略

最大可提取价值（MEV, Maximal Extractable Value）已成为DeFi生态系统中最严重的安全威胁之一。2023年，MEV提取总额超过6亿美元，其中大部分来自对普通用户的攻击。

<!--truncate-->

## 什么是MEV？

MEV是指矿工/验证者通过重新排序、插入或审查区块内的交易而可以提取的最大价值。

### MEV的类型

1. **良性MEV**: 套利、清算
2. **恶意MEV**: 抢跑、三明治攻击、时间强盗攻击

## 常见MEV攻击

### 1. 抢跑攻击（Front-Running）

攻击者监控内存池，发现有利可图的交易后，通过支付更高的gas费用使自己的交易优先执行。

```solidity
// 易受抢跑攻击的合约
contract VulnerableAuction {
    address public highestBidder;
    uint256 public highestBid;
    
    function bid() external payable {
        require(msg.value > highestBid, "Bid too low");
        
        // 退还前一个出价者
        if (highestBidder != address(0)) {
            payable(highestBidder).transfer(highestBid);
        }
        
        highestBidder = msg.sender;
        highestBid = msg.value;
    }
}
```

**攻击场景：**

```javascript
// 攻击者监控内存池
const provider = new ethers.providers.WebSocketProvider(WEBSOCKET_URL);

provider.on('pending', async (txHash) => {
    const tx = await provider.getTransaction(txHash);
    
    if (tx && tx.to === AUCTION_ADDRESS) {
        const decodedData = auctionInterface.parseTransaction({ data: tx.data });
        
        if (decodedData.name === 'bid') {
            // 发送更高gas价格的交易抢跑
            const frontRunTx = await auction.bid({
                value: tx.value.add(ethers.utils.parseEther('0.01')),
                gasPrice: tx.gasPrice.mul(110).div(100) // 提高10% gas价格
            });
            
            console.log('Front-run transaction:', frontRunTx.hash);
        }
    }
});
```

### 2. 三明治攻击（Sandwich Attack）

攻击者在目标交易前后各插入一笔交易，从价格滑点中获利。

```javascript
// 三明治攻击示例
class SandwichAttacker {
    constructor(provider, router, token) {
        this.provider = provider;
        this.router = router;
        this.token = token;
    }
    
    async detectVictim() {
        this.provider.on('pending', async (txHash) => {
            const tx = await this.provider.getTransaction(txHash);
            
            if (this.isSwapTransaction(tx)) {
                await this.executeSandwich(tx);
            }
        });
    }
    
    async executeSandwich(victimTx) {
        const victimAmount = this.extractAmount(victimTx);
        
        // 步骤1: Front-run - 买入推高价格
        const frontRunTx = await this.router.swapExactETHForTokens(
            0, // 接受任何数量
            [WETH, this.token],
            this.wallet.address,
            Date.now() + 1000,
            {
                value: victimAmount.mul(2),
                gasPrice: victimTx.gasPrice.add(ethers.utils.parseUnits('10', 'gwei'))
            }
        );
        
        console.log('Front-run tx:', frontRunTx.hash);
        
        // 步骤2: 等待受害者交易执行
        await victimTx.wait();
        
        // 步骤3: Back-run - 卖出获利
        const balance = await this.token.balanceOf(this.wallet.address);
        const backRunTx = await this.router.swapExactTokensForETH(
            balance,
            0,
            [this.token, WETH],
            this.wallet.address,
            Date.now() + 1000,
            {
                gasPrice: victimTx.gasPrice.add(ethers.utils.parseUnits('5', 'gwei'))
            }
        );
        
        console.log('Back-run tx:', backRunTx.hash);
    }
    
    isSwapTransaction(tx) {
        if (!tx || !tx.data) return false;
        
        const methodId = tx.data.slice(0, 10);
        const swapMethods = [
            '0x7ff36ab5', // swapExactETHForTokens
            '0x18cbafe5', // swapExactTokensForETH
            '0x38ed1739', // swapExactTokensForTokens
        ];
        
        return swapMethods.includes(methodId);
    }
}
```

### 3. 清算抢跑

```solidity
// 借贷协议清算
contract LendingProtocol {
    struct Position {
        uint256 collateral;
        uint256 debt;
        address owner;
    }
    
    mapping(address => Position) public positions;
    uint256 public constant LIQUIDATION_THRESHOLD = 150; // 150%
    
    function liquidate(address user) external {
        Position storage position = positions[user];
        
        uint256 collateralValue = getCollateralValue(position.collateral);
        uint256 debtValue = getDebtValue(position.debt);
        
        // 检查是否可清算
        require(
            collateralValue * 100 < debtValue * LIQUIDATION_THRESHOLD,
            "Position is healthy"
        );
        
        // 清算奖励：5%
        uint256 liquidationReward = position.collateral * 5 / 100;
        
        // 转移抵押品
        token.transfer(msg.sender, position.collateral + liquidationReward);
        
        // 清除债务
        delete positions[user];
    }
}
```

**MEV机器人竞争：**

```javascript
// 清算机器人
class LiquidationBot {
    async monitorPositions() {
        const positions = await this.protocol.getAllPositions();
        
        for (const position of positions) {
            const health = await this.calculateHealth(position);
            
            if (health < 1.5) {
                await this.attemptLiquidation(position);
            }
        }
    }
    
    async attemptLiquidation(position) {
        // 使用 Flashbots 避免被抢跑
        const bundle = [
            {
                transaction: await this.protocol.populateTransaction.liquidate(position.user),
                signer: this.wallet
            }
        ];
        
        const signedBundle = await flashbotsProvider.signBundle(bundle);
        const simulation = await flashbotsProvider.simulate(signedBundle, targetBlock);
        
        if (simulation.firstRevert) {
            console.log('Simulation failed:', simulation.firstRevert);
            return;
        }
        
        // 发送bundle
        const bundleSubmission = await flashbotsProvider.sendRawBundle(
            signedBundle,
            targetBlock
        );
        
        console.log('Bundle submitted:', bundleSubmission.bundleHash);
    }
}
```

## 防御策略

### 1. 使用私有交易池

```javascript
// Flashbots 私有交易示例
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');

async function sendPrivateTransaction(tx) {
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        'https://relay.flashbots.net'
    );
    
    const targetBlock = await provider.getBlockNumber() + 1;
    
    const bundle = [
        {
            signer: wallet,
            transaction: tx
        }
    ];
    
    const signedBundle = await flashbotsProvider.signBundle(bundle);
    
    // 模拟bundle
    const simulation = await flashbotsProvider.simulate(signedBundle, targetBlock);
    console.log('Simulation:', simulation);
    
    // 发送bundle
    const bundleSubmission = await flashbotsProvider.sendRawBundle(
        signedBundle,
        targetBlock
    );
    
    const waitResponse = await bundleSubmission.wait();
    
    if (waitResponse === FlashbotsBundleResolution.BundleIncluded) {
        console.log('Bundle included in block');
    } else if (waitResponse === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
        console.log('Bundle not included');
    }
}
```

### 2. 提交-揭示方案（Commit-Reveal）

```solidity
// 防抢跑的拍卖合约
contract SecureAuction {
    struct Bid {
        bytes32 commitment;
        uint256 deposit;
        bool revealed;
    }
    
    mapping(address => Bid) public bids;
    uint256 public revealDeadline;
    uint256 public auctionEnd;
    
    address public highestBidder;
    uint256 public highestBid;
    
    // 阶段1: 提交承诺
    function commitBid(bytes32 commitment) external payable {
        require(block.timestamp < revealDeadline, "Commit period ended");
        require(bids[msg.sender].commitment == bytes32(0), "Already committed");
        
        bids[msg.sender] = Bid({
            commitment: commitment,
            deposit: msg.value,
            revealed: false
        });
    }
    
    // 阶段2: 揭示出价
    function revealBid(uint256 value, bytes32 secret) external {
        require(block.timestamp >= revealDeadline, "Reveal period not started");
        require(block.timestamp < auctionEnd, "Auction ended");
        
        Bid storage bid = bids[msg.sender];
        require(!bid.revealed, "Already revealed");
        
        // 验证承诺
        bytes32 commitment = keccak256(abi.encodePacked(value, secret));
        require(commitment == bid.commitment, "Invalid reveal");
        
        bid.revealed = true;
        
        // 检查是否是最高出价
        if (value > highestBid && bid.deposit >= value) {
            if (highestBidder != address(0)) {
                // 退还前一个最高出价者
                payable(highestBidder).transfer(highestBid);
            }
            
            highestBidder = msg.sender;
            highestBid = value;
        }
        
        // 退还多余的押金
        if (bid.deposit > value) {
            payable(msg.sender).transfer(bid.deposit - value);
        }
    }
}
```

**使用示例：**

```javascript
// 用户提交出价
async function placeBid(amount) {
    const secret = ethers.utils.randomBytes(32);
    const commitment = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ['uint256', 'bytes32'],
            [amount, secret]
        )
    );
    
    // 阶段1: 提交承诺
    const commitTx = await auction.commitBid(commitment, {
        value: amount
    });
    await commitTx.wait();
    
    // 保存secret用于后续揭示
    localStorage.setItem('bidSecret', ethers.utils.hexlify(secret));
    localStorage.setItem('bidAmount', amount.toString());
}

async function revealBid() {
    const secret = localStorage.getItem('bidSecret');
    const amount = localStorage.getItem('bidAmount');
    
    // 阶段2: 揭示出价
    const revealTx = await auction.revealBid(amount, secret);
    await revealTx.wait();
}
```

### 3. 滑点保护

```solidity
// DEX交易滑点保护
contract SecureDEX {
    function swapWithSlippageProtection(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 maxPriceImpact // 以基点表示，例如50 = 0.5%
    ) external returns (uint256 amountOut) {
        // 获取当前价格
        uint256 currentPrice = getPrice(tokenIn, tokenOut);
        
        // 计算预期输出
        uint256 expectedOut = calculateExpectedOutput(amountIn, currentPrice);
        
        // 执行交换
        amountOut = _swap(tokenIn, tokenOut, amountIn);
        
        // 检查滑点
        require(amountOut >= minAmountOut, "Slippage too high");
        
        // 检查价格影响
        uint256 priceImpact = calculatePriceImpact(amountIn, amountOut, currentPrice);
        require(priceImpact <= maxPriceImpact, "Price impact too high");
        
        return amountOut;
    }
    
    function calculatePriceImpact(
        uint256 amountIn,
        uint256 amountOut,
        uint256 initialPrice
    ) internal pure returns (uint256) {
        uint256 executionPrice = (amountIn * 1e18) / amountOut;
        uint256 impact = ((executionPrice - initialPrice) * 10000) / initialPrice;
        return impact;
    }
}
```

### 4. 时间锁和延迟执行

```solidity
// 带时间锁的交易
contract TimelockProtection {
    struct PendingTransaction {
        address target;
        uint256 value;
        bytes data;
        uint256 executeAfter;
        bool executed;
    }
    
    mapping(bytes32 => PendingTransaction) public pendingTxs;
    uint256 public constant MIN_DELAY = 1 hours;
    uint256 public constant MAX_DELAY = 7 days;
    
    event TransactionQueued(bytes32 indexed txHash, uint256 executeAfter);
    event TransactionExecuted(bytes32 indexed txHash);
    
    function queueTransaction(
        address target,
        uint256 value,
        bytes memory data,
        uint256 delay
    ) external returns (bytes32) {
        require(delay >= MIN_DELAY && delay <= MAX_DELAY, "Invalid delay");
        
        bytes32 txHash = keccak256(abi.encode(target, value, data, block.timestamp));
        uint256 executeAfter = block.timestamp + delay;
        
        pendingTxs[txHash] = PendingTransaction({
            target: target,
            value: value,
            data: data,
            executeAfter: executeAfter,
            executed: false
        });
        
        emit TransactionQueued(txHash, executeAfter);
        return txHash;
    }
    
    function executeTransaction(bytes32 txHash) external {
        PendingTransaction storage pendingTx = pendingTxs[txHash];
        
        require(!pendingTx.executed, "Already executed");
        require(block.timestamp >= pendingTx.executeAfter, "Too early");
        
        pendingTx.executed = true;
        
        (bool success, ) = pendingTx.target.call{value: pendingTx.value}(pendingTx.data);
        require(success, "Execution failed");
        
        emit TransactionExecuted(txHash);
    }
}
```

## MEV保护服务

### 1. Flashbots Protect

```javascript
// 使用 Flashbots Protect RPC
const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.flashbots.net'
);

// 发送交易到Flashbots
async function sendProtectedTransaction(tx) {
    const signedTx = await wallet.signTransaction(tx);
    const txResponse = await provider.sendTransaction(signedTx);
    
    console.log('Protected transaction:', txResponse.hash);
    return txResponse;
}
```

### 2. Eden Network

```javascript
// Eden Network 配置
const edenProvider = new ethers.providers.JsonRpcProvider(
    'https://api.edennetwork.io/v1/rpc'
);

// 质押EDEN代币获得优先权
async function stakeForPriority(amount) {
    const edenToken = new ethers.Contract(EDEN_TOKEN, ERC20_ABI, wallet);
    const stakingContract = new ethers.Contract(EDEN_STAKING, STAKING_ABI, wallet);
    
    // 批准
    await edenToken.approve(EDEN_STAKING, amount);
    
    // 质押
    await stakingContract.stake(amount);
}
```

### 3. CowSwap (MEV Blocker)

```javascript
// CowSwap 订单
const { OrderBookApi, OrderKind, SigningScheme } = require('@cowprotocol/cow-sdk');

async function createCowSwapOrder(sellToken, buyToken, amount) {
    const orderBookApi = new OrderBookApi({ chainId: 1 });
    
    const order = {
        sellToken: sellToken,
        buyToken: buyToken,
        sellAmount: amount.toString(),
        buyAmount: '0', // 让求解器计算
        validTo: Math.floor(Date.now() / 1000) + 3600, // 1小时有效期
        appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: '0',
        kind: OrderKind.SELL,
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20'
    };
    
    const signature = await signOrder(order, wallet);
    
    const orderId = await orderBookApi.sendOrder({
        ...order,
        signature,
        signingScheme: SigningScheme.EIP712
    });
    
    console.log('Order ID:', orderId);
    return orderId;
}
```

## MEV监控和分析

### 1. MEV检测

```python
# MEV交易检测脚本
import requests
from web3 import Web3

class MEVDetector:
    def __init__(self, web3_provider):
        self.w3 = Web3(Web3.HTTPProvider(web3_provider))
    
    def analyze_block(self, block_number):
        block = self.w3.eth.get_block(block_number, full_transactions=True)
        mev_transactions = []
        
        for i, tx in enumerate(block.transactions):
            # 检查三明治攻击
            if i > 0 and i < len(block.transactions) - 1:
                prev_tx = block.transactions[i-1]
                next_tx = block.transactions[i+1]
                
                if self.is_sandwich(prev_tx, tx, next_tx):
                    mev_transactions.append({
                        'type': 'sandwich',
                        'victim': tx['hash'].hex(),
                        'frontrun': prev_tx['hash'].hex(),
                        'backrun': next_tx['hash'].hex(),
                        'profit': self.calculate_profit(prev_tx, next_tx)
                    })
            
            # 检查抢跑
            if self.is_frontrun(tx, block.transactions[:i]):
                mev_transactions.append({
                    'type': 'frontrun',
                    'transaction': tx['hash'].hex()
                })
        
        return mev_transactions
    
    def is_sandwich(self, tx1, tx2, tx3):
        # 检查是否是同一个DEX
        if tx1['to'] != tx3['to']:
            return False
        
        # 检查是否是相同的交易对
        # 简化版本，实际需要解析交易数据
        return (
            tx1['from'] == tx3['from'] and
            tx1['gasPrice'] > tx2['gasPrice'] and
            tx3['gasPrice'] > tx2['gasPrice']
        )
    
    def calculate_profit(self, frontrun_tx, backrun_tx):
        # 计算MEV利润
        # 需要解析交易receipt和事件
        pass
```

### 2. MEV仪表板

```javascript
// MEV统计API
const express = require('express');
const app = express();

app.get('/api/mev/stats', async (req, res) => {
    const stats = await getMEVStats();
    res.json(stats);
});

async function getMEVStats() {
    const latestBlock = await provider.getBlockNumber();
    const blocks = await Promise.all(
        Array.from({ length: 100 }, (_, i) => 
            provider.getBlockWithTransactions(latestBlock - i)
        )
    );
    
    let totalMEV = ethers.BigNumber.from(0);
    let sandwichCount = 0;
    let frontrunCount = 0;
    
    for (const block of blocks) {
        const analysis = await analyzeBlockForMEV(block);
        totalMEV = totalMEV.add(analysis.totalValue);
        sandwichCount += analysis.sandwichAttacks;
        frontrunCount += analysis.frontrunAttacks;
    }
    
    return {
        totalMEVExtracted: ethers.utils.formatEther(totalMEV),
        sandwichAttacks: sandwichCount,
        frontrunAttacks: frontrunCount,
        averageMEVPerBlock: ethers.utils.formatEther(totalMEV.div(blocks.length))
    };
}
```

## 未来发展

### 1. MEV-Boost

以太坊合并后的MEV解决方案，分离区块构建和提议。

### 2. Proposer-Builder Separation (PBS)

将区块提议者和构建者角色分离，减少MEV对共识的影响。

### 3. 加密内存池

使用阈值加密技术保护交易隐私，直到被打包进区块。

## 总结

MEV是DeFi生态系统中不可避免的现象，但我们可以：

- 🛡️ **使用防护工具**: Flashbots, Eden, CowSwap
- 🔒 **实施安全模式**: Commit-Reveal, 时间锁
- 📊 **监控和分析**: 及时发现和响应MEV攻击
- 💡 **教育用户**: 提高对MEV风险的认识

记住：**在DeFi中，交易隐私和顺序保护至关重要**。

---

**AutoSec** - 守护你的每一笔交易
