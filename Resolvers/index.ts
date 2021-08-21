import {   NonEmptyArray} from 'type-graphql'
import { Auth } from './Auth';
import Service from './Services';
import {Me} from './User';
export default [Me,Auth,...Service] as NonEmptyArray<Function>