import { TokenURIUpdate } from '../../types/schema'
import { TokenURISet, Minted } from '../../types/templates/NFT/SX1155NFT'
import { Token } from '../../wrappers/nft-token'

export function handleCreateToken(event: Minted): void {
  const nftAddress = event.address
  const tokenId = event.params.tokenId

  const token = new Token(nftAddress, tokenId)

  token.setUriJson(event.params.uri)

  token.updatedAt = event.block.timestamp
  token.createdAt = event.block.timestamp
  token.nft = nftAddress.toHexString()

  token.save()
}

export function handleUpdateTokenUri(event: TokenURISet): void {
  const nftAddress = event.address
  const tokenId = event.params.id

  const token = Token.mustLoad(nftAddress, tokenId)
  const changedFields = token.setUriJson(event.params.uri)

  token.updatedAt = event.block.timestamp

  if (
    changedFields !== null &&
    changedFields.uri !== null &&
    changedFields.previousUri !== null
  ) {
    const updatedToken = new TokenURIUpdate(
      event.transaction.hash.toHexString() + '-' + event.logIndex.toHexString(),
    )

    updatedToken.updatedAt = event.block.timestamp
    updatedToken.token = token.id
    updatedToken.nft = token.nft
    updatedToken.newURI = event.params.uri
    updatedToken.previousURI = token.uri
    updatedToken.save()
  }

  token.save()
}
