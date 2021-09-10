import { Extensions } from "type-graphql"
import { AddressUpdateManyWithoutUserInput, applyInputTypesEnhanceMap, applyRelationResolversEnhanceMap, applyResolversEnhanceMap } from "../prisma/generated/typegraphql"
import { sufficientRoles } from "./auth"

export const applyDecoratorsFields = (fieldsNames:string[],...decorator)=>{
    let fields = {}
    fieldsNames.map((name)=>{
        fields[name] = [...decorator]
    })
    return fields
}


export const hideInputFields = (fields)=>{
    fields.map((field)=>{
        applyInputTypesEnhanceMap({
            [field]:{
                class:[Extensions({hide:true})]
            }
        })
    })
}

export const showFieldsOnlyFor = (requiredRoles)=>{
    return Extensions({check: (isLoggedIn: Boolean, roles: string[]) => isLoggedIn && sufficientRoles(requiredRoles, roles)})
}


export const ExpandObject = (fields,val)=>{
    return fields.map((field)=>{
        let keys = field.split('.') as string[]
        return keys.reduceRight((acc:string | {}, currentValue:any) => {
            return { [currentValue]: acc }
        }, val)
    })
}

export const enhanceInputTypes = (fields:string[],value:any)=>{
    let objects = ExpandObject(fields,value)
    objects.map((object)=>{        
        applyInputTypesEnhanceMap(object)
    })
}

export const enhanceResolvers = (fields:string[],value:any)=>{
    let objects = ExpandObject(fields,value)
    objects.map((object)=>{
        applyResolversEnhanceMap(object)
    })
}

export const enhanceRelationResolvers = (fields:string[],value:any)=>{
    let objects = ExpandObject(fields,value)
    objects.map((object)=>{        
        applyRelationResolversEnhanceMap(object)
    })
}

export const enhanceInputOnlyConnect = (inputsTypes:string[])=>{
    inputsTypes.map((input)=>{
        applyInputTypesEnhanceMap({
            [input]:{
                fields:{
                    create:[Extensions({hide:true})],
                    connectOrCreate:[Extensions({hide:true})]
                }
            }
        })
    })    
}

export const enhanceHideInputClass = (inputClass:string[])=>{
    inputClass.map((input)=>{
        applyInputTypesEnhanceMap({
            [input]:{
                class:[Extensions({hide:true})]
            }
        })
    })
}