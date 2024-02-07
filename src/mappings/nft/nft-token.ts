import { TokenURIUpdate } from '../../types/schema'
import {
  TokenKyaUpdated,
  TransferSingle,
} from '../../types/templates/NFT/SX1155NFT'
import { Token } from '../../wrappers/nft-token'

export function handleCreateNFTToken(event: TransferSingle): void {
  const nftAddress = event.address
  const tokenId = event.params.id

  const token = new Token(nftAddress, tokenId)
  token.updatedAt = event.block.timestamp
  token.createdAt = event.block.timestamp
  token.nft = nftAddress.toHexString()

  token.save()
}

export function handleUpdateNFTTokenKya(event: TokenKyaUpdated): void {
  const nftAddress = event.address
  const tokenId = event.params.id

  const token = Token.mustLoad(nftAddress, tokenId)
  token.uri = event.params.kya
  token.updatedAt = event.block.timestamp

  const updatedToken = new TokenURIUpdate(
    event.transaction.hash.toHexString() + '-' + event.logIndex.toHexString(),
  )

  updatedToken.updatedAt = event.block.timestamp
  updatedToken.token = token.id
  updatedToken.nft = token.nft
  updatedToken.newURI = event.params.kya
  updatedToken.previousURI = token.uri

  token.save()
  updatedToken.save()
}
