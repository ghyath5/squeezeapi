import {   NonEmptyArray} from 'type-graphql'
import { Auth } from './Auth';
import controller from './controller';
import Order from './Order';
export default [Auth,...controller,...Order] as NonEmptyArray<Function>