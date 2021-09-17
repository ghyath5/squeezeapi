import {   NonEmptyArray } from 'type-graphql'
import { Auth } from './Auth';
import Users from './Users';
import Orders from './Orders';

export default [Auth,...Users,...Orders] as NonEmptyArray<Function>