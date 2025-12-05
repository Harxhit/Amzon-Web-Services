import mongoose from 'mongoose';
import User from './user.model';

const MONGO_URI = ''

async function fixCounts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to your real database');

    const fix1 = await User.updateMany(
      { $or: [{ followerCount: { $not: { $type: 1 } } }, { followerCount: { $lt: 0 } }, { followerCount: null }] },
      { $set: { followerCount: 0 } }
    );

    const fix2 = await User.updateMany(
      { $or: [{ followingCount: { $not: { $type: 1 } } }, { followingCount: { $lt: 0 } }, { followingCount: null }] },
      { $set: { followingCount: 0 } }
    );

    console.log(`SUCCESS  Fixed ${fix1.modifiedCount + fix2.modifiedCount} users`);
    console.log('Your followerCount & followingCount are now 100% clean!');

  } catch (error) {
    console.error('Failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit();
  }
}

fixCounts();