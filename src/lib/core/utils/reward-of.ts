const REWARD_DECAY_NUMERATOR = 9999966993045875n;
const REWARD_DECAY_DENOMINATOR = 10000000000000000n;
const FIRST_EPOCH_REWARD = 50000000000000000000n;

/// returns mint amount of epoch reward (WORM amount)
export const rewardOf = async (epoch: bigint): Promise<bigint> => {
  let reward = FIRST_EPOCH_REWARD;
  for (let i = 0n; i < epoch; i++) {
    reward = (reward * REWARD_DECAY_NUMERATOR) / REWARD_DECAY_DENOMINATOR;
    // giving up on CPU a lil bit to prevent lag
    if (i % 10000n === 0n) await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return reward;
};

/// more efficient way to calculate by skipping lots of steps
export const rewardOfWithSample = (epoch: bigint, sampleEpoch: bigint, sampleEpochReward: bigint): bigint => {
  if (epoch == sampleEpoch) return sampleEpochReward;

  let i = sampleEpoch;
  let reward = sampleEpochReward;
  if (epoch > sampleEpoch) {
    while (i !== epoch) {
      reward = (reward * REWARD_DECAY_NUMERATOR) / REWARD_DECAY_DENOMINATOR;
      i++;
    }
  } else {
    while (i !== epoch) {
      reward = (reward * REWARD_DECAY_DENOMINATOR) / REWARD_DECAY_NUMERATOR;
      i--;
    }
  }

  return reward;
};
