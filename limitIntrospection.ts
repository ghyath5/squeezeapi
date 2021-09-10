import { filterSchema,  } from '@graphql-tools/utils';
import { Request } from 'express-serve-static-core';
import { GraphQLSchema } from 'graphql';
export class FilterSchema {
    req: Request;
    constructor(req:Request){
        this.req = req
    }
    filter(typeExtensions,fieldConfig?,info?){
        let {typeName,fieldName,filter} = info
        const fieldExtensions = fieldConfig?.extensions
        const isLoggedIn = this.req?.payload
        const roles = this.req?.payload?.roles
        if(typeExtensions?.check){
            return typeExtensions?.check(isLoggedIn,roles)
        }
        if(fieldExtensions?.check){            
            return fieldExtensions?.check(isLoggedIn,roles)
        }
        if(typeExtensions?.hide || fieldExtensions?.hide){
            return false;
        }
        if(typeExtensions?.APP || fieldExtensions?.APP){
            return roles?.length && roles.includes('USER')
        }
        return true;
    }
    transformSchema(originalWrappingSchema:GraphQLSchema) {
        return filterSchema({
            schema: originalWrappingSchema,
            fieldFilter:(typeName,fieldName,fieldConfig)=>{
                const typeExtensions = originalWrappingSchema.getType(typeName)?.extensions
                return this.filter(typeExtensions,fieldConfig,{typeName,fieldName});
            },
            typeFilter:(typeName)=>{
                const typeExtensions = originalWrappingSchema.getType(typeName)?.extensions
                return this.filter(typeExtensions,{},{typeName});
            },
            rootFieldFilter:(typeName,fieldName,fieldConfig)=>{
                const typeExtensions = originalWrappingSchema.getType(typeName)?.extensions                
                return this.filter(typeExtensions,fieldConfig,{typeName,fieldName});
            },
            argumentFilter:(typeName,fieldName,argName,fieldConfig)=>{
                if(!argName || !fieldConfig) return true
                const typeExtensions = originalWrappingSchema.getType(argName)?.extensions
                return this.filter(typeExtensions,fieldConfig,{typeName,fieldName,filter:'args'})
            },
            objectFieldFilter:(typeName,fieldName,fieldConfig)=>{
                const typeExtensions = originalWrappingSchema.getType(typeName)?.extensions
                return this.filter(typeExtensions,fieldConfig,{typeName,fieldName});
            },
            inputObjectFieldFilter:(typeName,fieldName,fieldConfig)=>{
                const typeExtensions = originalWrappingSchema.getType(typeName)?.extensions
                return this.filter(typeExtensions,fieldConfig,{typeName,fieldName});
            }            
        })
    }

}
