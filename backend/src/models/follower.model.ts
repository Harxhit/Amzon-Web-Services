import mongoose , { Schema , Types} from 'mongoose'

const followerSchema = new Schema({
    userWhoIsGettingFollowed : {
        type: Types.ObjectId, 
        ref: 'User', 
        required: true
    }, 
    userWhoIsFollowingId: {
        type: Types.ObjectId, 
        ref : 'User', 
        required: true, 
    }, 
    isFollowed: {
        type : Boolean, 
        default : false, 
    } 
}, {timestamps: true})

followerSchema.index(
    { userWhoIsGettingFollowed: 1,userWhoIsFollowingId : 1 }
    ,{unique: true}
)

const Follower = mongoose.model('Follower',followerSchema)
export default Follower