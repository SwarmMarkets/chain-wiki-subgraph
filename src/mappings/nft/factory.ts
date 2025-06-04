import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts'
import {
  ChainWikiDeployed,
  ContractSlugUpdated,
} from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: ChainWikiDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const tokenParams = event.params

  let address = changetype<Address>(tokenParams.chainWiki)
  let nft = new NFT(address)

  nft.setUriJson(tokenParams.data.kya, event)

  nft.symbol = tokenParams.data.symbol
  nft.name = tokenParams.data.name

  nft.slug = tokenParams.slug.toString()

  nft.admins = event.params.roles.admins.map<Bytes>((a) =>
    Bytes.fromHexString(a.toHexString()),
  )
  nft.editors = event.params.roles.editors.map<Bytes>((e) =>
    Bytes.fromHexString(e.toHexString()),
  )

  nft.updatedAt = event.block.timestamp
  nft.createdAt = event.block.timestamp
  nft.creator = event.params.roles.owner

  nft.save()
  factory.save()
}

export function handleUpdateNFTSlug(event: ContractSlugUpdated): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  nft.slug = event.params.slug.toString()

  nft.save()
}
