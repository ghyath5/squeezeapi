import './EnhanceTypes'
import {  Resolver} from 'type-graphql'
import { FindManyUserResolver, } from '../../../prisma/generated/typegraphql';


@Resolver()
class Queries extends FindManyUserResolver{
    
}


export default [Queries]


