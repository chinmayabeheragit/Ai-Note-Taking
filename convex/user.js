import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
    args: {
        email: v.string(),
        username: v.string(), // Match the argument used in the client
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const user = await ctx.db.query('user')
            .filter((q) => q.eq(q.field('email'), args.email))
            .collect();

        // If not, insert
        if (user?.length === 0) {
            await ctx.db.insert('users', {
                email: args.email,
                username: args.username, // Match this too
                imageUrl: args.imageUrl,
                upgrade: false
            });
            return 'Inserted a new user';
        }

        return 'User already exists';
    }
})

export const userUpgradePlan=mutation({
    args:{
        userEmail:v.string(),
    },handler:async(ctx,args)=>{
        const result= await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args.userEmail)).collect();
        if(result){
            await ctx.db.patch(result[0]._id,{upgrade:true});
            return 'User upgraded';

        }
        return 'User not found';
    }
    
})


export const GetUserInfo=query({
    args:{
        userEmail:v.optional(v.string()),
    },
    handler:async(ctx,args)=>{
        if(!args.userEmail){
            return ;
        }
        const result= await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args?.userEmail)).collect();
        return result[0];
    }
})