import { dataSource } from '@graphprotocol/graph-ts'
import {
  ContractSlugUpdated,
  ContractURISet,
} from '../../types/NFTFactory/SX1155NFT'
import { NFT, NFTFactory } from '../../wrappers'

export function handleUpdateNFTUri(event: ContractURISet): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  nft.setUriJson(event.params.uri, event, true)
  nft.updatedAt = event.block.timestamp

  nft.save()
}

export function handleUpdateNFTSlug(event: ContractSlugUpdated): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)
  const nft = NFT.mustLoad(event.address.toHexString())

  nft.slug = event.params.slug.toString()

  nft.save()
  factory.save()
}
