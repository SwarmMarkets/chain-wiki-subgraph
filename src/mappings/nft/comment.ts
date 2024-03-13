import { store, json, log, JSONValue } from '@graphprotocol/graph-ts'
import { CommentRemoved, Commented } from '../../types/templates/NFT/SX1155NFT'
import { Comment } from '../../wrappers/comment'
import { Token } from '../../wrappers/nft-token'
import { jsonUtils } from '../../utils/json'

export function handleComment(event: Commented): void {
  const nftAddress = event.address
  const tokenId = event.params.tokenId
  const commentId = event.params.commentId

  const tokenCreatedId = Token.buildID(nftAddress, tokenId)
  const comment = new Comment(nftAddress, tokenId, commentId)

  const commentJsonValue = json.fromString(event.params.comment)

  if (commentJsonValue.isNull()) {
    log.warning('WARNING: Failed to parse json from string', [])
    return
  }

  const commentData = commentJsonValue.toObject()

  if (commentData.entries.length === 0) {
    log.warning('WARNING: JSON is empty tokenId {}', [tokenCreatedId])
    return
  }

  const jsonSectionId = changetype<JSONValue | null>(
    commentData.get('sectionId'),
  )
  const sectionId = jsonUtils.parseString(jsonSectionId)

  if (sectionId && isNullable(sectionId) === false) {
    comment.sectionId = sectionId
  }

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
