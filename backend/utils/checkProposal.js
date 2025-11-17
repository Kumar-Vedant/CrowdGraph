export function checkProposal(upvotes, downvotes, totalVotingPotential) {
  // minimum participation required
  const qMin = 0.05;
  const k = 0.4;

  const totalVotes = upvotes + downvotes;

  // if no votes cast
  if (totalVotes === 0) {
    return "PENDING";
  }

  // fraction of community potential that voted
  const participationRate = totalVotes / totalVotingPotential;
  // fraction of votes that are positive
  const yesRatio = upvotes / totalVotes;

  if (participationRate < qMin) {
    return "PENDING";
  }

  const acceptanceThreshold = 0.5 + k * (1 - participationRate);
  const rejectionThreshold = 0.5 - k * (1 - participationRate);

  // 5) Decide outcome with margin delta
  if (yesRatio >= acceptanceThreshold) {
    return "ACCEPT";
  }

  if (yesRatio <= rejectionThreshold) {
    return "REJECT";
  }

  return "PENDING";
}
