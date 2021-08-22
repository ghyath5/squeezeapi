import { ExpressContext } from "apollo-server-express";
import redis from "redis";
export const client = redis.createClient({ url: process.env.DB_REDIS_URL });

client.on("error", function(error) {
  console.error(error);
});
const prefix = 'squeeze:'

export const quickStore = (ctx?:ExpressContext)=>{
    let userId = ctx?.req?.payload?.userId
    return {
        set:async (key: string,value: string,expires: number)=>{
            key = `${prefix}${key}`
            client.set(key,value)
            client.expire(key,expires)
        },
        get:async(key:string):Promise<string>=>{
            key = `${prefix}${key}`
            return await new Promise((r)=>{
                client.get(key,(err,reply)=>{
                    if(err||!reply)return r("")
                    return r(reply)
                })
            })
        },
        inc:(key: string):void=>{
            key = `${prefix}${key}`
            client.incr(key)
        },
        setTable:(uid?:string|undefined,...data: any):Boolean=>{
            if(!userId && !uid)return false;
            let uuid = userId || uid
            let key = `${prefix}${uuid}`
            client.hset(key,...data)
            return true
        },
        getTable:async (field: string,uid?:any|undefined)=>{
            if(!userId && !uid)return false;
            let uuid = userId || uid
            let key = `${prefix}${uuid}`
            return await new Promise((r)=>{
                client.hget(key,field,(e,reply)=>{
                    if(e||!reply)return r("")
                    return r(reply)
                })
            })
        }
    }
}
export type StoreType = ReturnType<typeof quickStore>;  // string