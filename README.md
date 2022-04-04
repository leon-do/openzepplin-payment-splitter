# OpenZepplin Payment Splitter 

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol";

contract OpenZepplinPaymentSplitter is PaymentSplitter {
    /**
     * @dev Creates instance of PaymentSplitter
     * @param _payees array of addresses funds will get split to. order matters
     * @param _shares array of percentages funds will split into. order matters
     * For example, if 0x5B38... gets 51% and 0xAb84... gets 49%, the params will be:
     * ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]
     * [51, 49]
    */
    constructor(address[] memory _payees, uint256[] memory _shares) PaymentSplitter(_payees, _shares) payable {}
}
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
