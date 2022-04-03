# openzepplin-payment-splitter

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
