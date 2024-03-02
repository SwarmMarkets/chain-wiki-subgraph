import { Address, BigInt, log } from '@graphprotocol/graph-ts/index'

import { Comment as SchematicComment } from '../types/schema'

export class Comment extends SchematicComment {
  constructor(nftAddress: Address, tokenId: BigInt, commentId: BigInt) {
    const id = Comment.buildID(nftAddress, tokenId, commentId)
    super(id)
  }

  static buildID(
    nftAddress: Address,
    tokenId: BigInt,
    commentId: BigInt,
  ): string {
    const address = nftAddress.toHexString()
    const id = tokenId.toHexString()
    const comment = commentId.toHexString()
    return address.concat('-').concat(id).concat('-').concat(comment)
  }

  static mustLoad(
    nftAddress: Address,
    tokenId: BigInt,
    commentId: BigInt,
  ): Comment {
    const id = Comment.buildID(nftAddress, tokenId, commentId)
    let entity = Comment.load(id)

    if (entity === null) {
      log.critical('Comment not found: {}', [id])
    }

    return changetype<Comment>(entity)
  }
}
