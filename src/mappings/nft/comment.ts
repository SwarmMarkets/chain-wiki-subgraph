import { store } from '@graphprotocol/graph-ts'
import { CommentRemoved, Commented } from '../../types/templates/NFT/SX1155NFT'
import { Comment } from '../../wrappers/comment'
import { Token } from '../../wrappers/nft-token'

export function handleComment(event: Commented): void {
  const nftAddress = event.address
  const tokenId = event.params.tokenId
  const commentId = event.params.commentId

  const tokenCreatedId = Token.buildID(nftAddress, tokenId)
  const comment = new Comment(nftAddress, tokenId, commentId)
  comment.uri = event.params.comment
  comment.commentator = event.params.commentator
  comment.createdAt = event.block.timestamp
  comment.token = tokenCreatedId

  comment.save()
}

export function handleCommetRemoved(event: CommentRemoved): void {
  const nftAddress = event.address
  const tokenId = event.params.tokenId
  const commentId = event.params.commentId
  const id = Comment.buildID(nftAddress, tokenId, commentId)

  store.remove('Comment', id)
}
