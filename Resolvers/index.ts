import {   NonEmptyArray} from 'type-graphql'
import { Auth } from './Auth';
import Service from './Services';
import UserResolvers from './User';
export default [Auth,...UserResolvers,...Service] as NonEmptyArray<Function>