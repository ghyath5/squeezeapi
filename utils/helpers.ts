export const applyDecoratorsFields = (fieldsNames:string[],...decorator)=>{
    let fields = {}
    fieldsNames.map((name)=>{
        fields[name] = [...decorator]
    })
    return fields
}