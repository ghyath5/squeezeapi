import {crudResolvers} from '@generated/type-graphql'
import {  NonEmptyArray} from 'type-graphql'
import { Auth } from './Auth';

export default [...crudResolvers,Auth] as NonEmptyArray<Function>