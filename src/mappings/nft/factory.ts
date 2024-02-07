import { Address, dataSource } from '@graphprotocol/graph-ts'
import { SX1155NFTDeployed } from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: SX1155NFTDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  let address = changetype<Address>(event.params.deployedAt)
  let nft = new NFT(address)

  nft.updatedAt = event.block.timestamp
  nft.createdAt = event.block.timestamp
  nft.creator = event.block.author

  nft.save()
  factory.save()
}
