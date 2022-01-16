import { ethers } from 'hardhat'
import fs from 'fs'
import { BigNumber } from 'ethers'

type Debt = {
  address: string
  amountNum: number
  amountWei: string
}

describe('Protocol Debt to WxBtrfly', () => {
  it('loads rekt', async () => {
    const transactionReciept = await ethers.provider.getTransactionReceipt(
      '0xf0e4ccb4f88716fa5182da280abdb9ea10ec1c61cfc5bbe87e10bdde07c229d6',
    )

    const logs = transactionReciept.logs
    const debtMap: any = {}

    for (let index = 0; index < logs.length; index++) {
      const log = logs[index]
      const bigNumber = BigNumber.from(log.data)
      const amountNum = Number(ethers.utils.formatEther(bigNumber))
      const from = ethers.utils.defaultAbiCoder.decode(['address'], log.topics[1]).toString()

      // all aprove and transfer 0 tx
      if (bigNumber.isZero()) {
        continue
      }

      if (from === '0x085C46B94eeA357279B301971f75eeBF5BC1377b') continue

      const debt: Debt = {
        address: from,
        amountNum,
        amountWei: bigNumber.toString(),
      }

      debtMap[from] = debt
    }

    fs.writeFile('Victims.json', JSON.stringify([debtMap]), function (err) {
      if (err) {
        console.log(err)
      }
    })
  })
})
