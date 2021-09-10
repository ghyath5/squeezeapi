import {NonEmptyArray} from 'type-graphql'
import Service from './Services';
import UserResolvers from './User';
export default [...UserResolvers,...Service] as NonEmptyArray<Function>