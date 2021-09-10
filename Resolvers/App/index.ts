import {   NonEmptyArray} from 'type-graphql'
import { Auth } from './Auth';
import controller from './controller';
export default [Auth,...controller] as NonEmptyArray<Function>