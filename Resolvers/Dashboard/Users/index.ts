import './EnhanceTypes'
import {  Resolver} from 'type-graphql'
import { FindManyUserResolver,AggregateUserResolver } from '../../../prisma/generated/typegraphql';

@Resolver()
class Queries {
    
}


export default [Queries,FindManyUserResolver,AggregateUserResolver]