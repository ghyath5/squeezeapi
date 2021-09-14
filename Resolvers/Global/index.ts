import {NonEmptyArray} from 'type-graphql'
import Service from './Services';
import UserResolvers from './User';
// import OrderResolvers from './Order';
export default [
    // ...OrderResolvers,
    ...UserResolvers,...Service] as NonEmptyArray<Function>