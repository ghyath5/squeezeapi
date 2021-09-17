import { Context } from "../../../@types/types"
import { StepOption } from "../../../prisma/generated/typegraphql"

export const customizeOptionsSettings = async (stepOption:StepOption, {ctx,prisma,userId}:Context):Promise<Object>=>{
    if(stepOption.type == 'DATE_SELECT'){
        const list:object[] = []
        for(let day = 1; day <= 7;day++){
            let today = new Date(new Date().setDate(new Date().getDate()+day))
            let dayName = new Date(today).toLocaleString('en', {weekday:'short'})
            let dayNameAr = new Date(today).toLocaleString('ar', {weekday:'short'})
            list.push({
                text:`${dayName} ${today.getDate()}`,
                text_ar:`${dayNameAr} ${today.getDate()}`,
                value:`${dayName}-${today.getDate()}`
            })
        }
        return {
            list
        }
    }else if(stepOption.type == 'ADDRESS_MODEL'){
        if(!userId)return {list:[]}
        const addresses = await prisma.address.findMany({
            where:{
                userId:{equals:userId}
            },
            select:{
                id:true,
                area:true,
                buildingName:true,
                city:true,
                placeNumber:true,
                phoneNumber:true,
                place:true,
                primary:true
            }
        })
        return {
            list:addresses
        }
    }
    return stepOption.settings as Object
}