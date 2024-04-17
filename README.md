# BrownFi AMM
**a ve(3,3) renovated AMM to unlock deep liquidity & capital efficiency on SUI** 

## Fundamental problems  
- Conventional DEXes usually misalign incentives for LPs, offer token inflation with rewards controlled by the DEX developers.
- Uniswap v2 is simple but low Capital Efficiency (CE)
- Uniswap v3 has high CE but complicated UX for LPs, non-fungible LP tokens. It requires manually adjusting bins.

## Solution: a novel ve(3,3) renovated AMM 
We renovate AMM model and apply ve(3,3) token model to unlock deep liquidity and maximize incentives for all participants. We invent a novel price discovery mechanism, inspired by order-book, to tailor CE & market making, while keeping simple UX, fungibility & reusability of LP tokens of Uniswap v2. On the other hand, veToken model is integrated with our innovative AMM to align and maximize incentives for all participants (LPs, traders, veToken stakers). All of these makes BrownFi standing out of other competitors on SUI ecosystem. Our AMM model is originated from a rigorous [research paper](https://ieeexplore.ieee.org/abstract/document/10456889) of BrownFi's cofounder, published on IEEE Access, a reputable academic journal. 


## Introduction
BrownFi proposes a novel AMM model, where LPs allocate their liquidity into the pool according to a bonding curve that mimics the general shape of a traditional limit orderbook (LOB). We introduce a novel concept, *Elastic Factor*, to allow the liquidity concentration of the AMM to be automatically adjusted according to the relative trading size. This elasticity ensures unbounded liquidity, thus the pool never runs out of liquidity regardless of the trading size. Our general Elastic model covers the special case of the constant-product market making model $xy=k$. More importantly, it opens a new door to create arbitrary AMM with customized local orderbook shape around the market price as well as tailored liquidity concentration.

The major contribution of this model is that, when the AMM is locally V-shaped, both impermanent loss (IL) and loss-versus-rebalancing (LVR) in this model asymptotically vanish when the trading frequency is high or, equivalently when the pool size is large. Therefore, the pool size will behave exactly like a rebalancing portfolio in the geometric Brownian motion model.

Some other novelties of the model are as follows.
- Possesses desired statistical properties of the traditional LOB model, for instance locally V-shaped (or square root price impact) and price reversals.
- Offers much higher concentrated liquidity than Uniswap V2. To be more precise, its capital efficiency is about 400 times higher than that of the Uniswap V2 model at typical 2% around the mid price.
- Opens a new door for flexible market making (MM) strategies for LPs, thus transforming the MM problem to a multi-funds asset allocation problem. 

Note: loss-versus-rebalancing (LVR) is an important problem among among [Nakamoto challenges](https://a16zcrypto.com/posts/announcement/introducing-the-nakamoto-challenge-addressing-the-toughest-problems-in-crypto/) proposed by A16Z. BrownFi Elastic model is a response to the problem.
## BrownFi: market proposition & USP
![image](https://github.com/BrownFi/BrownAMM/assets/45308207/f9cf9574-39f8-46fb-9158-4c11ef5059bc)

This repo is in development.
Please stay tuned for our updates. Contact Telegram: @paven86  


## CORE swap function
The core swap function of BrownFi is based on an invention of a price discovery mechanism: 
- Given a pair of tokens X and Y, where X is base token (e.g. ETH) and Y is quote token (e.g. USDT). 
- Assume that the pool reserve has $x_0$ tokens X and $y_0$ tokens Y with the initial price is $P_0.$
- For any trade input of $dx$ into the pool, we compute the average trading price $\bar{P} = P_0 * (1 + R/2),$ where $R$ denotes price impact factor.
- Price impact $R=K_0 * f(dx)$ is proportionate to relative order size $dx.$ Parameter $K$ is usually set LARGE for HIGH volatility, and small for low volatility. For $K=2$, our elastic PLOB model is the same as CPMM of Uniswap V2.
- Finally, we compute the trade output based on the input and the computed average trading price.

## BrownFi’s Published Research Paper
https://ieeexplore.ieee.org/abstract/document/10456889 
![image](https://github.com/BrownFi/BrownFi-AMM-SUI/assets/45308207/471ef717-fad3-4419-a4af-875dae6c07d8) 

## Smartcontract repo
Core contracts of AMM prototype https://github.com/BrownFi/BrownFi-Sui  
Deployed link on testnet: https://suiscan.xyz/testnet/object/0xbacddd9ff142a3d5621fc0bb453d7af967b1dc201ce982b32b6db9402370fbd0/txs  

## Frontend vercel
https://brownfi-sui.vercel.app/#/add/v2 
Priv key for test account: suiprivkey1qzufm5wcxdc7wal4g03ndszy2r2u372tn576cm8xe6594u739npuye9mtnj


