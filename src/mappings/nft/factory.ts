import { Address, Bytes, dataSource, log } from '@graphprotocol/graph-ts'
import {
  ChainWikiDeployed,
  ContractSlugUpdated,
} from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: ChainWikiDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const nftParams = event.params

  let address = changetype<Address>(nftParams.chainWiki)
  let nft = new NFT(address)

  nft.setUriJson(nftParams.data.kya, event)

  nft.symbol = nftParams.data.symbol
  nft.name = nftParams.data.name

  nft.slug = nftParams.slug.toString()

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
  log.warning('UPDATE SLUG EVENT: {}', [event.params.slug.toString()])
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)
  const nft = NFT.mustLoad(event.address.toHexString())
  log.warning('update slug NFT: {}', [event.address.toHexString()])
  log.warning('update slug: {}', [event.params.slug.toString()])

  nft.slug = event.params.slug.toString()

  nft.save()
  factory.save()
}
